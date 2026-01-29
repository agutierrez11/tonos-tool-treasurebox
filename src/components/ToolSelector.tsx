import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Briefcase, Award, X, ChevronDown, ChevronUp, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFilteredTools, categories, type Level, type Tool, type Pricing } from "@/data/tools";
import ToolDetailSheet from "./ToolDetailSheet";
import TechStackExport from "./TechStackExport";

const ToolSelector = () => {
  const { language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const levels = [
    { id: "beginner" as Level, icon: GraduationCap, label: { es: "Principiante", en: "Beginner" } },
    { id: "junior" as Level, icon: Briefcase, label: { es: "Junior", en: "Junior" } },
    { id: "senior" as Level, icon: Award, label: { es: "Senior", en: "Senior" } },
  ];

  const handleLevelClick = (level: Level) => {
    setSelectedLevel(selectedLevel === level ? null : level);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedLevel(null);
    setSelectedCategories([]);
  };

  // Get tools filtered by level AND selected categories
  const getFilteredResults = (): Tool[] => {
    if (!selectedLevel && selectedCategories.length === 0) return [];
    
    const allTools = getFilteredTools([], selectedLevel);
    
    if (selectedCategories.length === 0) return allTools;
    
    return allTools.filter(tool => selectedCategories.includes(tool.categoryId));
  };

  const filteredTools = getFilteredResults();
  const hasSelection = selectedLevel || selectedCategories.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3 px-3">
      {/* Level Selection - Always visible */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">
          {language === "es" ? "Tu nivel:" : "Your level:"}
        </span>
        {levels.map((level) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => handleLevelClick(level.id)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              )}
            >
              <Icon className="w-3 h-3" />
              {level.label[language]}
            </button>
          );
        })}
        
        {hasSelection && (
          <button
            onClick={clearFilters}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted"
            title={language === "es" ? "Limpiar filtros" : "Clear filters"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Selection - Expandable */}
      <div className="space-y-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {language === "es" ? "Filtrar por categorías" : "Filter by categories"}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {isExpanded && (
          <div className="flex flex-wrap items-center justify-center gap-1 animate-fade-in">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-medium transition-all",
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-card/80 text-muted-foreground hover:bg-muted border border-border/50"
                  )}
                >
                  {category.name[language]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results */}
      {hasSelection && (
        <div className="space-y-2 animate-fade-in bg-card/50 rounded-lg p-3 border border-border/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredTools.length}</span> {language === "es" ? "herramientas en tu stack" : "tools in your stack"}
              {selectedLevel && (
                <span className="text-primary font-medium ml-1">
                  • {levels.find(l => l.id === selectedLevel)?.label[language]}
                </span>
              )}
            </p>
            {filteredTools.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Download className="w-3 h-3" />
                {language === "es" ? "Exportar abajo" : "Export below"}
              </div>
            )}
          </div>
          
          {filteredTools.length > 0 && (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
                {filteredTools.slice(0, 18).map((tool, index) => (
                  <ToolResultCard key={tool.id} tool={tool} index={index} language={language} />
                ))}
              </div>
              
              {filteredTools.length > 18 && (
                <p className="text-center text-[10px] text-muted-foreground">
                  +{filteredTools.length - 18} {language === "es" ? "más en el PDF/Excel" : "more in PDF/Excel"}
                </p>
              )}
              
              {/* Export section */}
              <TechStackExport 
                tools={filteredTools} 
                level={selectedLevel} 
                selectedCategories={selectedCategories} 
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface ToolResultCardProps {
  tool: Tool;
  index: number;
  language: "es" | "en";
}

const pricingConfig: Record<Pricing, { color: string }> = {
  free: { color: "bg-emerald-500" },
  freemium: { color: "bg-amber-500" },
  paid: { color: "bg-rose-500" },
};

const ToolResultCard = ({ tool, index, language }: ToolResultCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pricing = pricingConfig[tool.pricing];
  
  return (
    <>
      <button
        onClick={() => setIsSheetOpen(true)}
        className="group relative flex items-center gap-1.5 p-1.5 rounded-md bg-background border border-border/50 hover:border-primary/40 hover:shadow-sm transition-all w-full text-left"
        style={{ animationDelay: `${index * 15}ms` }}
      >
        <div className={cn("absolute top-1 right-1 w-1.5 h-1.5 rounded-full", pricing.color)} />
        
        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-semibold text-primary">
            {tool.name.charAt(0)}
          </span>
        </div>
        <span className="text-[10px] font-medium text-foreground truncate group-hover:text-primary transition-colors pr-2">
          {tool.name}
        </span>
      </button>
      
      <ToolDetailSheet 
        tool={tool} 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
      />
    </>
  );
};

export default ToolSelector;
