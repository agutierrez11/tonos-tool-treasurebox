import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadData {
  email: string;
  name?: string;
  message?: string;
  source?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadData = await req.json();

    // Validate required fields
    if (!leadData.email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role for insert
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        email: leadData.email,
        name: leadData.name || null,
        message: leadData.message || null,
        source: leadData.source || "landing",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting lead:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save lead" }),
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
            email: leadData.email,
            name: leadData.name,
            message: leadData.message,
            source: leadData.source,
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
            subject: `🎯 Nuevo Lead: ${leadData.name || leadData.email}`,
            html: `
              <h2>¡Nuevo lead capturado!</h2>
              <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${leadData.email}</td>
                </tr>
                ${leadData.name ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nombre:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${leadData.name}</td>
                </tr>
                ` : ""}
                ${leadData.message ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mensaje:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${leadData.message}</td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Fuente:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${leadData.source || "landing"}</td>
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
    console.error("Error in notify-lead function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
