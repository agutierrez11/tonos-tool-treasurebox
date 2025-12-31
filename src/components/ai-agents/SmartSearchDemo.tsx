import { useState } from "react";
import { Search, ExternalLink, Star, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { tools } from "@/data/tools";

const SmartSearchDemo = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setAiResponse("");

    // Create a summary of available tools for context
    const toolsSummary = tools.slice(0, 30).map(t => 
      `- ${t.name}: ${language === "es" ? t.description.es : t.description.en} (${t.categoryId}, ${t.pricing})`
    ).join("\n");

    const prompt = language === "es"
      ? `El usuario busca: "${query}"

Herramientas disponibles en nuestro catálogo:
${toolsSummary}

Basándote en la búsqueda del usuario:
1. Recomienda las 3 herramientas más relevantes de la lista
2. Explica brevemente por qué cada una es útil para su necesidad
3. Si ninguna herramienta encaja perfectamente, sugiere la más cercana y explica qué considerar

Responde de forma concisa y práctica.`
      : `User is looking for: "${query}"

Tools available in our catalog:
${toolsSummary}

Based on the user's search:
1. Recommend the 3 most relevant tools from the list
2. Briefly explain why each is useful for their need
3. If no tool fits perfectly, suggest the closest one and explain what to consider

Respond concisely and practically.`;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            type: "search",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la respuesta");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  content += delta;
                  setAiResponse(content);
                }
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        title: language === "es" ? "Error" : "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Quick suggestions
  const suggestions = language === "es"
    ? ["CRM para startups", "Automatizar emails fríos", "Verificar emails", "Análisis de competencia"]
    : ["CRM for startups", "Automate cold emails", "Email verification", "Competitor analysis"];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="w-5 h-5 text-primary" />
          {language === "es" ? "Buscador Inteligente de Herramientas" : "Smart Tool Finder"}
          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full ml-auto">
            IA Real
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={
              language === "es"
                ? "Describe qué necesitas..."
                : "Describe what you need..."
            }
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!aiResponse && !isSearching && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                }}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {language === "es" ? "Buscando con IA..." : "Searching with AI..."}
            </div>
          </div>
        )}

        {aiResponse && (
          <div className="p-3 rounded-lg border bg-muted/30 max-h-64 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? "🤖 Powered by Lovable AI - Búsqueda semántica inteligente"
            : "🤖 Powered by Lovable AI - Intelligent semantic search"}
        </p>
      </CardContent>
    </Card>
  );
};

export default SmartSearchDemo;
