import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    console.log(`AI Chat request - Type: ${type || 'chat'}, Messages: ${messages.length}`);

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
          ...messages,
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
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
