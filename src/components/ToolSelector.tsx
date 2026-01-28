import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, TrendingUp, Zap, FileText, GraduationCap, Briefcase, Award, X, Check, DollarSign, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFilteredTools, type Need, type Level, type Tool, type Pricing } from "@/data/tools";
import ToolDetailSheet from "./ToolDetailSheet";

const ToolSelector = () => {
  const { language } = useLanguage();
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const needs = [
    {
      id: "prospecting" as Need,
      icon: Target,
      label: { es: "Prospección", en: "Prospecting" },
      description: { es: "Encuentra leads y contactos", en: "Find leads and contacts" },
    },
    {
      id: "automation" as Need,
      icon: Zap,
      label: { es: "Automatización", en: "Automation" },
      description: { es: "Automatiza tareas repetitivas", en: "Automate repetitive tasks" },
    },
    {
      id: "analytics" as Need,
      icon: TrendingUp,
      label: { es: "Análisis", en: "Analytics" },
      description: { es: "Mide y optimiza resultados", en: "Measure and optimize results" },
    },
    {
      id: "content" as Need,
      icon: FileText,
      label: { es: "Contenido", en: "Content" },
      description: { es: "Crea contenido persuasivo", en: "Create persuasive content" },
    },
  ];

  const levels = [
    {
      id: "beginner" as Level,
      icon: GraduationCap,
      label: { es: "Principiante", en: "Beginner" },
      description: { es: "Empezando en ventas", en: "Starting in sales" },
    },
    {
      id: "junior" as Level,
      icon: Briefcase,
      label: { es: "Junior", en: "Junior" },
      description: { es: "1-3 años de experiencia", en: "1-3 years experience" },
    },
    {
      id: "senior" as Level,
      icon: Award,
      label: { es: "Senior", en: "Senior" },
      description: { es: "Experto en ventas", en: "Sales expert" },
    },
  ];

  const handleNeedClick = (need: Need) => {
    setSelectedNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need)
        : [...prev, need]
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
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Section Title */}
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2">
          {language === "es" 
            ? "Encuentra tu stock de herramientas ideal" 
            : "Find your ideal tool stack"
          }
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {language === "es"
            ? "Selecciona según tus necesidades y nivel de experiencia"
            : "Select based on your needs and experience level"
          }
        </p>
      </div>

      {/* Needs Section - Multi-select */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
          {language === "es" ? "¿Qué necesitas? (puedes elegir varias)" : "What do you need? (select multiple)"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {needs.map((need) => {
            const Icon = need.icon;
            const isSelected = selectedNeeds.includes(need.id);
            return (
              <button
                key={need.id}
                onClick={() => handleNeedClick(need.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-lg",
                  isSelected
                    ? "bg-primary/10 border-primary shadow-md"
                    : "bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-center">
                  <span className={cn(
                    "text-xs sm:text-sm font-medium block",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {need.label[language]}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                    {need.description[language]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Section */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
          {language === "es" ? "Tu nivel de experiencia" : "Your experience level"}
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {levels.map((level) => {
            const Icon = level.icon;
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => handleLevelClick(level.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-lg",
                  isSelected
                    ? "bg-accent/20 border-accent shadow-md"
                    : "bg-card/50 border-border/50 hover:border-accent/50 hover:bg-card"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent"
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-center">
                  <span className={cn(
                    "text-xs sm:text-sm font-medium block",
                    isSelected ? "text-accent" : "text-foreground"
                  )}>
                    {level.label[language]}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                    {level.description[language]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Summary & Results */}
      {hasSelection && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border/30">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {language === "es" ? "Mostrando" : "Showing"}
              <span className="font-semibold text-foreground mx-1">{filteredTools.length}</span>
              {language === "es" ? "herramientas para:" : "tools for:"}
              {selectedNeeds.length > 0 && (
                <span className="ml-1">
                  {selectedNeeds.map((needId, idx) => (
                    <span key={needId}>
                      <span className="font-medium text-primary">
                        {needs.find(n => n.id === needId)?.label[language]}
                      </span>
                      {idx < selectedNeeds.length - 1 && <span className="mx-1">+</span>}
                    </span>
                  ))}
                </span>
              )}
              {selectedNeeds.length > 0 && selectedLevel && <span className="mx-1">•</span>}
              {selectedLevel && (
                <span className="font-medium text-accent">
                  {levels.find(l => l.id === selectedLevel)?.label[language]}
                </span>
              )}
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
            >
              <X className="w-3 h-3" />
              {language === "es" ? "Limpiar" : "Clear"}
            </button>
          </div>

          {/* Pricing Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-muted-foreground">{language === "es" ? "Gratis" : "Free"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-muted-foreground">Freemium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-muted-foreground">{language === "es" ? "Paga" : "Paid"}</span>
            </div>
          </div>

          {/* Results Grid */}
          {filteredTools.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredTools.map((tool, index) => (
                <ToolResultCard key={tool.id} tool={tool} index={index} language={language} />
              ))}
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {language === "es" 
                ? "No hay herramientas que coincidan con esta combinación"
                : "No tools match this combination"
              }
            </div>
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

const pricingConfig: Record<Pricing, { color: string; label: { es: string; en: string }; icon: typeof DollarSign }> = {
  free: { 
    color: "bg-emerald-500", 
    label: { es: "Gratis", en: "Free" },
    icon: Gift
  },
  freemium: { 
    color: "bg-amber-500", 
    label: { es: "Freemium", en: "Freemium" },
    icon: Gift
  },
  paid: { 
    color: "bg-rose-500", 
    label: { es: "Paga", en: "Paid" },
    icon: DollarSign
  },
};

const ToolResultCard = ({ tool, index, language }: ToolResultCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pricing = pricingConfig[tool.pricing];
  
  return (
    <>
      <button
        onClick={() => setIsSheetOpen(true)}
        className="group relative flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/40 hover:border-primary/50 hover:bg-card hover:shadow-lg transition-all duration-300 animate-fade-in w-full text-left"
        style={{ animationDelay: `${index * 30}ms` }}
      >
        {/* Pricing dot */}
        <div 
          className={cn(
            "absolute top-2 right-2 w-2 h-2 rounded-full",
            pricing.color
          )}
          title={pricing.label[language]}
        />

        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <span className="text-lg font-bold text-primary">
            {tool.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {tool.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {tool.description[language]}
          </p>
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
