import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calculator, TrendingUp, Users, Calendar, Target, DollarSign, Info, ChevronDown, ChevronUp, BookOpen, Lightbulb, Clock, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimePeriod = "daily" | "weekly" | "monthly" | "quarterly" | "semiannual" | "annual";
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
  metaCierres: number;
  ticketPromedio: number;
  contactabilidad: number;      // % de empresas que responden
  relevancia: number;           // % que quiere seguir hablando
  reunionOportunidad: number;   // % reuniones que se vuelven oportunidades
  oportunidadCierre: number;    // % oportunidades que cierran
}

interface CalculatorResults {
  cierres: number;
  oportunidades: number;
  reuniones: number;
  contactosEfectivos: number;
  empresasContactar: number;
  ingresos: number;
  conversionTotal: number;
}

// Benchmarks actualizados según el documento
const benchmarks = {
  contactabilidad: { min: 40, max: 60 },      // ~50% referencia
  relevancia: { min: 25, max: 35 },           // ~30% referencia
  reunionOportunidad: { min: 40, max: 58 },   // 58% según TOPO
  oportunidadCierre: { min: 20, max: 30 },    // 22% según TOPO
};

const FUNNEL_COLORS = [
  "hsl(174, 72%, 56%)",   // primary - empresas a contactar
  "hsl(262, 83%, 68%)",   // accent - contactos efectivos
  "hsl(45, 93%, 47%)",    // yellow - reuniones
  "hsl(142, 71%, 45%)",   // green - oportunidades
  "hsl(0, 84%, 60%)",     // red - cierres
];

const SalesCalculator = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("monthly");
  
  // Valores por defecto basados en el ejemplo de SoluBiz Connect
  const [inputs, setInputs] = useState<CalculatorInputs>({
    metaCierres: 1,
    ticketPromedio: 10000,
    contactabilidad: 60,        // 60% según ejemplo
    relevancia: 30,             // 30% según ejemplo
    reunionOportunidad: 40,     // 40% según ejemplo
    oportunidadCierre: 65,      // 65% según ejemplo
  });

  const [results, setResults] = useState<CalculatorResults>({
    cierres: 0,
    oportunidades: 0,
    reuniones: 0,
    contactosEfectivos: 0,
    empresasContactar: 0,
    ingresos: 0,
    conversionTotal: 0,
  });

  const periodLabels = {
    es: {
      daily: "Diario",
      weekly: "Semanal",
      monthly: "Mensual",
      quarterly: "Trimestral",
      semiannual: "Semestral",
      annual: "Anual",
      periodLabel: "Período de la meta",
      perDay: "/día",
      perWeek: "/semana",
      perMonth: "/mes",
      perQuarter: "/trimestre",
      perSemester: "/semestre",
      perYear: "/año",
    },
    en: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      quarterly: "Quarterly",
      semiannual: "Semi-annual",
      annual: "Annual",
      periodLabel: "Goal period",
      perDay: "/day",
      perWeek: "/week",
      perMonth: "/month",
      perQuarter: "/quarter",
      perSemester: "/semester",
      perYear: "/year",
    },
  };

  const getPeriodMultiplier = (period: TimePeriod): number => {
    switch (period) {
      case "daily": return 1/30;
      case "weekly": return 1/4;
      case "monthly": return 1;
      case "quarterly": return 3;
      case "semiannual": return 6;
      case "annual": return 12;
    }
  };

  const getPeriodSuffix = (): string => {
    const labels = periodLabels[language];
    switch (timePeriod) {
      case "daily": return labels.perDay;
      case "weekly": return labels.perWeek;
      case "monthly": return labels.perMonth;
      case "quarterly": return labels.perQuarter;
      case "semiannual": return labels.perSemester;
      case "annual": return labels.perYear;
    }
  };

  const t = {
    es: {
      title: "Calculadora de Embudo de Ventas B2B",
      subtitle: "Calcula cuántas empresas debes contactar para alcanzar tus metas de cierre",
      showCalculator: "Mostrar Calculadora",
      hideCalculator: "Ocultar Calculadora",
      inputsTitle: "Metas y Tasas de Conversión",
      resultsTitle: "Actividad Necesaria por SDR",
      funnelChartTitle: "Visualización del Embudo",
      metaCierres: "Meta de Cierres",
      ticketPromedio: "Valor Contrato Anual (ACV)",
      contactabilidad: "% Contactabilidad",
      relevancia: "% Relevancia",
      reunionOportunidad: "% Reunión → Oportunidad",
      oportunidadCierre: "% Oportunidad → Cierre",
      cierres: "Cierres",
      oportunidades: "Oportunidades",
      reuniones: "Reuniones",
      contactosEfectivos: "Contactos Efectivos",
      empresasContactar: "Empresas a Contactar",
      empresasNeeded: "Empresas Necesarias",
      ingresos: "Pipeline Proyectado",
      conversionTotal: "Conversión Total",
      benchmark: "Benchmark B2B/SaaS",
      conclusion: (empresas: number, cierres: number, period: string) =>
        `Para alcanzar tu meta de ${cierres} cierre(s) ${period}, tus SDRs necesitan contactar aproximadamente ${empresas} empresas.`,
      sources: "Fuentes: TOPO, Tenbound, Operatix (Benchmarks SDR B2B/SaaS)",
      formulaExample: "Fórmula: 1 / %Cierre / %Oportunidad / %Relevancia / %Contactabilidad = Empresas",
      exampleTitle: "Ejemplo: SoluBiz Connect",
      exampleDescription: "Con 60% contactabilidad, 30% relevancia, 40% reunión→oportunidad y 65% cierre: 1/.65/.40/.30/.60 = 21.4 empresas por cierre",
      tooltips: {
        contactabilidad: "Porcentaje de empresas que responden (email, llamada, LinkedIn). Meta: 50%",
        relevancia: "De los que responden, % que acepta una reunión. Meta: 30%",
        reunionOportunidad: "% de reuniones que se convierten en oportunidades calificadas (BANT)",
        oportunidadCierre: "% de oportunidades que se cierran. 22% promedio según TOPO",
      },
      optimizationTips: {
        title: "Diagnóstico de Optimización",
        contactabilidad: "Baja contactabilidad: Problema de canales, base de datos, gatekeepers o insuficientes intentos de contacto. No es problema del pitch.",
        relevancia: "Baja relevancia: Problema con el pitch o la audiencia. Si tienes product-market fit, revisa tu mensaje.",
        reunionOportunidad: "Baja conversión Reunión → Oportunidad: Estás hablando con personas sin BANT (Budget, Authority, Need, Timing).",
        oportunidadCierre: "Baja conversión Oportunidad → Cierre: Problemas de precio, competencia o falta de urgencia.",
      },
      howToTitle: "¿Cómo medir y usar estas métricas?",
      howToItems: [
        {
          title: "Contactabilidad (40-60%)",
          howToGet: "Divide el número de personas/empresas que responden (email, LinkedIn, llamada) entre el total de leads contactados. La contactabilidad aumenta con más intentos consistentes hasta cierto punto (final de cadencia).",
          howToUse: "Si es baja, NO cambies el pitch. Revisa: ¿tienes teléfonos correctos? ¿abren tus emails? ¿hay gatekeepers? ¿suficientes touchpoints (5-8 mínimo)?",
          formula: "Contactabilidad = (Respuestas / Total contactados) × 100"
        },
        {
          title: "Relevancia (25-35%)",
          howToGet: "De las personas que respondieron, cuenta cuántas aceptan una reunión. Ejemplo: Si 5 de 10 responden y 2 agendan = 40% relevancia.",
          howToUse: "Si es baja con buena contactabilidad, el problema es: 1) Tu pitch/propuesta de valor, o 2) Tu audiencia (target market incorrecto).",
          formula: "Relevancia = (Reuniones agendadas / Contactos que respondieron) × 100"
        },
        {
          title: "Reunión → Oportunidad (40-58%)",
          howToGet: "Una oportunidad es un prospecto con BANT: Budget, Authority, Need, Timing. El 58% de leads calificados por SDR deben terminar en oportunidades (TOPO).",
          howToUse: "Mide: reuniones agendadas, reuniones calificadas, u oportunidades generadas. Empieza con agendadas, evoluciona a calificadas.",
          formula: "Tasa = (Oportunidades calificadas / Reuniones realizadas) × 100"
        },
        {
          title: "Oportunidad → Cierre (20-30%)",
          howToGet: "El 22% de las oportunidades de SDR terminan en cierres (TOPO). Divide cierres entre oportunidades que llegaron a propuesta.",
          howToUse: "Los SDR de outbound son responsables del 53% del pipeline. Para ACV<$25k: ~$191k/mes en pipeline. Para ACV>$25k: $600-700k/mes.",
          formula: "Tasa = (Ventas cerradas / Oportunidades en propuesta) × 100"
        }
      ],
      proTips: {
        title: "Tips Profesionales (SDR)",
        tips: [
          "5-25 reuniones agendadas al mes es el rango típico para SDRs (Operatix)",
          "1.2 reuniones al día es un buen objetivo (Tenbound)",
          "Los SDR generan entre 46% y 73% del pipeline total (TOPO)",
          "Analiza por Target Market y por SDR cuando no llegues a objetivos",
          "Busca 'blue oceans': mercados con baja actividad pero alto volumen de oportunidades"
        ]
      },
      kpiSection: {
        title: "¿Qué KPIs medir?",
        options: [
          { name: "Reuniones agendadas", pros: "Genera volumen, bueno en fase inicial", cons: "Muchos no-shows y conversaciones sin valor" },
          { name: "Reuniones calificadas", pros: "Punto intermedio, más objetivo", cons: "Requiere definir claramente qué es 'calificada'" },
          { name: "Oportunidades generadas", pros: "Solo cuenta lo que puede convertir", cons: "Puede generar frustración en el equipo" }
        ]
      }
    },
    en: {
      title: "B2B Sales Funnel Calculator",
      subtitle: "Calculate how many companies to contact to reach your closing goals",
      showCalculator: "Show Calculator",
      hideCalculator: "Hide Calculator",
      inputsTitle: "Goals and Conversion Rates",
      resultsTitle: "Required SDR Activity",
      funnelChartTitle: "Funnel Visualization",
      metaCierres: "Closing Goal",
      ticketPromedio: "Annual Contract Value (ACV)",
      contactabilidad: "% Contactability",
      relevancia: "% Relevance",
      reunionOportunidad: "% Meeting → Opportunity",
      oportunidadCierre: "% Opportunity → Close",
      cierres: "Closes",
      oportunidades: "Opportunities",
      reuniones: "Meetings",
      contactosEfectivos: "Effective Contacts",
      empresasContactar: "Companies to Contact",
      empresasNeeded: "Companies Needed",
      ingresos: "Projected Pipeline",
      conversionTotal: "Total Conversion",
      benchmark: "B2B/SaaS Benchmark",
      conclusion: (empresas: number, cierres: number, period: string) =>
        `To reach your goal of ${cierres} close(s) ${period}, your SDRs need to contact approximately ${empresas} companies.`,
      sources: "Sources: TOPO, Tenbound, Operatix (B2B/SaaS SDR Benchmarks)",
      formulaExample: "Formula: 1 / %Close / %Opportunity / %Relevance / %Contactability = Companies",
      exampleTitle: "Example: SoluBiz Connect",
      exampleDescription: "With 60% contactability, 30% relevance, 40% meeting→opportunity and 65% close: 1/.65/.40/.30/.60 = 21.4 companies per close",
      tooltips: {
        contactabilidad: "Percentage of companies that respond (email, call, LinkedIn). Target: 50%",
        relevancia: "Of those who respond, % that accepts a meeting. Target: 30%",
        reunionOportunidad: "% of meetings that become qualified opportunities (BANT)",
        oportunidadCierre: "% of opportunities that close. 22% average according to TOPO",
      },
      optimizationTips: {
        title: "Optimization Diagnosis",
        contactabilidad: "Low contactability: Channel, database, gatekeeper issues or insufficient contact attempts. Not a pitch problem.",
        relevancia: "Low relevance: Pitch or audience problem. If you have product-market fit, review your message.",
        reunionOportunidad: "Low Meeting → Opportunity: You're talking to people without BANT (Budget, Authority, Need, Timing).",
        oportunidadCierre: "Low Opportunity → Close: Price, competition, or urgency issues.",
      },
      howToTitle: "How to measure and use these metrics?",
      howToItems: [
        {
          title: "Contactability (40-60%)",
          howToGet: "Divide the number of people/companies that respond (email, LinkedIn, call) by total leads contacted. Contactability increases with more consistent attempts up to a point (end of cadence).",
          howToUse: "If low, DON'T change the pitch. Check: correct phone numbers? Are emails opened? Gatekeepers? Enough touchpoints (5-8 minimum)?",
          formula: "Contactability = (Responses / Total contacted) × 100"
        },
        {
          title: "Relevance (25-35%)",
          howToGet: "Of people who responded, count how many accept a meeting. Example: If 5 of 10 respond and 2 schedule = 40% relevance.",
          howToUse: "If low with good contactability, the problem is: 1) Your pitch/value proposition, or 2) Your audience (wrong target market).",
          formula: "Relevance = (Meetings scheduled / Contacts who responded) × 100"
        },
        {
          title: "Meeting → Opportunity (40-58%)",
          howToGet: "An opportunity is a prospect with BANT: Budget, Authority, Need, Timing. 58% of SDR-qualified leads should become opportunities (TOPO).",
          howToUse: "Measure: scheduled meetings, qualified meetings, or opportunities generated. Start with scheduled, evolve to qualified.",
          formula: "Rate = (Qualified opportunities / Meetings held) × 100"
        },
        {
          title: "Opportunity → Close (20-30%)",
          howToGet: "22% of SDR opportunities end in closes (TOPO). Divide closes by opportunities that reached proposal stage.",
          howToUse: "Outbound SDRs are responsible for 53% of pipeline. For ACV<$25k: ~$191k/month in pipeline. For ACV>$25k: $600-700k/month.",
          formula: "Rate = (Closed sales / Opportunities in proposal) × 100"
        }
      ],
      proTips: {
        title: "Pro Tips (SDR)",
        tips: [
          "5-25 scheduled meetings per month is the typical range for SDRs (Operatix)",
          "1.2 meetings per day is a good target (Tenbound)",
          "SDRs generate between 46% and 73% of total pipeline (TOPO)",
          "Analyze by Target Market and by SDR when not reaching objectives",
          "Look for 'blue oceans': markets with low activity but high opportunity volume"
        ]
      },
      kpiSection: {
        title: "Which KPIs to measure?",
        options: [
          { name: "Scheduled meetings", pros: "Generates volume, good in early stage", cons: "Many no-shows and valueless conversations" },
          { name: "Qualified meetings", pros: "Middle ground, more objective", cons: "Requires clear definition of 'qualified'" },
          { name: "Opportunities generated", pros: "Only counts what can convert", cons: "Can generate team frustration" }
        ]
      }
    },
  };

  const text = t[language];

  useEffect(() => {
    calculate();
  }, [inputs]);

  // Cálculo basado en la fórmula del documento: 1 / %Cierre / %Oportunidad / %Relevancia / %Contactabilidad
  const calculate = () => {
    const {
      metaCierres,
      ticketPromedio,
      contactabilidad,
      relevancia,
      reunionOportunidad,
      oportunidadCierre,
    } = inputs;

    if (
      oportunidadCierre <= 0 ||
      reunionOportunidad <= 0 ||
      relevancia <= 0 ||
      contactabilidad <= 0
    ) {
      setResults({
        cierres: 0,
        oportunidades: 0,
        reuniones: 0,
        contactosEfectivos: 0,
        empresasContactar: 0,
        ingresos: 0,
        conversionTotal: 0,
      });
      return;
    }

    // Fórmula: empresas = cierres / (oportunidadCierre/100) / (reunionOportunidad/100) / (relevancia/100) / (contactabilidad/100)
    const oportunidades = Math.ceil(metaCierres / (oportunidadCierre / 100));
    const reuniones = Math.ceil(oportunidades / (reunionOportunidad / 100));
    const contactosEfectivos = Math.ceil(reuniones / (relevancia / 100));
    const empresasContactar = Math.ceil(contactosEfectivos / (contactabilidad / 100));
    const ingresos = metaCierres * ticketPromedio;
    const conversionTotal = (metaCierres / empresasContactar) * 100;

    setResults({
      cierres: metaCierres,
      oportunidades,
      reuniones,
      contactosEfectivos,
      empresasContactar,
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
    if (inputs.contactabilidad < benchmarks.contactabilidad.min) {
      warnings.push(text.optimizationTips.contactabilidad);
    }
    if (inputs.relevancia < benchmarks.relevancia.min) {
      warnings.push(text.optimizationTips.relevancia);
    }
    if (inputs.reunionOportunidad < benchmarks.reunionOportunidad.min) {
      warnings.push(text.optimizationTips.reunionOportunidad);
    }
    if (inputs.oportunidadCierre < benchmarks.oportunidadCierre.min) {
      warnings.push(text.optimizationTips.oportunidadCierre);
    }
    return warnings;
  };

  const warnings = getLowConversionWarnings();

  // Data for funnel chart
  const funnelData = [
    { name: text.empresasContactar, value: results.empresasContactar, color: FUNNEL_COLORS[0] },
    { name: text.contactosEfectivos, value: results.contactosEfectivos, color: FUNNEL_COLORS[1] },
    { name: text.reuniones, value: results.reuniones, color: FUNNEL_COLORS[2] },
    { name: text.oportunidades, value: results.oportunidades, color: FUNNEL_COLORS[3] },
    { name: text.cierres, value: results.cierres, color: FUNNEL_COLORS[4] },
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
            isExpanded ? "max-h-[5000px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass-effect rounded-xl p-4 sm:p-6 space-y-6">
            {/* Example Card */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {text.exampleTitle}
              </h4>
              <p className="text-xs text-foreground/80">{text.exampleDescription}</p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">{text.formulaExample}</p>
            </div>

            {/* Inputs Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {text.inputsTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Período */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {periodLabels[language].periodLabel}
                  </Label>
                  <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                    <SelectTrigger className="bg-secondary/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{periodLabels[language].daily}</SelectItem>
                      <SelectItem value="weekly">{periodLabels[language].weekly}</SelectItem>
                      <SelectItem value="monthly">{periodLabels[language].monthly}</SelectItem>
                      <SelectItem value="quarterly">{periodLabels[language].quarterly}</SelectItem>
                      <SelectItem value="semiannual">{periodLabels[language].semiannual}</SelectItem>
                      <SelectItem value="annual">{periodLabels[language].annual}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Meta Cierres */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {text.metaCierres} ({periodLabels[language][timePeriod].toLowerCase()})
                  </Label>
                  <Input
                    type="number"
                    value={inputs.metaCierres}
                    onChange={(e) => handleInputChange("metaCierres", e.target.value)}
                    className="bg-secondary/50 border-border"
                    min={0}
                  />
                </div>

                {/* Ticket Promedio (ACV) */}
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

                {/* Contactabilidad */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.contactabilidad}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{text.tooltips.contactabilidad}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.contactabilidad.min}-{benchmarks.contactabilidad.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.contactabilidad}
                      onChange={(e) => handleInputChange("contactabilidad", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("contactabilidad", inputs.contactabilidad) === "low"
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
                      {benchmarks.contactabilidad.min}-{benchmarks.contactabilidad.max}%
                    </Badge>
                  </div>
                </div>

                {/* Relevancia */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.relevancia}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{text.tooltips.relevancia}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.relevancia.min}-{benchmarks.relevancia.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.relevancia}
                      onChange={(e) => handleInputChange("relevancia", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("relevancia", inputs.relevancia) === "low"
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
                      {benchmarks.relevancia.min}-{benchmarks.relevancia.max}%
                    </Badge>
                  </div>
                </div>

                {/* Reunión → Oportunidad */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.reunionOportunidad}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{text.tooltips.reunionOportunidad}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.reunionOportunidad.min}-{benchmarks.reunionOportunidad.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.reunionOportunidad}
                      onChange={(e) => handleInputChange("reunionOportunidad", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("reunionOportunidad", inputs.reunionOportunidad) === "low"
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
                      {benchmarks.reunionOportunidad.min}-{benchmarks.reunionOportunidad.max}%
                    </Badge>
                  </div>
                </div>

                {/* Oportunidad → Cierre */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.oportunidadCierre}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{text.tooltips.oportunidadCierre}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.oportunidadCierre.min}-{benchmarks.oportunidadCierre.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.oportunidadCierre}
                      onChange={(e) => handleInputChange("oportunidadCierre", e.target.value)}
                      className={`bg-secondary/50 border-border pr-12 ${
                        getBenchmarkStatus("oportunidadCierre", inputs.oportunidadCierre) === "low"
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
                      {benchmarks.oportunidadCierre.min}-{benchmarks.oportunidadCierre.max}%
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
                        width={120}
                        tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
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
                    <p className="text-[10px] text-muted-foreground">{language === "es" ? "Contactabilidad" : "Contactability"}</p>
                    <p className="text-sm font-semibold text-primary">{inputs.contactabilidad}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">{language === "es" ? "Relevancia" : "Relevance"}</p>
                    <p className="text-sm font-semibold text-accent">{inputs.relevancia}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">{language === "es" ? "Reunión → Oport." : "Meeting → Opp."}</p>
                    <p className="text-sm font-semibold text-yellow-500">{inputs.reunionOportunidad}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">{language === "es" ? "Oport. → Cierre" : "Opp. → Close"}</p>
                    <p className="text-sm font-semibold text-green-500">{inputs.oportunidadCierre}%</p>
                  </div>
                </div>
              </div>

              {/* Funnel Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                <div className="glass-effect rounded-lg p-3 sm:p-4 text-center border-l-4 border-primary">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{text.empresasNeeded}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.empresasContactar.toLocaleString()}
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-3 sm:p-4 text-center border-l-4 border-accent">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{text.contactosEfectivos}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.contactosEfectivos.toLocaleString()}
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
                  <p className="text-xs text-muted-foreground mb-1">{text.cierres}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {results.cierres}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {text.ingresos} ({periodLabels[language][timePeriod].toLowerCase()})
                    </p>
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
                  {text.conclusion(results.empresasContactar, results.cierres, periodLabels[language][timePeriod].toLowerCase())}
                </p>

                {/* Period Breakdown (when period is not monthly) */}
                {timePeriod !== "monthly" && (
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground mb-3">
                      {language === "es" 
                        ? `Equivalente mensual aproximado${timePeriod === "daily" || timePeriod === "weekly" ? " (proyectado a mes):" : ":"}`
                        : `Approximate monthly equivalent${timePeriod === "daily" || timePeriod === "weekly" ? " (projected to month):" : ":"}`
                      }
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div className="bg-background/50 rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">{text.empresasContactar}</p>
                        <p className="text-sm font-semibold text-primary">
                          {Math.ceil(results.empresasContactar / getPeriodMultiplier(timePeriod)).toLocaleString()}
                          <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                        </p>
                      </div>
                      <div className="bg-background/50 rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">{text.contactosEfectivos}</p>
                        <p className="text-sm font-semibold text-accent">
                          {Math.ceil(results.contactosEfectivos / getPeriodMultiplier(timePeriod)).toLocaleString()}
                          <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                        </p>
                      </div>
                      <div className="bg-background/50 rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">{text.reuniones}</p>
                        <p className="text-sm font-semibold text-yellow-500">
                          {Math.ceil(results.reuniones / getPeriodMultiplier(timePeriod)).toLocaleString()}
                          <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                        </p>
                      </div>
                      <div className="bg-background/50 rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">{text.oportunidades}</p>
                        <p className="text-sm font-semibold text-green-500">
                          {(results.oportunidades / getPeriodMultiplier(timePeriod)).toFixed(1)}
                          <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                        </p>
                      </div>
                      <div className="bg-background/50 rounded p-2 text-center col-span-2 sm:col-span-1">
                        <p className="text-[10px] text-muted-foreground">{text.cierres}</p>
                        <p className="text-sm font-semibold text-destructive">
                          {(results.cierres / getPeriodMultiplier(timePeriod)).toFixed(1)}
                          <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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

            {/* KPI Section */}
            <div className="glass-effect rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                {text.kpiSection.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {text.kpiSection.options.map((option, index) => (
                  <div key={index} className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-2">{option.name}</p>
                    <p className="text-xs text-green-500 mb-1">✓ {option.pros}</p>
                    <p className="text-xs text-destructive">✗ {option.cons}</p>
                  </div>
                ))}
              </div>
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
                        <p className="font-medium text-foreground mb-1">
                          {language === "es" ? "📊 Cómo obtenerla:" : "📊 How to get it:"}
                        </p>
                        <p className="text-muted-foreground">{item.howToGet}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-md p-2">
                        <code className="text-xs text-primary">{item.formula}</code>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">
                          {language === "es" ? "💡 Cómo usarla:" : "💡 How to use it:"}
                        </p>
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
