import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface DiscoveredTool {
  name: string;
  url: string;
  description: string;
  category: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, query } = await req.json();

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query based on category
    const searchQueries: Record<string, string> = {
      'email-marketing': 'best email marketing tools 2024 2025',
      'email-tools': 'email verification deliverability warmup tools',
      'ai-writing': 'AI writing content generation copywriting tools',
      'seo-analytics': 'SEO analytics keyword research tools',
      'social-media': 'social media management automation tools LinkedIn',
      'sales-crm': 'sales CRM outreach automation tools B2B',
      'lead-generation': 'lead generation prospecting tools B2B',
      'ai-tools': 'AI productivity automation tools 2024 2025',
      'design-media': 'design graphic video creation tools',
      'education': 'online courses sales training resources',
      'productivity': 'productivity project management tools',
    };

    const searchQuery = query || searchQueries[category] || `best ${category} tools 2024 2025`;

    console.log('Searching for tools with query:', searchQuery);

    // Use Firecrawl search to find relevant tools
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 10,
        lang: 'es',
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Firecrawl search error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Search failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchData = await searchResponse.json();
    console.log('Found results:', searchData.data?.length || 0);

    // Now use Lovable AI to categorize and extract tool information
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resultsText = searchData.data?.map((r: any) => 
      `URL: ${r.url}\nTitle: ${r.title}\nDescription: ${r.description || ''}\nContent: ${(r.markdown || '').slice(0, 500)}`
    ).join('\n\n---\n\n') || '';

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a tool discovery assistant. Extract digital marketing and productivity tools from the search results.
            
For each tool found, provide:
- name: The tool's name
- url: The official website URL (not blog/review sites)
- description_es: Brief description in Spanish (max 100 chars)
- description_en: Brief description in English (max 100 chars)
- suggested_category: One of: email-marketing, email-tools, ai-writing, seo-analytics, social-media, sales-crm, lead-generation, ai-tools, design-media, education, productivity
- icon: Suggested Lucide icon name (Mail, Bot, Target, Users, etc.)
- pricing: One of: free, paid, freemium
- level: Array of: beginner, junior, senior

Return a JSON array of tools. Only include actual SaaS/tools, not articles or blog posts.`
          },
          {
            role: 'user',
            content: `Extract tools from these search results for category "${category}":\n\n${resultsText}`
          }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI processing failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '{}';
    
    let tools: DiscoveredTool[] = [];
    try {
      const parsed = JSON.parse(content);
      tools = parsed.tools || parsed.data || (Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    console.log('Extracted tools:', tools.length);

    return new Response(
      JSON.stringify({ success: true, tools }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error discovering tools:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
