import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calculator, TrendingUp, Users, Calendar, Target, DollarSign, Info, ChevronDown, ChevronUp, BookOpen, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CalculatorInputs {
  metaVentas: number;
  ticketPromedio: number;
  crLeadContacto: number;
  crContactoReunion: number;
  crReunionOportunidad: number;
  crOportunidadCierre: number;
}

interface CalculatorResults {
  ventas: number;
  oportunidades: number;
  reuniones: number;
  contactos: number;
  leads: number;
  ingresos: number;
  conversionTotal: number;
}

const benchmarks = {
  crLeadContacto: { min: 30, max: 50 },
  crContactoReunion: { min: 10, max: 15 },
  crReunionOportunidad: { min: 20, max: 40 },
  crOportunidadCierre: { min: 15, max: 25 },
};

const FUNNEL_COLORS = [
  "hsl(174, 72%, 56%)",   // primary - leads
  "hsl(262, 83%, 68%)",   // accent - contactos
  "hsl(45, 93%, 47%)",    // yellow - reuniones
  "hsl(142, 71%, 45%)",   // green - oportunidades
  "hsl(0, 84%, 60%)",     // red - ventas
];

const SalesCalculator = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    metaVentas: 5,
    ticketPromedio: 10000,
    crLeadContacto: 40,
    crContactoReunion: 15,
    crReunionOportunidad: 30,
    crOportunidadCierre: 20,
  });

  const [results, setResults] = useState<CalculatorResults>({
    ventas: 0,
    oportunidades: 0,
    reuniones: 0,
    contactos: 0,
    leads: 0,
    ingresos: 0,
    conversionTotal: 0,
  });

  const t = {
    es: {
      title: "Calculadora de Embudo de Ventas",
      subtitle: "Calcula cuántos leads necesitas para alcanzar tus metas",
      showCalculator: "Mostrar Calculadora",
      hideCalculator: "Ocultar Calculadora",
      inputsTitle: "Metas y Tasas de Conversión",
      resultsTitle: "Actividad Necesaria",
      funnelChartTitle: "Visualización del Embudo",
      metaVentas: "Meta de Cierres",
      ticketPromedio: "Ticket Promedio ($)",
      crLeadContacto: "% Lead → Contacto",
      crContactoReunion: "% Contacto → Reunión",
      crReunionOportunidad: "% Reunión → Oportunidad",
      crOportunidadCierre: "% Oportunidad → Cierre",
      ventas: "Ventas",
      oportunidades: "Oportunidades",
      reuniones: "Reuniones",
      contactos: "Contactos",
      leads: "Leads",
      leadsNeeded: "Leads Necesarios",
      ingresos: "Ingresos Proyectados",
      conversionTotal: "Conversión Total",
      benchmark: "Benchmark B2B",
      conclusion: (leads: number, ventas: number) =>
        `Para alcanzar tu meta de ${ventas} ventas, necesitas generar aproximadamente ${leads} leads.`,
      sources: "Fuentes: HubSpot, Salesforce, MarketingSherpa (Benchmarks B2B/SaaS)",
      tooltips: {
        crLeadContacto: "Capacidad de prospección y alcance inicial",
        crContactoReunion: "Efectividad del pitch inicial",
        crReunionOportunidad: "Calificación del prospecto",
        crOportunidadCierre: "Capacidad de cierre",
      },
      optimizationTips: {
        title: "Diagnóstico de Optimización",
        crLeadContacto: "Baja conversión Lead → Contacto: Tu base de datos es de mala calidad o no hay suficientes intentos de contacto.",
        crContactoReunion: "Baja conversión Contacto → Reunión: Tu mensaje de gancho o propuesta de valor inicial no es atractiva.",
        crReunionOportunidad: "Baja conversión Reunión → Oportunidad: Estás hablando con las personas equivocadas.",
        crOportunidadCierre: "Baja conversión Oportunidad → Cierre: Problemas de precio, competencia o falta de urgencia.",
      },
      howToTitle: "¿Cómo obtener y usar estas métricas?",
      howToItems: [
        {
          title: "Lead → Contacto (30-50%)",
          howToGet: "Divide el número de contactos efectivos (respuestas) entre el total de leads alcanzados. Usa tu CRM o herramienta de email para trackear opens y replies.",
          howToUse: "Si está baja, mejora la calidad de tu base de datos o aumenta los intentos de contacto por lead (mínimo 5-8 touchpoints).",
          formula: "Tasa = (Contactos efectivos / Total de leads) × 100"
        },
        {
          title: "Contacto → Reunión (10-15%)",
          howToGet: "Cuenta las reuniones agendadas y divídelas entre el total de contactos que respondieron. Registra en tu calendario o CRM.",
          howToUse: "Si es baja, revisa tu pitch inicial. ¿Estás generando curiosidad? ¿Tu propuesta de valor es clara en 30 segundos?",
          formula: "Tasa = (Reuniones agendadas / Contactos que respondieron) × 100"
        },
        {
          title: "Reunión → Oportunidad (20-40%)",
          howToGet: "Una oportunidad es un prospecto que tiene presupuesto, necesidad, autoridad y timing (BANT). Después de cada reunión, califica si cumple estos criterios.",
          howToUse: "Si es baja, estás hablando con las personas equivocadas. Mejora tu proceso de calificación antes de agendar reuniones.",
          formula: "Tasa = (Oportunidades calificadas / Reuniones realizadas) × 100"
        },
        {
          title: "Oportunidad → Cierre (15-25%)",
          howToGet: "Divide las ventas cerradas entre las oportunidades que llegaron a propuesta. Este es tu ratio de cierre efectivo.",
          howToUse: "Si es baja, revisa tu proceso de propuesta, pricing, o manejo de objeciones. ¿Hay urgencia en tu cierre?",
          formula: "Tasa = (Ventas cerradas / Oportunidades en propuesta) × 100"
        }
      ],
      proTips: {
        title: "Tips Profesionales",
        tips: [
          "Mide semanalmente para detectar tendencias antes de que sea tarde",
          "Compara tus tasas con los benchmarks de la industria para identificar áreas de mejora",
          "Una mejora del 5% en cada etapa puede duplicar tus resultados finales",
          "Usa un CRM para automatizar el tracking de estas métricas"
        ]
      }
    },
    en: {
      title: "Sales Funnel Calculator",
      subtitle: "Calculate how many leads you need to reach your goals",
      showCalculator: "Show Calculator",
      hideCalculator: "Hide Calculator",
      inputsTitle: "Goals and Conversion Rates",
      resultsTitle: "Required Activity",
      funnelChartTitle: "Funnel Visualization",
      metaVentas: "Closed Deals Goal",
      ticketPromedio: "Average Ticket ($)",
      crLeadContacto: "% Lead → Contact",
      crContactoReunion: "% Contact → Meeting",
      crReunionOportunidad: "% Meeting → Opportunity",
      crOportunidadCierre: "% Opportunity → Close",
      ventas: "Sales",
      oportunidades: "Opportunities",
      reuniones: "Meetings",
      contactos: "Contacts",
      leads: "Leads",
      leadsNeeded: "Leads Needed",
      ingresos: "Projected Revenue",
      conversionTotal: "Total Conversion",
      benchmark: "B2B Benchmark",
      conclusion: (leads: number, ventas: number) =>
        `To reach your goal of ${ventas} sales, you need approximately ${leads} leads.`,
      sources: "Sources: HubSpot, Salesforce, MarketingSherpa (B2B/SaaS Benchmarks)",
      tooltips: {
        crLeadContacto: "Initial prospecting and outreach capacity",
        crContactoReunion: "Initial pitch effectiveness",
        crReunionOportunidad: "Prospect qualification",
        crOportunidadCierre: "Closing capacity",
      },
      optimizationTips: {
        title: "Optimization Diagnosis",
        crLeadContacto: "Low Lead → Contact conversion: Poor quality database or not enough contact attempts.",
        crContactoReunion: "Low Contact → Meeting conversion: Your hook or initial value proposition isn't attractive.",
        crReunionOportunidad: "Low Meeting → Opportunity conversion: You're talking to the wrong people.",
        crOportunidadCierre: "Low Opportunity → Close conversion: Price issues, competition, or lack of urgency.",
      },
      howToTitle: "How to get and use these metrics?",
      howToItems: [
        {
          title: "Lead → Contact (30-50%)",
          howToGet: "Divide effective contacts (responses) by total leads reached. Use your CRM or email tool to track opens and replies.",
          howToUse: "If low, improve your database quality or increase contact attempts per lead (minimum 5-8 touchpoints).",
          formula: "Rate = (Effective contacts / Total leads) × 100"
        },
        {
          title: "Contact → Meeting (10-15%)",
          howToGet: "Count scheduled meetings and divide by total contacts who responded. Track in your calendar or CRM.",
          howToUse: "If low, review your initial pitch. Are you generating curiosity? Is your value proposition clear in 30 seconds?",
          formula: "Rate = (Scheduled meetings / Contacts who responded) × 100"
        },
        {
          title: "Meeting → Opportunity (20-40%)",
          howToGet: "An opportunity is a prospect with Budget, Authority, Need, and Timing (BANT). After each meeting, qualify if they meet these criteria.",
          howToUse: "If low, you're talking to the wrong people. Improve your qualification process before scheduling meetings.",
          formula: "Rate = (Qualified opportunities / Meetings held) × 100"
        },
        {
          title: "Opportunity → Close (15-25%)",
          howToGet: "Divide closed sales by opportunities that reached proposal stage. This is your effective close rate.",
          howToUse: "If low, review your proposal process, pricing, or objection handling. Is there urgency in your close?",
          formula: "Rate = (Closed sales / Opportunities in proposal) × 100"
        }
      ],
      proTips: {
        title: "Pro Tips",
        tips: [
          "Measure weekly to detect trends before it's too late",
          "Compare your rates with industry benchmarks to identify improvement areas",
          "A 5% improvement at each stage can double your final results",
          "Use a CRM to automate tracking of these metrics"
        ]
      }
    },
  };

  const text = t[language];

  useEffect(() => {
    calculate();
  }, [inputs]);

  const calculate = () => {
    const {
      metaVentas,
      ticketPromedio,
      crLeadContacto,
      crContactoReunion,
      crReunionOportunidad,
      crOportunidadCierre,
    } = inputs;

    if (
      crOportunidadCierre <= 0 ||
      crReunionOportunidad <= 0 ||
      crContactoReunion <= 0 ||
      crLeadContacto <= 0
    ) {
      setResults({
        ventas: 0,
        oportunidades: 0,
        reuniones: 0,
        contactos: 0,
        leads: 0,
        ingresos: 0,
        conversionTotal: 0,
      });
      return;
    }

    const oportunidades = Math.ceil(metaVentas / (crOportunidadCierre / 100));
    const reuniones = Math.ceil(oportunidades / (crReunionOportunidad / 100));
    const contactos = Math.ceil(reuniones / (crContactoReunion / 100));
    const leads = Math.ceil(contactos / (crLeadContacto / 100));
    const ingresos = metaVentas * ticketPromedio;
    const conversionTotal = (metaVentas / leads) * 100;

    setResults({
      ventas: metaVentas,
      oportunidades,
      reuniones,
      contactos,
      leads,
      ingresos,
      conversionTotal: isNaN(conversionTotal) ? 0 : conversionTotal,
    });
  };

  const handleInputChange = (key: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [key]: numValue }));
  };

  const getBenchmarkStatus = (key: keyof typeof benchmarks, value: number) => {
    const benchmark = benchmarks[key];
    if (value < benchmark.min) return "low";
    if (value > benchmark.max) return "high";
    return "normal";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === "es" ? "es-ES" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getLowConversionWarnings = () => {
    const warnings: string[] = [];
    if (inputs.crLeadContacto < benchmarks.crLeadContacto.min) {
      warnings.push(text.optimizationTips.crLeadContacto);
    }
    if (inputs.crContactoReunion < benchmarks.crContactoReunion.min) {
      warnings.push(text.optimizationTips.crContactoReunion);
    }
    if (inputs.crReunionOportunidad < benchmarks.crReunionOportunidad.min) {
      warnings.push(text.optimizationTips.crReunionOportunidad);
    }
    if (inputs.crOportunidadCierre < benchmarks.crOportunidadCierre.min) {
      warnings.push(text.optimizationTips.crOportunidadCierre);
    }
    return warnings;
  };

  const warnings = getLowConversionWarnings();

  // Data for funnel chart
  const funnelData = [
    { name: text.leads, value: results.leads, color: FUNNEL_COLORS[0] },
    { name: text.contactos, value: results.contactos, color: FUNNEL_COLORS[1] },
    { name: text.reuniones, value: results.reuniones, color: FUNNEL_COLORS[2] },
    { name: text.oportunidades, value: results.oportunidades, color: FUNNEL_COLORS[3] },
    { name: text.ventas, value: results.ventas, color: FUNNEL_COLORS[4] },
  ];

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full glass-effect rounded-xl p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-card/80 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-primary">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-foreground font-display">
                {text.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {text.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {isExpanded ? text.hideCalculator : text.showCalculator}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-primary transition-transform" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary transition-transform group-hover:translate-y-1" />
            )}
          </div>
        </button>

        {/* Calculator Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[4000px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass-effect rounded-xl p-4 sm:p-6 space-y-6">
            {/* Inputs Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {text.inputsTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Meta Ventas */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {text.metaVentas}
                  </Label>
                  <Input
                    type="number"
                    value={inputs.metaVentas}
                    onChange={(e) => handleInputChange("metaVentas", e.target.value)}
                    className="bg-secondary/50 border-border"
                    min={0}
                  />
                </div>

                {/* Ticket Promedio */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {text.ticketPromedio}
                  </Label>
                  <Input
                    type="number"
                    value={inputs.ticketPromedio}
                    onChange={(e) => handleInputChange("ticketPromedio", e.target.value)}
                    className="bg-secondary/50 border-border"
                    min={0}
                  />
                </div>

                {/* CR Lead Contacto */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.crLeadContacto}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{text.tooltips.crLeadContacto}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.crLeadContacto.min}-{benchmarks.crLeadContacto.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.crLeadContacto}
                      onChange={(e) => handleInputChange("crLeadContacto", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("crLeadContacto", inputs.crLeadContacto) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <Badge
                      variant="outline"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1"
                    >
                      {benchmarks.crLeadContacto.min}-{benchmarks.crLeadContacto.max}%
                    </Badge>
                  </div>
                </div>

                {/* CR Contacto Reunion */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.crContactoReunion}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{text.tooltips.crContactoReunion}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.crContactoReunion.min}-{benchmarks.crContactoReunion.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.crContactoReunion}
                      onChange={(e) => handleInputChange("crContactoReunion", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("crContactoReunion", inputs.crContactoReunion) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <Badge
                      variant="outline"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1"
                    >
                      {benchmarks.crContactoReunion.min}-{benchmarks.crContactoReunion.max}%
                    </Badge>
                  </div>
                </div>

                {/* CR Reunion Oportunidad */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.crReunionOportunidad}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{text.tooltips.crReunionOportunidad}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.crReunionOportunidad.min}-{benchmarks.crReunionOportunidad.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.crReunionOportunidad}
                      onChange={(e) => handleInputChange("crReunionOportunidad", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("crReunionOportunidad", inputs.crReunionOportunidad) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <Badge
                      variant="outline"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1"
                    >
                      {benchmarks.crReunionOportunidad.min}-{benchmarks.crReunionOportunidad.max}%
                    </Badge>
                  </div>
                </div>

                {/* CR Oportunidad Cierre */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.crOportunidadCierre}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{text.tooltips.crOportunidadCierre}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.crOportunidadCierre.min}-{benchmarks.crOportunidadCierre.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.crOportunidadCierre}
                      onChange={(e) => handleInputChange("crOportunidadCierre", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("crOportunidadCierre", inputs.crOportunidadCierre) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <Badge
                      variant="outline"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1"
                    >
                      {benchmarks.crOportunidadCierre.min}-{benchmarks.crOportunidadCierre.max}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {text.resultsTitle}
              </h3>

              {/* Funnel Bar Chart */}
              <div className="glass-effect rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  {text.funnelChartTitle}
                </h4>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={funnelData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100}
                        tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[0, 8, 8, 0]}
                        maxBarSize={40}
                      >
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList 
                          dataKey="value" 
                          position="right" 
                          fill="hsl(210, 40%, 98%)"
                          fontSize={14}
                          fontWeight={600}
                          formatter={(value: number) => value.toLocaleString()}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Conversion rates between stages */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  <div className="text-center p-2 rounded bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Lead → Contacto</p>
                    <p className="text-sm font-semibold text-primary">{inputs.crLeadContacto}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Contacto → Reunión</p>
                    <p className="text-sm font-semibold text-accent">{inputs.crContactoReunion}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Reunión → Oport.</p>
                    <p className="text-sm font-semibold text-yellow-500">{inputs.crReunionOportunidad}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Oport. → Cierre</p>
                    <p className="text-sm font-semibold text-green-500">{inputs.crOportunidadCierre}%</p>
                  </div>
                </div>
              </div>

              {/* Funnel Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                <div className="glass-effect rounded-lg p-3 sm:p-4 text-center border-l-4 border-primary">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{text.leadsNeeded}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.leads.toLocaleString()}
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-3 sm:p-4 text-center border-l-4 border-accent">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{text.contactos}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.contactos.toLocaleString()}
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-3 sm:p-4 text-center border-l-4 border-yellow-500">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{text.reuniones}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.reuniones.toLocaleString()}
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-3 sm:p-4 text-center border-l-4 border-green-500">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{text.oportunidades}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.oportunidades.toLocaleString()}
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-3 sm:p-4 text-center border-l-4 border-destructive col-span-2 sm:col-span-1">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-destructive mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{text.ventas}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.ventas}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{text.ingresos}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gradient-primary">
                      {formatCurrency(results.ingresos)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">{text.conversionTotal}</p>
                    <p className="text-lg font-semibold text-foreground">
                      {results.conversionTotal.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80">
                  {text.conclusion(results.leads, results.ventas)}
                </p>
              </div>

              {/* Optimization Warnings */}
              {warnings.length > 0 && (
                <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-destructive mb-2">
                    {text.optimizationTips.title}
                  </h4>
                  <ul className="space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-xs text-foreground/80 flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* How to Get Metrics Section */}
            <div className="glass-effect rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {text.howToTitle}
              </h3>
              
              <Accordion type="single" collapsible className="w-full">
                {text.howToItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-sm text-left hover:text-primary">
                      <span className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: FUNNEL_COLORS[index] }}
                        />
                        {item.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-1">📊 Cómo obtenerla:</p>
                        <p className="text-muted-foreground">{item.howToGet}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-md p-2">
                        <code className="text-xs text-primary">{item.formula}</code>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">💡 Cómo usarla:</p>
                        <p className="text-muted-foreground">{item.howToUse}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Pro Tips */}
              <div className="mt-6 bg-accent/10 border border-accent/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  {text.proTips.title}
                </h4>
                <ul className="space-y-2">
                  {text.proTips.tips.map((tip, index) => (
                    <li key={index} className="text-xs text-foreground/80 flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sources */}
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
              {text.sources}
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SalesCalculator;
