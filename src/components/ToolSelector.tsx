import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, TrendingUp, Users, Zap, GraduationCap, Briefcase, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type Need = "prospecting" | "automation" | "analytics" | "content";
type Level = "beginner" | "junior" | "senior";

interface ToolSelectorProps {
  onSelectionChange?: (need: Need | null, level: Level | null) => void;
}

const ToolSelector = ({ onSelectionChange }: ToolSelectorProps) => {
  const { language } = useLanguage();
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
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
      icon: Users,
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
    const newNeed = selectedNeed === need ? null : need;
    setSelectedNeed(newNeed);
    onSelectionChange?.(newNeed, selectedLevel);
  };

  const handleLevelClick = (level: Level) => {
    const newLevel = selectedLevel === level ? null : level;
    setSelectedLevel(newLevel);
    onSelectionChange?.(selectedNeed, newLevel);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
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

      {/* Needs Section */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
          {language === "es" ? "¿Qué necesitas?" : "What do you need?"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {needs.map((need) => {
            const Icon = need.icon;
            const isSelected = selectedNeed === need.id;
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

      {/* Selection Summary */}
      {(selectedNeed || selectedLevel) && (
        <div className="text-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border/30">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === "es" ? "Mostrando herramientas para:" : "Showing tools for:"}
            {selectedNeed && (
              <span className="ml-1 font-medium text-primary">
                {needs.find(n => n.id === selectedNeed)?.label[language]}
              </span>
            )}
            {selectedNeed && selectedLevel && <span className="mx-1">•</span>}
            {selectedLevel && (
              <span className="font-medium text-accent">
                {levels.find(l => l.id === selectedLevel)?.label[language]}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolSelector;
