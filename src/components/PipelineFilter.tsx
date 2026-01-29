import { useState } from "react";
import { Users, MessageSquare, Target, Layers, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { tools, type FunnelStage, type Tool } from "@/data/tools";

const funnelStages = [
  {
    id: "tofu" as FunnelStage,
    name: { es: "TOFU", en: "TOFU" },
    fullName: { es: "Top of Funnel", en: "Top of Funnel" },
    description: { es: "Generación de Leads", en: "Lead Generation" },
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    icon: Users,
  },
  {
    id: "mofu" as FunnelStage,
    name: { es: "MOFU", en: "MOFU" },
    fullName: { es: "Middle of Funnel", en: "Middle of Funnel" },
    description: { es: "Calificación & Nurturing", en: "Qualification & Nurturing" },
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-400",
    icon: MessageSquare,
  },
  {
    id: "bofu" as FunnelStage,
    name: { es: "BOFU", en: "BOFU" },
    fullName: { es: "Bottom of Funnel", en: "Bottom of Funnel" },
    description: { es: "Cierre & Venta", en: "Close & Sale" },
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    textColor: "text-green-400",
    icon: Target,
  },
  {
    id: "allinone" as FunnelStage,
    name: { es: "All-in-One", en: "All-in-One" },
    fullName: { es: "Solución Completa", en: "Complete Solution" },
    description: { es: "Plataforma integral", en: "Complete Platform" },
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-400",
    icon: Layers,
  },
];

const pricingConfig = {
  free: { label: { es: "Gratis", en: "Free" }, color: "bg-green-500/20 text-green-400" },
  freemium: { label: { es: "Freemium", en: "Freemium" }, color: "bg-blue-500/20 text-blue-400" },
  paid: { label: { es: "Pago", en: "Paid" }, color: "bg-orange-500/20 text-orange-400" },
};

const PipelineFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<FunnelStage | null>(null);
  const { language } = useLanguage();

  const filteredTools = selectedStage
    ? tools.filter((tool) => tool.funnelStage === selectedStage)
    : [];

  const selectedStageData = funnelStages.find((s) => s.id === selectedStage);

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-card/40 hover:bg-card/60 border border-border/30 hover:border-border/50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-sm sm:text-base font-semibold text-foreground">
              {language === "es" ? "Filtrar por Pipeline" : "Filter by Pipeline"}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {language === "es"
                ? "Encuentra herramientas según la etapa de tu embudo"
                : "Find tools based on your funnel stage"}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform" />
        )}
      </button>

      {/* Content - Expandable */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-[3000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {/* Funnel Visual */}
        <div className="relative mb-6">
          {/* Funnel Shape */}
          <div className="flex flex-col items-center gap-2">
            {funnelStages.map((stage, index) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;
              const width = `${100 - index * 15}%`;

              return (
                <button
                  key={stage.id}
                  onClick={() =>
                    setSelectedStage(isSelected ? null : stage.id)
                  }
                  className={`relative transition-all duration-300 rounded-lg p-3 sm:p-4 border-2 ${
                    isSelected
                      ? `${stage.borderColor} ${stage.bgColor} scale-[1.02]`
                      : "border-border/30 bg-card/30 hover:bg-card/50"
                  }`}
                  style={{ width }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${stage.color} flex items-center justify-center`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm sm:text-base ${
                              isSelected ? stage.textColor : "text-foreground"
                            }`}
                          >
                            {stage.name[language]}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            ({stage.fullName[language]})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {stage.description[language]}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                        isSelected ? stage.bgColor : "bg-muted/50"
                      } ${isSelected ? stage.textColor : "text-muted-foreground"}`}
                    >
                      {tools.filter((t) => t.funnelStage === stage.id).length}{" "}
                      {language === "es" ? "herramientas" : "tools"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered Results */}
        {selectedStage && filteredTools.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-br ${selectedStageData?.color}`}
              />
              <h3 className="font-semibold text-foreground">
                {language === "es"
                  ? `Herramientas ${selectedStageData?.name[language]}`
                  : `${selectedStageData?.name[language]} Tools`}
              </h3>
              <span className="text-xs text-muted-foreground">
                ({filteredTools.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} language={language} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedStage && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {language === "es"
              ? "Selecciona una etapa del embudo para ver las herramientas"
              : "Select a funnel stage to see the tools"}
          </div>
        )}
      </div>
    </section>
  );
};

const ToolCard = ({ tool, language }: { tool: Tool; language: "es" | "en" }) => {
  const pricing = pricingConfig[tool.pricing];

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col p-3 rounded-lg bg-card/50 border border-border/30 hover:border-border hover:bg-card/80 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {tool.name}
        </h4>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
        {tool.description[language]}
      </p>
      <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${pricing.color}`}>
        {pricing.label[language]}
      </span>
    </a>
  );
};

export default PipelineFilter;
