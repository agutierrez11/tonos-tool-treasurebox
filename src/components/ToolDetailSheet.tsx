import { ExternalLink, DollarSign, Gift, GraduationCap, Briefcase, Award, Target, TrendingUp, Handshake, Layers } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Tool, Pricing, Level, FunnelStage } from "@/data/tools";
import { cn } from "@/lib/utils";

interface ToolDetailSheetProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pricingConfig: Record<Pricing, { color: string; bgColor: string; label: { es: string; en: string }; icon: typeof DollarSign }> = {
  free: { 
    color: "text-emerald-600 dark:text-emerald-400", 
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    label: { es: "Gratis", en: "Free" },
    icon: Gift
  },
  freemium: { 
    color: "text-amber-600 dark:text-amber-400", 
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    label: { es: "Freemium", en: "Freemium" },
    icon: Gift
  },
  paid: { 
    color: "text-rose-600 dark:text-rose-400", 
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    label: { es: "Pago", en: "Paid" },
    icon: DollarSign
  },
};

const levelConfig: Record<Level, { label: { es: string; en: string }; icon: typeof GraduationCap }> = {
  beginner: { label: { es: "Principiante", en: "Beginner" }, icon: GraduationCap },
  junior: { label: { es: "Junior", en: "Junior" }, icon: Briefcase },
  senior: { label: { es: "Senior", en: "Senior" }, icon: Award },
};

const funnelConfig: Record<FunnelStage, { label: { es: string; en: string }; icon: typeof Target; color: string }> = {
  tofu: { label: { es: "TOFU - Descubrimiento", en: "TOFU - Discovery" }, icon: Target, color: "text-blue-500" },
  mofu: { label: { es: "MOFU - Consideración", en: "MOFU - Consideration" }, icon: TrendingUp, color: "text-purple-500" },
  bofu: { label: { es: "BOFU - Decisión", en: "BOFU - Decision" }, icon: Handshake, color: "text-green-500" },
  allinone: { label: { es: "Full Funnel", en: "Full Funnel" }, icon: Layers, color: "text-orange-500" },
};

const ToolDetailSheet = ({ tool, open, onOpenChange }: ToolDetailSheetProps) => {
  const { language } = useLanguage();

  if (!tool) return null;

  const pricing = pricingConfig[tool.pricing];
  const funnel = funnelConfig[tool.funnelStage];
  const PricingIcon = pricing.icon;
  const FunnelIcon = funnel.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left pb-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary">
                {tool.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-semibold truncate">
                {tool.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate">
                {new URL(tool.url).hostname}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {language === "es" ? "Descripción" : "Description"}
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {tool.description[language]}
            </p>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {language === "es" ? "Precio" : "Pricing"}
            </h4>
            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg", pricing.bgColor)}>
              <PricingIcon className={cn("w-4 h-4", pricing.color)} />
              <span className={cn("text-sm font-medium", pricing.color)}>
                {pricing.label[language]}
              </span>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {language === "es" ? "Nivel de Experiencia" : "Experience Level"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {tool.levels.map((level) => {
                const config = levelConfig[level];
                const Icon = config.icon;
                return (
                  <Badge 
                    key={level} 
                    variant="secondary"
                    className="flex items-center gap-1.5"
                  >
                    <Icon className="w-3 h-3" />
                    {config.label[language]}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Funnel Stage */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {language === "es" ? "Etapa del Funnel" : "Funnel Stage"}
            </h4>
            <div className="flex items-center gap-2">
              <FunnelIcon className={cn("w-5 h-5", funnel.color)} />
              <span className="text-sm font-medium text-foreground">
                {funnel.label[language]}
              </span>
            </div>
          </div>

          {/* Needs */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {language === "es" ? "Utilidades" : "Use Cases"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {tool.needs.map((need) => (
                <Badge key={need} variant="outline" className="capitalize">
                  {need === "prospecting" && (language === "es" ? "Prospección" : "Prospecting")}
                  {need === "automation" && (language === "es" ? "Automatización" : "Automation")}
                  {need === "analytics" && (language === "es" ? "Análisis" : "Analytics")}
                  {need === "content" && (language === "es" ? "Contenido" : "Content")}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-border/50">
          <Button 
            asChild 
            className="w-full"
            size="lg"
          >
            <a 
              href={tool.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              {language === "es" ? "Ir a la herramienta" : "Go to tool"}
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ToolDetailSheet;
