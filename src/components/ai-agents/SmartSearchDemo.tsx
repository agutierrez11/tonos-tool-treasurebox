import { useState, useMemo } from "react";
import { Search, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { tools, categories, type Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

const pricingColors = {
  free: "bg-emerald-500",
  freemium: "bg-amber-500",
  paid: "bg-rose-500",
};

const SmartSearchDemo = () => {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Local search - searches directly in tools array
  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    
    return tools.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(searchTerm);
      const descMatch = tool.description[language].toLowerCase().includes(searchTerm);
      const categoryMatch = categories.find(c => c.id === tool.categoryId)?.name[language].toLowerCase().includes(searchTerm);
      return nameMatch || descMatch || categoryMatch;
    }).slice(0, 8); // Limit to 8 results
  }, [query, language]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simulate brief loading for UX
    setTimeout(() => setIsSearching(false), 200);
  };

  // Quick suggestions
  const suggestions = language === "es"
    ? ["CRM", "email", "IA", "automatización", "leads", "Gemini", "Manus"]
    : ["CRM", "email", "AI", "automation", "leads", "Gemini", "Manus"];

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name[language] || categoryId;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="w-5 h-5 text-primary" />
          {language === "es" ? "Buscador de Herramientas" : "Tool Finder"}
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
                ? "Buscar por nombre, categoría..."
                : "Search by name, category..."
            }
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching} size="icon">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick suggestions */}
        {!query && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Search Results */}
        {query.length >= 2 && (
          <div className="space-y-2">
            {searchResults.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground">
                  {searchResults.length} {language === "es" ? "resultados" : "results"}
                </p>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {searchResults.map((tool) => (
                    <ToolResultItem key={tool.id} tool={tool} language={language} getCategoryName={getCategoryName} />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {language === "es" 
                  ? "No se encontraron herramientas. Prueba otro término."
                  : "No tools found. Try another term."}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? `🔍 Buscando en ${tools.length} herramientas`
            : `🔍 Searching ${tools.length} tools`}
        </p>
      </CardContent>
    </Card>
  );
};

interface ToolResultItemProps {
  tool: Tool;
  language: "es" | "en";
  getCategoryName: (id: string) => string;
}

const ToolResultItem = ({ tool, language, getCategoryName }: ToolResultItemProps) => {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2 rounded-md border border-border/50 hover:border-primary/40 hover:bg-muted/50 transition-all group"
    >
      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold text-primary">
          {tool.name.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
            {tool.name}
          </span>
          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", pricingColors[tool.pricing])} />
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {tool.description[language]}
        </p>
        <span className="text-[10px] text-muted-foreground/70">
          {getCategoryName(tool.categoryId)}
        </span>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </a>
  );
};

export default SmartSearchDemo;
