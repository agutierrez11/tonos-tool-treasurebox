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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CalculatorInputs {
  metaCierres: number;
  ticketPromedio: number;
  leadContacto: number;         // % Lead a Contacto Calificado
  contactoReunion: number;      // % Lead a Reunión
  reunionAsistencia: number;    // % Show Rate (Tasa de Asistencia)
  reunionOportunidad: number;   // % Reunión → Oportunidad
  oportunidadCierre: number;    // % Oportunidad → Cierre
}

interface CalculatorResults {
  cierres: number;
  oportunidades: number;
  reuniones: number; // Reuniones Realizadas (attended)
  reunionesAgendadas: number; // Reuniones Agendadas (scheduled)
  leads: number;
  ingresos: number;
  conversionTotal: number;
}

// Benchmarks B2B SaaS actualizados
const benchmarks = {
  leadContacto: { min: 30, max: 60 },
  contactoReunion: { min: 20, max: 40 },
  reunionAsistencia: { min: 60, max: 80 },
  reunionOportunidad: { min: 25, max: 50 },
  oportunidadCierre: { min: 20, max: 30 },
};

// Colores del embudo - de más claro a más oscuro
const FUNNEL_COLORS = {
  leads: "hsl(215, 20%, 45%)",
  reunionesAgendadas: "hsl(45, 93%, 47%)",
  reunionesRealizadas: "hsl(283, 67%, 53%)",
  oportunidades: "hsl(211, 100%, 50%)",
  cierres: "hsl(142, 71%, 35%)",
};

const SalesCalculator = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("monthly");
  
  // Valores por defecto basados en benchmarks B2B SaaS
  const [inputs, setInputs] = useState<CalculatorInputs>({
    metaCierres: 10,
    ticketPromedio: 15000,
    leadContacto: 35,
    contactoReunion: 30,
    reunionAsistencia: 75,
    reunionOportunidad: 40,
    oportunidadCierre: 25,
  });

  const [results, setResults] = useState<CalculatorResults>({
    cierres: 0,
    oportunidades: 0,
    reuniones: 0,
    reunionesAgendadas: 0,
    leads: 0,
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

  const t = {
    es: {
      title: "Calculadora Visual de Embudo de Ventas (B2B SaaS)",
      subtitle: "Calcula cuántos leads necesitas para alcanzar tus metas de cierre",
      showCalculator: "Mostrar Calculadora",
      hideCalculator: "Ocultar Calculadora",
      inputsTitle: "1. Define tus Metas y Tasas de Conversión",
      resultsTitle: "2. Resultados",
      funnelChartTitle: "3. Visualización del Embudo",
      metaCierres: "Meta de Cierres (Ventas)",
      ticketPromedio: "Ticket Promedio Anual ($)",
      leadContacto: "% Lead a Contacto Calificado",
      contactoReunion: "% Lead a Reunión",
      reunionAsistencia: "% Tasa de Asistencia (Show Rate)",
      reunionOportunidad: "% Reunión a Oportunidad",
      oportunidadCierre: "% Oportunidad a Cierre",
      cierres: "Ventas a Cerrar",
      oportunidades: "Oportunidades",
      reuniones: "Reuniones Realizadas",
      reunionesAgendadas: "Reuniones Agendadas",
      leads: "Leads Necesarios",
      ingresos: "Proyección",
      conversionTotal: "Conversión Total",
      benchmark: "Benchmark",
      pacingTitle: "⚡ Paso Operativo Diario y Semanal (Pacing)",
      pacingSubtitle: "Calculado sobre 20 días hábiles (Lunes a Viernes) para metas mensuales",
      pacingLeads: "Leads diarios",
      pacingMeetings: "Agendadas por semana",
      pacingAttended: "Realizadas por semana",
      pacingOpps: "Oportunidades por semana",
      pacingCloses: "Cierres por semana",
      conclusion: (leads: number, cierres: number, period: string) =>
        `Para alcanzar tu meta de ${cierres} cierre(s) ${period}, necesitas generar aproximadamente ${leads} leads.`,
      healthyFunnel: "¡Excelentes métricas! Tu embudo se ve saludable en comparación con los benchmarks.",
      tooltips: {
        leadContacto: "Porcentaje de leads que se convierten en contactos calificados. Meta: 30-60%",
        contactoReunion: "De los contactos calificados, % que acepta una reunión. Meta: 20-40%",
        reunionAsistencia: "Porcentaje de reuniones agendadas que se realizan con éxito. Meta: 60-80%",
        reunionOportunidad: "% de reuniones que se convierten en oportunidades calificadas. Meta: 25-50%",
        oportunidadCierre: "% de oportunidades que se cierran. Meta: 20-30%",
      },
      optimizationTips: {
        title: "Diagnóstico de Optimización",
        leadContacto: "Baja conversión Lead → Contacto: Revisa la calidad de tus leads, los canales de adquisición o la base de datos.",
        contactoReunion: "Baja conversión Contacto → Reunión: Problema con el pitch inicial o la audiencia objetivo.",
        reunionAsistencia: "Baja Tasa de Asistencia (Show Rate): Mejora el proceso de confirmación y recordatorios por email/WhatsApp antes de la llamada.",
        reunionOportunidad: "Baja conversión Reunión → Oportunidad: Estás hablando con personas sin BANT (Budget, Authority, Need, Timing).",
        oportunidadCierre: "Baja conversión Oportunidad → Cierre: Problemas de precio, competencia o falta de urgencia.",
      },
      howToTitle: "¿Cómo medir y usar estas métricas?",
      howToItems: [
        {
          title: "Lead a Contacto Calificado (30-60%)",
          howToGet: "Divide el número de contactos calificados entre el total de leads generados. Un contacto calificado es aquel que responde y muestra interés inicial.",
          howToUse: "Si es baja, revisa la calidad de tus fuentes de leads, segmentación y canales de adquisición.",
          formula: "Tasa = (Contactos calificados / Total leads) × 100"
        },
        {
          title: "Lead a Reunión (20-40%)",
          howToGet: "De los contactos que respondieron, cuenta cuántos aceptan una reunión. Si 10 responden y 3 agendan = 30%.",
          howToUse: "Si es baja, el problema puede ser: 1) Tu pitch/propuesta de valor, o 2) Tu audiencia (target market incorrecto).",
          formula: "Tasa = (Reuniones agendadas / Contactos calificados) × 100"
        },
        {
          title: "Reunión a Oportunidad (25-50%)",
          howToGet: "Una oportunidad es un prospecto con BANT: Budget, Authority, Need, Timing. Divide oportunidades entre reuniones realizadas.",
          howToUse: "Si es baja, evalúa si estás calificando bien antes de la reunión. El problema puede estar en la calidad del lead.",
          formula: "Tasa = (Oportunidades calificadas / Reuniones realizadas) × 100"
        },
        {
          title: "Oportunidad a Cierre (20-30%)",
          howToGet: "Divide ventas cerradas entre oportunidades que llegaron a propuesta o negociación.",
          howToUse: "Si es baja, revisa tu proceso de cierre, pricing, competencia o urgencia del cliente.",
          formula: "Tasa = (Ventas cerradas / Oportunidades en propuesta) × 100"
        }
      ],
      proTips: {
        title: "Tips Profesionales (SDR)",
        tips: [
          "5-25 reuniones agendadas al mes es el rango típico para SDRs en B2B",
          "1-2 reuniones al día es un buen objetivo operativo",
          "Los SDR pueden generar entre 40% y 70% del pipeline total",
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
      title: "Visual Sales Funnel Calculator (B2B SaaS)",
      subtitle: "Calculate how many leads you need to reach your closing goals",
      showCalculator: "Show Calculator",
      hideCalculator: "Hide Calculator",
      inputsTitle: "1. Define your Goals and Conversion Rates",
      resultsTitle: "2. Results",
      funnelChartTitle: "3. Funnel Visualization",
      metaCierres: "Closing Goal (Sales)",
      ticketPromedio: "Average Annual Ticket ($)",
      leadContacto: "% Lead to Qualified Contact",
      contactoReunion: "% Lead to Meeting",
      reunionAsistencia: "% Attendance Rate (Show Rate)",
      reunionOportunidad: "% Meeting to Opportunity",
      oportunidadCierre: "% Opportunity to Close",
      cierres: "Sales to Close",
      oportunidades: "Opportunities",
      reuniones: "Attended Meetings",
      reunionesAgendadas: "Scheduled Meetings",
      leads: "Leads Needed",
      ingresos: "Projection",
      conversionTotal: "Total Conversion",
      benchmark: "Benchmark",
      pacingTitle: "⚡ Daily & Weekly Operational Pacing",
      pacingSubtitle: "Calculated based on 20 working days per month (Mon-Fri) for monthly goals",
      pacingLeads: "Daily Leads",
      pacingMeetings: "Scheduled / week",
      pacingAttended: "Attended / week",
      pacingOpps: "Opps / week",
      pacingCloses: "Closes / week",
      conclusion: (leads: number, cierres: number, period: string) =>
        `To reach your goal of ${cierres} close(s) ${period}, you need to generate approximately ${leads} leads.`,
      healthyFunnel: "Excellent metrics! Your funnel looks healthy compared to benchmarks.",
      tooltips: {
        leadContacto: "Percentage of leads that convert to qualified contacts. Target: 30-60%",
        contactoReunion: "Of qualified contacts, % that accept a meeting. Target: 20-40%",
        reunionAsistencia: "Percentage of scheduled meetings that actually take place. Target: 60-80%",
        reunionOportunidad: "% of meetings that become qualified opportunities. Target: 25-50%",
        oportunidadCierre: "% of opportunities that close. Target: 20-30%",
      },
      optimizationTips: {
        title: "Optimization Diagnosis",
        leadContacto: "Low Lead → Contact conversion: Check lead quality, acquisition channels or database.",
        contactoReunion: "Low Contact → Meeting conversion: Problem with initial pitch or target audience.",
        reunionAsistencia: "Low Attendance Rate (Show Rate): Improve your confirmation and reminder workflow (email/WhatsApp).",
        reunionOportunidad: "Low Meeting → Opportunity: You're talking to people without BANT (Budget, Authority, Need, Timing).",
        oportunidadCierre: "Low Opportunity → Close: Price, competition, or urgency issues.",
      },
      howToTitle: "How to measure and use these metrics?",
      howToItems: [
        {
          title: "Lead to Qualified Contact (30-60%)",
          howToGet: "Divide qualified contacts by total leads generated. A qualified contact is one that responds and shows initial interest.",
          howToUse: "If low, check lead source quality, segmentation and acquisition channels.",
          formula: "Rate = (Qualified contacts / Total leads) × 100"
        },
        {
          title: "Lead to Meeting (20-40%)",
          howToGet: "Of contacts who responded, count how many accept a meeting. If 10 respond and 3 schedule = 30%.",
          howToUse: "If low, the problem may be: 1) Your pitch/value proposition, or 2) Your audience (wrong target market).",
          formula: "Rate = (Meetings scheduled / Qualified contacts) × 100"
        },
        {
          title: "Meeting to Opportunity (25-50%)",
          howToGet: "An opportunity is a prospect with BANT: Budget, Authority, Need, Timing. Divide opportunities by meetings held.",
          howToUse: "If low, evaluate if you're qualifying well before the meeting. The problem may be lead quality.",
          formula: "Rate = (Qualified opportunities / Meetings held) × 100"
        },
        {
          title: "Opportunity to Close (20-30%)",
          howToGet: "Divide closed sales by opportunities that reached proposal or negotiation stage.",
          howToUse: "If low, review your closing process, pricing, competition or customer urgency.",
          formula: "Rate = (Closed sales / Opportunities in proposal) × 100"
        }
      ],
      proTips: {
        title: "Pro Tips (SDR)",
        tips: [
          "5-25 scheduled meetings per month is the typical range for B2B SDRs",
          "1-2 meetings per day is a good operational target",
          "SDRs can generate between 40% and 70% of total pipeline",
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

  const calculate = () => {
    const {
      metaCierres,
      ticketPromedio,
      leadContacto,
      contactoReunion,
      reunionAsistencia,
      reunionOportunidad,
      oportunidadCierre,
    } = inputs;

    if (
      oportunidadCierre <= 0 ||
      reunionOportunidad <= 0 ||
      reunionAsistencia <= 0 ||
      contactoReunion <= 0 ||
      leadContacto <= 0
    ) {
      setResults({
        cierres: 0,
        oportunidades: 0,
        reuniones: 0,
        reunionesAgendadas: 0,
        leads: 0,
        ingresos: 0,
        conversionTotal: 0,
      });
      return;
    }

    // Cálculo inverso desde cierres hasta leads
    const oportunidades = Math.ceil(metaCierres / (oportunidadCierre / 100));
    const reuniones = Math.ceil(oportunidades / (reunionOportunidad / 100)); // Reuniones Realizadas (attended)
    const reunionesAgendadas = Math.ceil(reuniones / (reunionAsistencia / 100)); // Reuniones Agendadas (scheduled)
    const leadReunionRate = (leadContacto / 100) * (contactoReunion / 100);
    const leads = Math.ceil(reunionesAgendadas / leadReunionRate);
    const ingresos = metaCierres * ticketPromedio;
    const conversionTotal = leads > 0 ? (metaCierres / leads) * 100 : 0;

    setResults({
      cierres: metaCierres,
      oportunidades,
      reuniones,
      reunionesAgendadas,
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
    if (inputs.leadContacto < benchmarks.leadContacto.min) {
      warnings.push(text.optimizationTips.leadContacto);
    }
    if (inputs.contactoReunion < benchmarks.contactoReunion.min) {
      warnings.push(text.optimizationTips.contactoReunion);
    }
    if (inputs.reunionAsistencia < benchmarks.reunionAsistencia.min) {
      warnings.push(text.optimizationTips.reunionAsistencia);
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
  const isHealthyFunnel = warnings.length === 0;

  // Calcular anchos del embudo basados en proporciones
  const getFunnelWidth = (value: number) => {
    if (results.leads === 0) return 100;
    return Math.max(20, (value / results.leads) * 100);
  };

  // Calcular conversión entre etapas
  const getConversionRateBetweenStages = () => {
    const leadReunionRate = (inputs.leadContacto / 100) * (inputs.contactoReunion / 100) * 100;
    return {
      leadReunion: leadReunionRate.toFixed(1),
      reunionOportunidad: inputs.reunionOportunidad,
      oportunidadCierre: inputs.oportunidadCierre,
    };
  };

  const conversionRates = getConversionRateBetweenStages();

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full glass-effect rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-card/60 transition-all duration-200 group"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-md bg-gradient-primary">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-sm sm:text-base font-semibold text-foreground font-display">
                {text.title}
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {text.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden md:inline">
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
                    {text.metaCierres}
                  </Label>
                  <Input
                    type="number"
                    value={inputs.metaCierres}
                    onChange={(e) => handleInputChange("metaCierres", e.target.value)}
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

                {/* Lead a Contacto Calificado */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.leadContacto}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{text.tooltips.leadContacto}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.leadContacto.min}-{benchmarks.leadContacto.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.leadContacto}
                      onChange={(e) => handleInputChange("leadContacto", e.target.value)}
                      className={`bg-secondary/50 border-border pr-16 ${
                        getBenchmarkStatus("leadContacto", inputs.leadContacto) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      {benchmarks.leadContacto.min}-{benchmarks.leadContacto.max}%
                    </span>
                  </div>
                </div>

                {/* Lead a Reunión */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.contactoReunion}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{text.tooltips.contactoReunion}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.contactoReunion.min}-{benchmarks.contactoReunion.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.contactoReunion}
                      onChange={(e) => handleInputChange("contactoReunion", e.target.value)}
                      className={`bg-secondary/50 border-border pr-16 ${
                        getBenchmarkStatus("contactoReunion", inputs.contactoReunion) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      {benchmarks.contactoReunion.min}-{benchmarks.contactoReunion.max}%
                    </span>
                  </div>
                </div>

                {/* Tasa de Asistencia (Show Rate) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {text.reunionAsistencia}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{text.tooltips.reunionAsistencia}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {text.benchmark}: {benchmarks.reunionAsistencia.min}-{benchmarks.reunionAsistencia.max}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs.reunionAsistencia}
                      onChange={(e) => handleInputChange("reunionAsistencia", e.target.value)}
                      className={`bg-secondary/50 border-border pr-16 ${
                        getBenchmarkStatus("reunionAsistencia", inputs.reunionAsistencia) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      {benchmarks.reunionAsistencia.min}-{benchmarks.reunionAsistencia.max}%
                    </span>
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
                      className={`bg-secondary/50 border-border pr-16 ${
                        getBenchmarkStatus("reunionOportunidad", inputs.reunionOportunidad) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      {benchmarks.reunionOportunidad.min}-{benchmarks.reunionOportunidad.max}%
                    </span>
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
                      className={`bg-secondary/50 border-border pr-16 ${
                        getBenchmarkStatus("oportunidadCierre", inputs.oportunidadCierre) === "low"
                          ? "border-destructive/50"
                          : ""
                      }`}
                      min={0}
                      max={100}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      {benchmarks.oportunidadCierre.min}-{benchmarks.oportunidadCierre.max}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Layout - Results + Funnel */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Results Column */}
              <div className="flex-1 min-w-[280px]">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {text.resultsTitle}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Leads Card */}
                  <div className="glass-effect rounded-lg p-4 text-center border-l-4" style={{ borderColor: FUNNEL_COLORS.leads }}>
                    <p className="text-xs text-muted-foreground mb-1">{text.leads}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.leads.toLocaleString()}
                    </p>
                  </div>

                  {/* Reuniones Agendadas Card */}
                  <div className="glass-effect rounded-lg p-4 text-center border-l-4" style={{ borderColor: FUNNEL_COLORS.reunionesAgendadas }}>
                    <p className="text-xs text-muted-foreground mb-1">{text.reunionesAgendadas}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.reunionesAgendadas.toLocaleString()}
                    </p>
                  </div>

                  {/* Reuniones Realizadas Card */}
                  <div className="glass-effect rounded-lg p-4 text-center border-l-4" style={{ borderColor: FUNNEL_COLORS.reunionesRealizadas }}>
                    <p className="text-xs text-muted-foreground mb-1">{text.reuniones}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.reuniones.toLocaleString()}
                    </p>
                  </div>

                  {/* Oportunidades Card */}
                  <div className="glass-effect rounded-lg p-4 text-center border-l-4" style={{ borderColor: FUNNEL_COLORS.oportunidades }}>
                    <p className="text-xs text-muted-foreground mb-1">{text.oportunidades}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.oportunidades.toLocaleString()}
                    </p>
                  </div>

                  {/* Cierres Card */}
                  <div className="glass-effect rounded-lg p-4 text-center border-l-4" style={{ borderColor: FUNNEL_COLORS.cierres }}>
                    <p className="text-xs text-muted-foreground mb-1">{text.cierres}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.cierres}
                    </p>
                  </div>
                </div>
              </div>

              {/* Funnel Column */}
              <div className="flex-[1.5] min-w-[320px]">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {text.funnelChartTitle}
                </h3>
                
                {/* Visual Funnel */}
                <div className="space-y-4 bg-card/30 p-4 rounded-xl border border-border/50">
                  {/* Leads Stage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-foreground">{language === "es" ? "Leads" : "Leads"}</span>
                      <span className="font-bold text-foreground">{results.leads.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: FUNNEL_COLORS.leads,
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Reuniones Agendadas Stage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-foreground">{text.reunionesAgendadas}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                          {conversionRates.leadReunion}%
                        </span>
                        <span className="font-bold text-foreground">{results.reunionesAgendadas.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: FUNNEL_COLORS.reunionesAgendadas,
                          width: `${getFunnelWidth(results.reunionesAgendadas)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Reuniones Realizadas Stage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-foreground">{text.reuniones}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                          {inputs.reunionAsistencia}%
                        </span>
                        <span className="font-bold text-foreground">{results.reuniones.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: FUNNEL_COLORS.reunionesRealizadas,
                          width: `${getFunnelWidth(results.reuniones)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Oportunidades Stage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-foreground">{language === "es" ? "Oportunidades" : "Opportunities"}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                          {inputs.reunionOportunidad}%
                        </span>
                        <span className="font-bold text-foreground">{results.oportunidades.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: FUNNEL_COLORS.oportunidades,
                          width: `${getFunnelWidth(results.oportunidades)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Cierres Stage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-foreground">{language === "es" ? "Cierres" : "Closes"}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                          {inputs.oportunidadCierre}%
                        </span>
                        <span className="font-bold text-foreground">{results.cierres}</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: FUNNEL_COLORS.cierres,
                          width: `${getFunnelWidth(results.cierres)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projection and Diagnosis */}
            <div className={`rounded-lg p-4 sm:p-5 ${isHealthyFunnel ? 'bg-primary/10 border border-primary/30' : 'bg-destructive/10 border border-destructive/30'}`}>
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
              
              {isHealthyFunnel ? (
                <p className="text-sm text-foreground/80">
                  {text.healthyFunnel} {text.conclusion(results.leads, results.cierres, periodLabels[language][timePeriod].toLowerCase())}
                </p>
              ) : (
                <div>
                  <p className="text-sm text-foreground/80 mb-3">
                    {text.conclusion(results.leads, results.cierres, periodLabels[language][timePeriod].toLowerCase())}
                  </p>
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

              {/* Period Breakdown */}
              {timePeriod !== "monthly" && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-3">
                    {language === "es" 
                      ? `Equivalente mensual aproximado${timePeriod === "daily" || timePeriod === "weekly" ? " (proyectado a mes):" : ":"}`
                      : `Approximate monthly equivalent${timePeriod === "daily" || timePeriod === "weekly" ? " (projected to month):" : ":"}`
                    }
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-background/50 rounded p-2 text-center">
                      <p className="text-[10px] text-muted-foreground">{text.leads}</p>
                      <p className="text-sm font-semibold" style={{ color: FUNNEL_COLORS.leads }}>
                        {Math.ceil(results.leads / getPeriodMultiplier(timePeriod)).toLocaleString()}
                        <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                      </p>
                    </div>
                    <div className="bg-background/50 rounded p-2 text-center">
                      <p className="text-[10px] text-muted-foreground">{text.reuniones}</p>
                      <p className="text-sm font-semibold" style={{ color: FUNNEL_COLORS.reuniones }}>
                        {Math.ceil(results.reuniones / getPeriodMultiplier(timePeriod)).toLocaleString()}
                        <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                      </p>
                    </div>
                    <div className="bg-background/50 rounded p-2 text-center">
                      <p className="text-[10px] text-muted-foreground">{text.oportunidades}</p>
                      <p className="text-sm font-semibold" style={{ color: FUNNEL_COLORS.oportunidades }}>
                        {(results.oportunidades / getPeriodMultiplier(timePeriod)).toFixed(1)}
                        <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                      </p>
                    </div>
                    <div className="bg-background/50 rounded p-2 text-center">
                      <p className="text-[10px] text-muted-foreground">{text.cierres}</p>
                      <p className="text-sm font-semibold" style={{ color: FUNNEL_COLORS.cierres }}>
                        {(results.cierres / getPeriodMultiplier(timePeriod)).toFixed(1)}
                        <span className="text-[10px] text-muted-foreground">{periodLabels[language].perMonth}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pacing Section */}
            {timePeriod === "monthly" && (
              <div className="glass-effect rounded-lg p-4 sm:p-5 border border-primary/20">
                <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {text.pacingTitle}
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {text.pacingSubtitle}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-secondary/20 rounded p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{text.pacingLeads}</p>
                    <p className="text-lg font-bold text-foreground">
                      {Math.ceil(results.leads / 20).toLocaleString()}
                      <span className="text-[10px] text-muted-foreground font-normal block">/día</span>
                    </p>
                  </div>
                  <div className="bg-secondary/20 rounded p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{text.pacingMeetings}</p>
                    <p className="text-lg font-bold text-foreground">
                      {(results.reunionesAgendadas / 4).toFixed(1)}
                      <span className="text-[10px] text-muted-foreground font-normal block">/semana</span>
                    </p>
                  </div>
                  <div className="bg-secondary/20 rounded p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{text.pacingAttended}</p>
                    <p className="text-lg font-bold text-foreground">
                      {(results.reuniones / 4).toFixed(1)}
                      <span className="text-[10px] text-muted-foreground font-normal block">/semana</span>
                    </p>
                  </div>
                  <div className="bg-secondary/20 rounded p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{text.pacingOpps}</p>
                    <p className="text-lg font-bold text-foreground">
                      {(results.oportunidades / 4).toFixed(1)}
                      <span className="text-[10px] text-muted-foreground font-normal block">/semana</span>
                    </p>
                  </div>
                  <div className="bg-secondary/20 rounded p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{text.pacingCloses}</p>
                    <p className="text-lg font-bold text-foreground">
                      {(results.cierres / 4).toFixed(1)}
                      <span className="text-[10px] text-muted-foreground font-normal block">/semana</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                          style={{ backgroundColor: Object.values(FUNNEL_COLORS)[index] }}
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
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SalesCalculator;
