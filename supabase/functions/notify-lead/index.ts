import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting: Simple in-memory store (resets on function cold start)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // submissions per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(clientId);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function sanitizeString(str: string | undefined, maxLength: number): string | null {
  if (!str) return null;
  // Remove potential HTML/script tags and trim
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

interface LeadData {
  email: string;
  name?: string;
  message?: string;
  source?: string;
  // Honeypot field - if filled, it's a bot
  website?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client identifier for rate limiting
    const clientId = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'anonymous';
    
    // Check rate limit
    if (isRateLimited(clientId)) {
      console.warn(`Rate limit exceeded for client: ${clientId.slice(0, 8)}...`);
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const leadData: LeadData = await req.json();

    // Honeypot check - if website field is filled, it's a bot
    if (leadData.website) {
      console.log("Bot detected via honeypot field");
      // Return fake success to not alert the bot
      return new Response(
        JSON.stringify({ success: true, message: "Lead captured successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate required fields
    if (!leadData.email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    if (!validateEmail(leadData.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = leadData.email.trim().toLowerCase().slice(0, 255);
    const sanitizedName = sanitizeString(leadData.name, 100);
    const sanitizedMessage = sanitizeString(leadData.message, 1000);
    const sanitizedSource = sanitizeString(leadData.source, 50) || "landing";

    // Initialize Supabase client with service role for insert
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Configuration error: Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        email: sanitizedEmail,
        name: sanitizedName,
        message: sanitizedMessage,
        source: sanitizedSource,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", {
        code: insertError.code,
        message: insertError.message,
        timestamp: new Date().toISOString()
      });
      
      // Handle duplicate email gracefully
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: "This email has already been submitted." }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Unable to save your information. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Lead saved successfully:", lead.id);

    // Send Zapier notification if webhook URL is configured
    const zapierWebhookUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    if (zapierWebhookUrl) {
      try {
        await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_id: lead.id,
            email: sanitizedEmail,
            name: sanitizedName,
            message: sanitizedMessage,
            source: sanitizedSource,
            timestamp: new Date().toISOString(),
          }),
        });
        
        // Update lead with zapier notification status
        await supabase
          .from("leads")
          .update({ zapier_notified: true })
          .eq("id", lead.id);
          
        console.log("Zapier notification sent for lead:", lead.id);
      } catch (zapierError) {
        console.error("Error sending Zapier notification:", zapierError);
      }
    }

    // Send email notification if Resend API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const notificationEmail = Deno.env.get("NOTIFICATION_EMAIL");
    
    if (resendApiKey && notificationEmail) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Leads <noreply@resend.dev>",
            to: [notificationEmail],
            subject: `🎯 Nuevo Lead: ${sanitizedName || sanitizedEmail}`,
            html: `
              <h2>¡Nuevo lead capturado!</h2>
              <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${sanitizedEmail}</td>
                </tr>
                ${sanitizedName ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nombre:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${sanitizedName}</td>
                </tr>
                ` : ""}
                ${sanitizedMessage ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mensaje:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${sanitizedMessage}</td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Fuente:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${sanitizedSource}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Fecha:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString("es-ES")}</td>
                </tr>
              </table>
            `,
          }),
        });

        if (emailResponse.ok) {
          await supabase
            .from("leads")
            .update({ email_notified: true })
            .eq("id", lead.id);
          console.log("Email notification sent for lead:", lead.id);
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Lead captured successfully",
        lead_id: lead.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    // Log detailed error server-side for debugging
    console.error("Error in notify-lead function:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Return generic user-friendly error to client
    return new Response(
      JSON.stringify({ error: "Unable to process your request. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});