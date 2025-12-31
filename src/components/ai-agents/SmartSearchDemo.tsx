import { useState } from "react";
import { Search, ExternalLink, Star, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { tools } from "@/data/tools";

interface SearchResult {
  id: string;
  name: string;
  description: string;
  url: string;
  relevance: number;
  reason: string;
}

const SmartSearchDemo = () => {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchReasons: Record<string, Record<string, string>> = {
    es: {
      email: "Ideal para automatizar campañas y seguimiento de leads por email",
      crm: "Perfecto para gestionar relaciones con clientes y pipeline de ventas",
      analytics: "Te ayudará a medir y optimizar el rendimiento de tus acciones",
      prospecting: "Excelente para encontrar y calificar nuevos prospectos",
      automation: "Automatiza tareas repetitivas para enfocarte en vender",
      communication: "Mejora la comunicación con tu equipo y clientes",
    },
    en: {
      email: "Ideal for automating campaigns and email lead follow-up",
      crm: "Perfect for managing customer relationships and sales pipeline",
      analytics: "Will help you measure and optimize your actions' performance",
      prospecting: "Excellent for finding and qualifying new prospects",
      automation: "Automate repetitive tasks to focus on selling",
      communication: "Improve communication with your team and clients",
    },
  };

  const getReasonForTool = (tool: typeof tools[0]) => {
    const reasons = searchReasons[language];
    if (tool.categoryId === "email-marketing") return reasons.email;
    if (tool.categoryId === "crm") return reasons.crm;
    if (tool.categoryId === "seo-analytics") return reasons.analytics;
    if (tool.categoryId === "prospecting" || tool.categoryId === "cold-calling") return reasons.prospecting;
    if (tool.categoryId === "productivity") return reasons.automation;
    return reasons.communication;
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);

    setTimeout(() => {
      const searchTerms = query.toLowerCase().split(" ");
      
      const matchedTools = tools
        .map((tool) => {
          const nameMatch = searchTerms.some((term) =>
            tool.name.toLowerCase().includes(term)
          );
          const descMatch = searchTerms.some((term) =>
            tool.description.en.toLowerCase().includes(term) ||
            tool.description.es.toLowerCase().includes(term)
          );
          const categoryMatch = searchTerms.some((term) =>
            tool.categoryId.toLowerCase().includes(term)
          );
          const needsMatch = tool.needs?.some((need) =>
            searchTerms.some((term) => need.toLowerCase().includes(term))
          );

          let relevance = 0;
          if (nameMatch) relevance += 40;
          if (descMatch) relevance += 30;
          if (categoryMatch) relevance += 20;
          if (needsMatch) relevance += 10;

          // Bonus for common sales terms
          const salesTerms = ["ventas", "sales", "lead", "crm", "email", "prospecting", "llamadas", "calls"];
          if (salesTerms.some((term) => query.toLowerCase().includes(term))) {
            relevance += 15;
          }

          return {
            id: tool.id,
            name: tool.name,
            description: language === "es" ? tool.description.es : tool.description.en,
            url: tool.url,
            relevance,
            reason: getReasonForTool(tool),
          };
        })
        .filter((result) => result.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 5);

      // If no matches, show random relevant tools
      if (matchedTools.length === 0) {
        const randomTools = tools
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((tool) => ({
            id: tool.id,
            name: tool.name,
            description: language === "es" ? tool.description.es : tool.description.en,
            url: tool.url,
            relevance: 50,
            reason: getReasonForTool(tool),
          }));
        setResults(randomTools);
      } else {
        setResults(matchedTools);
      }

      setIsSearching(false);
    }, 800);
  };

  const getPricingIcon = (pricing: string) => {
    switch (pricing) {
      case "free":
        return <Badge variant="secondary" className="text-xs">Free</Badge>;
      case "freemium":
        return <Badge variant="outline" className="text-xs">Freemium</Badge>;
      default:
        return <Badge className="text-xs">Paid</Badge>;
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="w-5 h-5 text-primary" />
          {language === "es" ? "Buscador Inteligente de Herramientas" : "Smart Tool Finder"}
          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full ml-auto">
            Demo
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
                ? "Ej: herramienta para enviar emails en frío"
                : "E.g.: tool for sending cold emails"
            }
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {isSearching && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              {language === "es" ? "Buscando las mejores herramientas..." : "Finding the best tools..."}
            </div>
          </div>
        )}

        {results.length > 0 && !isSearching && (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              {language === "es" ? "Herramientas recomendadas:" : "Recommended tools:"}
            </p>
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 rounded-lg border bg-background hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{result.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, Math.ceil(result.relevance / 20)))].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {result.description}
                    </p>
                    <p className="text-xs text-primary mt-1 italic">
                      💡 {result.reason}
                    </p>
                  </div>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Button size="sm" variant="outline" className="h-8">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !isSearching && query && (
          <p className="text-sm text-center text-muted-foreground py-4">
            {language === "es"
              ? "No se encontraron herramientas. Intenta con otros términos."
              : "No tools found. Try different terms."}
          </p>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? "💡 Demo: Búsqueda por coincidencia de texto. Conecta una API de IA para búsqueda semántica."
            : "💡 Demo: Text matching search. Connect an AI API for semantic search."}
        </p>
      </CardContent>
    </Card>
  );
};

export default SmartSearchDemo;
