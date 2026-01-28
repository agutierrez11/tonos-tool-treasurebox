import { useState } from "react";
import { Search, Sparkles, Plus, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { categories } from "@/data/tools";
import { supabase } from "@/integrations/supabase/client";

interface DiscoveredTool {
  name: string;
  url: string;
  description_es?: string;
  description_en?: string;
  suggested_category?: string;
  icon?: string;
  pricing?: string;
  level?: string[];
}

const ToolDiscovery = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customQuery, setCustomQuery] = useState("");
  const [discoveredTools, setDiscoveredTools] = useState<DiscoveredTool[]>([]);

  const handleDiscover = async () => {
    if (!selectedCategory && !customQuery) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" 
          ? "Selecciona una categoría o escribe una búsqueda" 
          : "Select a category or enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setDiscoveredTools([]);

    try {
      const { data, error } = await supabase.functions.invoke('discover-tools', {
        body: { 
          category: selectedCategory,
          query: customQuery,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.success && data.tools) {
        setDiscoveredTools(data.tools);
        toast({
          title: language === "es" ? "¡Herramientas encontradas!" : "Tools found!",
          description: language === "es" 
            ? `Se encontraron ${data.tools.length} herramientas` 
            : `Found ${data.tools.length} tools`,
        });
      } else {
        toast({
          title: language === "es" ? "Sin resultados" : "No results",
          description: language === "es" 
            ? "No se encontraron herramientas nuevas" 
            : "No new tools found",
        });
      }
    } catch (error) {
      console.error('Discovery error:', error);
      toast({
        title: "Error",
        description: language === "es" 
          ? "Error al buscar herramientas. Intenta de nuevo." 
          : "Error searching tools. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const copyToolCode = (tool: DiscoveredTool) => {
    const code = `{
  id: "${tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}",
  name: "${tool.name}",
  description: { 
    es: "${tool.description_es || ''}", 
    en: "${tool.description_en || ''}" 
  },
  url: "${tool.url}",
  icon: "${tool.icon || 'Link'}",
  categoryId: "${tool.suggested_category || selectedCategory}",
  needs: ["automation"],
  levels: ${JSON.stringify(tool.level || ["beginner", "junior"])},
  pricing: "${tool.pricing || 'freemium'}",
  funnelStage: "mofu"
},`;
    
    navigator.clipboard.writeText(code);
    toast({
      title: language === "es" ? "¡Copiado!" : "Copied!",
      description: language === "es" 
        ? "Código de herramienta copiado al portapapeles" 
        : "Tool code copied to clipboard",
    });
  };

  return (
    <section className="py-6 sm:py-8 px-3 sm:px-4 border-b border-border/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              {language === "es" ? "Descubrir Herramientas" : "Discover Tools"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {language === "es" 
                ? "Busca nuevas herramientas automáticamente con IA" 
                : "Automatically find new tools with AI"}
            </p>
          </div>
        </div>

        <Card className="p-4 glass-effect border-border/50">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={language === "es" ? "Categoría..." : "Category..."} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1">
              <Input
                placeholder={language === "es" 
                  ? "O busca algo específico..." 
                  : "Or search for something specific..."}
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleDiscover}
              disabled={isSearching}
              className="gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === "es" ? "Buscando..." : "Searching..."}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  {language === "es" ? "Descubrir" : "Discover"}
                </>
              )}
            </Button>
          </div>

          {discoveredTools.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-accent" />
                {language === "es" 
                  ? `${discoveredTools.length} herramientas encontradas` 
                  : `${discoveredTools.length} tools found`}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {discoveredTools.map((tool, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm truncate">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {language === "es" ? tool.description_es : tool.description_en}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {tool.suggested_category || selectedCategory}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                            {tool.pricing}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToolCode(tool)}
                        className="flex-shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {language === "es" 
                  ? "Haz clic en + para copiar el código y agregarlo a tools.ts" 
                  : "Click + to copy the code and add it to tools.ts"}
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default ToolDiscovery;
