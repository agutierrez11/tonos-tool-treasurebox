import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, TrendingUp, Zap, FileText, GraduationCap, Briefcase, Award, X, DollarSign, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFilteredTools, type Need, type Level, type Tool, type Pricing } from "@/data/tools";
import ToolDetailSheet from "./ToolDetailSheet";

const ToolSelector = () => {
  const { language } = useLanguage();
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const needs = [
    { id: "prospecting" as Need, icon: Target, label: { es: "Prospección", en: "Prospecting" } },
    { id: "automation" as Need, icon: Zap, label: { es: "Automatización", en: "Automation" } },
    { id: "analytics" as Need, icon: TrendingUp, label: { es: "Análisis", en: "Analytics" } },
    { id: "content" as Need, icon: FileText, label: { es: "Contenido", en: "Content" } },
  ];

  const levels = [
    { id: "beginner" as Level, icon: GraduationCap, label: { es: "Principiante", en: "Beginner" } },
    { id: "junior" as Level, icon: Briefcase, label: { es: "Junior", en: "Junior" } },
    { id: "senior" as Level, icon: Award, label: { es: "Senior", en: "Senior" } },
  ];

  const handleNeedClick = (need: Need) => {
    setSelectedNeeds(prev => 
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleLevelClick = (level: Level) => {
    setSelectedLevel(selectedLevel === level ? null : level);
  };

  const clearFilters = () => {
    setSelectedNeeds([]);
    setSelectedLevel(null);
  };

  const filteredTools = getFilteredTools(selectedNeeds, selectedLevel);
  const hasSelection = selectedNeeds.length > 0 || selectedLevel;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Compact filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {needs.map((need) => {
          const Icon = need.icon;
          const isSelected = selectedNeeds.includes(need.id);
          return (
            <button
              key={need.id}
              onClick={() => handleNeedClick(need.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                isSelected
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/30"
              )}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {need.label[language]}
            </button>
          );
        })}
        
        <span className="text-muted-foreground/30 mx-0.5">|</span>
        
        {levels.map((level) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => handleLevelClick(level.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                isSelected
                  ? "bg-accent/90 text-accent-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/30"
              )}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {level.label[language]}
            </button>
          );
        })}
        
        {hasSelection && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/30"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filtered results - only show when filters are active */}
      {hasSelection && (
        <div className="space-y-2 animate-fade-in">
          <p className="text-center text-xs text-muted-foreground">
            {filteredTools.length} {language === "es" ? "herramientas encontradas" : "tools found"}
          </p>
          
          {filteredTools.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredTools.slice(0, 8).map((tool, index) => (
                <ToolResultCard key={tool.id} tool={tool} index={index} language={language} />
              ))}
            </div>
          )}
          
          {filteredTools.length > 8 && (
            <p className="text-center text-xs text-muted-foreground">
              +{filteredTools.length - 8} {language === "es" ? "más en las categorías abajo" : "more in categories below"}
            </p>
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
        className="group relative flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-card/50 border border-border/30 hover:border-primary/40 hover:bg-card transition-all duration-200 w-full text-left"
        style={{ animationDelay: `${index * 20}ms` }}
      >
        <div className={cn("absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full", pricing.color)} />
        
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs sm:text-sm font-semibold text-primary">
            {tool.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0 pr-3">
          <h4 className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {tool.name}
          </h4>
        </div>
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
