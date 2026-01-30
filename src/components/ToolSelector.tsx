import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Briefcase, Award, X, ChevronDown, ChevronUp, Download, Circle, Filter, Check, Square, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFilteredTools, categories, type Level, type Tool, type Pricing, type FunnelStage } from "@/data/tools";
import ToolDetailSheet from "./ToolDetailSheet";
import TechStackExport from "./TechStackExport";

const ToolSelector = () => {
  const { language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<FunnelStage | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualSelection, setManualSelection] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<"filtered" | "manual">("filtered");

  const levels = [
    { id: "beginner" as Level, icon: GraduationCap, label: { es: "Principiante", en: "Beginner" } },
    { id: "junior" as Level, icon: Briefcase, label: { es: "Junior", en: "Junior" } },
    { id: "senior" as Level, icon: Award, label: { es: "Senior", en: "Senior" } },
  ];

  const funnelStages = [
    { id: "tofu" as FunnelStage, label: { es: "TOFU", en: "TOFU" }, desc: { es: "Atracción", en: "Awareness" } },
    { id: "mofu" as FunnelStage, label: { es: "MOFU", en: "MOFU" }, desc: { es: "Consideración", en: "Consideration" } },
    { id: "bofu" as FunnelStage, label: { es: "BOFU", en: "BOFU" }, desc: { es: "Decisión", en: "Decision" } },
    { id: "allinone" as FunnelStage, label: { es: "Todo-en-uno", en: "All-in-One" }, desc: { es: "Completo", en: "Complete" } },
  ];

  const pricingOptions: { id: Pricing; label: { es: string; en: string }; color: string }[] = [
    { id: "free", label: { es: "Gratis", en: "Free" }, color: "bg-emerald-500" },
    { id: "freemium", label: { es: "Freemium", en: "Freemium" }, color: "bg-amber-500" },
    { id: "paid", label: { es: "De pago", en: "Paid" }, color: "bg-rose-500" },
  ];

  const handleLevelClick = (level: Level) => {
    setSelectedLevel(selectedLevel === level ? null : level);
    setSelectionMode("filtered");
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
    setSelectionMode("filtered");
  };

  const handleFunnelClick = (stage: FunnelStage) => {
    setSelectedFunnelStage(selectedFunnelStage === stage ? null : stage);
    setSelectionMode("filtered");
  };

  const handlePricingClick = (pricing: Pricing) => {
    setSelectedPricing(selectedPricing === pricing ? null : pricing);
    setSelectionMode("filtered");
  };

  const clearFilters = () => {
    setSelectedLevel(null);
    setSelectedCategories([]);
    setSelectedFunnelStage(null);
    setSelectedPricing(null);
    setManualSelection([]);
    setSelectionMode("filtered");
  };

  const toggleToolSelection = (toolId: string) => {
    setManualSelection(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
    setSelectionMode("manual");
  };

  const selectAllFiltered = () => {
    const toolIds = filteredTools.map(t => t.id);
    setManualSelection(prev => {
      const allSelected = toolIds.every(id => prev.includes(id));
      if (allSelected) {
        return prev.filter(id => !toolIds.includes(id));
      }
      return [...new Set([...prev, ...toolIds])];
    });
    setSelectionMode("manual");
  };

  // Get tools filtered by all criteria
  const getFilteredResults = (): Tool[] => {
    if (!selectedLevel && selectedCategories.length === 0 && !selectedFunnelStage && !selectedPricing) return [];
    
    const allTools = getFilteredTools([], selectedLevel);
    
    return allTools.filter(tool => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(tool.categoryId);
      const matchesFunnel = !selectedFunnelStage || tool.funnelStage === selectedFunnelStage;
      const matchesPricing = !selectedPricing || tool.pricing === selectedPricing;
      return matchesCategory && matchesFunnel && matchesPricing;
    });
  };

  const filteredTools = getFilteredResults();
  const hasSelection = selectedLevel || selectedCategories.length > 0 || selectedFunnelStage || selectedPricing;
  
  // Get tools for export based on mode
  const getToolsForExport = (): Tool[] => {
    if (selectionMode === "manual" && manualSelection.length > 0) {
      const allTools = getFilteredTools([], null);
      return allTools.filter(t => manualSelection.includes(t.id));
    }
    return filteredTools;
  };

  const toolsForExport = getToolsForExport();
  const allFilteredSelected = filteredTools.length > 0 && filteredTools.every(t => manualSelection.includes(t.id));

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
        
        {(hasSelection || manualSelection.length > 0) && (
          <button
            onClick={clearFilters}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted"
            title={language === "es" ? "Limpiar filtros" : "Clear filters"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Funnel Stage Selection */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">
          {language === "es" ? "Etapa:" : "Stage:"}
        </span>
        {funnelStages.map((stage) => {
          const isSelected = selectedFunnelStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => handleFunnelClick(stage.id)}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium transition-all",
                isSelected
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              )}
              title={stage.desc[language]}
            >
              {stage.label[language]}
            </button>
          );
        })}
      </div>

      {/* Pricing Filter */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">
          {language === "es" ? "Precio:" : "Price:"}
        </span>
        {pricingOptions.map((option) => {
          const isSelected = selectedPricing === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handlePricingClick(option.id)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all",
                isSelected
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              )}
            >
              <Circle className={cn("w-2 h-2 fill-current", option.color.replace("bg-", "text-"))} />
              {option.label[language]}
            </button>
          );
        })}
      </div>

      {/* Category Selection - Expandable */}
      <div className="space-y-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Filter className="w-3 h-3" />
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredTools.length}</span> {language === "es" ? "herramientas encontradas" : "tools found"}
              {selectedLevel && (
                <span className="text-primary font-medium ml-1">
                  • {levels.find(l => l.id === selectedLevel)?.label[language]}
                </span>
              )}
              {selectedFunnelStage && (
                <span className="text-accent-foreground font-medium ml-1">
                  • {funnelStages.find(s => s.id === selectedFunnelStage)?.label[language]}
                </span>
              )}
            </p>
            
            {filteredTools.length > 0 && (
              <button
                onClick={selectAllFiltered}
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors",
                  allFilteredSelected 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {allFilteredSelected ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                {language === "es" ? "Seleccionar todas" : "Select all"}
              </button>
            )}
          </div>
          
          {filteredTools.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
                {filteredTools.slice(0, 20).map((tool, index) => (
                  <ToolResultCard 
                    key={tool.id} 
                    tool={tool} 
                    index={index} 
                    language={language}
                    isSelected={manualSelection.includes(tool.id)}
                    onToggleSelect={() => toggleToolSelection(tool.id)}
                  />
                ))}
              </div>
              
              {filteredTools.length > 20 && (
                <p className="text-center text-[10px] text-muted-foreground">
                  +{filteredTools.length - 20} {language === "es" ? "más" : "more"}
                </p>
              )}
            </>
          )}
          
          {/* Export section */}
          {toolsForExport.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">
                    {language === "es" ? "Exportar:" : "Export:"}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    selectionMode === "manual" && manualSelection.length > 0
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {selectionMode === "manual" && manualSelection.length > 0
                      ? `${manualSelection.length} ${language === "es" ? "seleccionadas" : "selected"}`
                      : `${filteredTools.length} ${language === "es" ? "filtradas" : "filtered"}`
                    }
                  </span>
                </div>
              </div>
              
              <TechStackExport 
                tools={toolsForExport} 
                level={selectedLevel} 
                selectedCategories={selectedCategories} 
              />
              
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                {language === "es" 
                  ? "💡 Haz clic en los checks para seleccionar herramientas manualmente"
                  : "💡 Click checkboxes to manually select tools"
                }
              </p>
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
  isSelected: boolean;
  onToggleSelect: () => void;
}

const pricingConfig: Record<Pricing, { color: string }> = {
  free: { color: "bg-emerald-500" },
  freemium: { color: "bg-amber-500" },
  paid: { color: "bg-rose-500" },
};

const ToolResultCard = ({ tool, index, language, isSelected, onToggleSelect }: ToolResultCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pricing = pricingConfig[tool.pricing];
  
  return (
    <>
      <div
        className={cn(
          "group relative flex items-center gap-1.5 p-1.5 rounded-md bg-background border transition-all",
          isSelected 
            ? "border-primary/60 bg-primary/5 shadow-sm" 
            : "border-border/50 hover:border-primary/40 hover:shadow-sm"
        )}
        style={{ animationDelay: `${index * 15}ms` }}
      >
        {/* Selection checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={cn(
            "w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {isSelected && <Check className="w-3 h-3" />}
        </button>
        
        <div className={cn("absolute top-1 right-1 w-1.5 h-1.5 rounded-full", pricing.color)} />
        
        <button
          onClick={() => setIsSheetOpen(true)}
          className="flex-1 flex items-center gap-1 text-left min-w-0"
        >
          <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-semibold text-primary">
              {tool.name.charAt(0)}
            </span>
          </div>
          <span className="text-[10px] font-medium text-foreground truncate group-hover:text-primary transition-colors pr-3">
            {tool.name}
          </span>
        </button>
      </div>
      
      <ToolDetailSheet 
        tool={tool} 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
      />
    </>
  );
};

export default ToolSelector;
