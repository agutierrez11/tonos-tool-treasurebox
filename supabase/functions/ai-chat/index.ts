import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting: Simple in-memory store (resets on function cold start)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

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
function validateInput(data: unknown): { valid: boolean; error?: string; messages?: Array<{ role: string; content: string }>; type?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const { messages, type } = data as { messages?: unknown; type?: unknown };
  
  // Validate messages array
  if (!messages || !Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: 'Messages array cannot be empty' };
  }
  
  if (messages.length > 50) {
    return { valid: false, error: 'Too many messages (max 50)' };
  }
  
  // Validate each message
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: 'Invalid message format' };
    }
    
    const { role, content } = msg as { role?: unknown; content?: unknown };
    
    if (typeof role !== 'string' || !['user', 'assistant', 'system'].includes(role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    
    if (typeof content !== 'string') {
      return { valid: false, error: 'Message content must be a string' };
    }
    
    if (content.length > 10000) {
      return { valid: false, error: 'Message content too long (max 10000 chars)' };
    }
  }
  
  // Validate type if provided
  if (type !== undefined && typeof type !== 'string') {
    return { valid: false, error: 'Type must be a string' };
  }
  
  const validTypes = ['chat', 'content', 'analyzer', 'search', undefined];
  if (type && !validTypes.includes(type as string)) {
    return { valid: false, error: 'Invalid type value' };
  }
  
  return { 
    valid: true, 
    messages: messages as Array<{ role: string; content: string }>,
    type: type as string | undefined
  };
}

const TOOLS_CONTEXT = `
Eres un asistente de ventas experto. Tienes acceso a un catálogo de herramientas digitales para vendedores.

CATEGORÍAS DISPONIBLES:
- Email Marketing: Mailchimp, Brevo, Lemlist, Instantly, Apollo.io, Smartlead
- CRM: HubSpot, Pipedrive, Salesforce, Zoho CRM, Monday Sales CRM
- SEO & Analytics: Semrush, Ahrefs, Google Analytics, Hotjar, Clarity
- Cold Calling: Aircall, JustCall, Dialpad, CloudTalk
- Prospecting: LinkedIn Sales Navigator, Apollo.io, ZoomInfo, Lusha
- AI Writing: ChatGPT, Claude, Jasper, Copy.ai, Writesonic
- Productivity: Notion, Trello, Asana, Monday.com, ClickUp
- Video & Webinars: Loom, Zoom, Riverside, StreamYard

MÉTRICAS DE REFERENCIA B2B:
- Tasa de contacto objetivo: 40-60%
- Tasa de reuniones desde llamadas: 20-35%
- Tasa de cierre desde reuniones: 25-40%
- Tasa de apertura de emails: 20-40%
- Tasa de respuesta de emails fríos: 5-15%

Responde siempre en el idioma del usuario (español o inglés).
Sé conciso, práctico y enfocado en soluciones.
Cuando recomiendes herramientas, explica brevemente por qué son útiles para el caso específico.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client identifier for rate limiting (use IP or a hash)
    const clientId = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'anonymous';
    
    // Check rate limit
    if (isRateLimited(clientId)) {
      console.warn(`Rate limit exceeded for client: ${clientId}`);
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Espera un momento antes de intentar de nuevo." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    let requestData: unknown;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.warn(`Input validation failed: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, type } = validation;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("Configuration error: AI API key is missing");
      return new Response(
        JSON.stringify({ error: "El servicio de IA no está disponible en este momento. Contacta al administrador." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let systemPrompt = TOOLS_CONTEXT;
    
    // Adjust system prompt based on type
    if (type === "content") {
      systemPrompt += `
      
MODO GENERADOR DE CONTENIDO:
Genera contenido de ventas profesional y persuasivo.
Tipos de contenido que puedes crear:
- Emails de ventas (fríos, seguimiento, cierre)
- Scripts de llamadas telefónicas
- Mensajes de LinkedIn
- Propuestas comerciales breves

Usa variables como [Nombre], [Empresa], [Producto] para personalización.
Incluye un asunto atractivo para emails.
Estructura el contenido con secciones claras.`;
    } else if (type === "analyzer") {
      systemPrompt += `

MODO ANALIZADOR DE DATOS:
Analiza métricas de ventas y proporciona insights accionables.
Compara con benchmarks de la industria.
Identifica cuellos de botella en el embudo.
Sugiere herramientas específicas para mejorar cada métrica.
Prioriza las recomendaciones por impacto potencial.`;
    } else if (type === "search") {
      systemPrompt += `

MODO BUSCADOR INTELIGENTE:
Ayuda a encontrar las herramientas ideales según necesidades específicas.
Considera: presupuesto, experiencia del usuario, integraciones necesarias.
Proporciona alternativas cuando sea posible.
Explica pros y contras de cada opción.`;
    }

    console.log(`AI Chat request - Type: ${type || 'chat'}, Messages: ${messages!.length}, Client: ${clientId.slice(0, 8)}...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages!,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de uso alcanzado. Intenta de nuevo en unos minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Contacta al administrador." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    // Log detailed error internally for debugging
    console.error("AI Chat error:", error instanceof Error ? error.message : error);
    
    // Return generic error message to client (never expose internal details)
    return new Response(
      JSON.stringify({ error: "Ha ocurrido un error procesando tu solicitud. Intenta de nuevo." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
