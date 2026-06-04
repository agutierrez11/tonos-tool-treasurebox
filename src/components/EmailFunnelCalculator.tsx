import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFunnelMetrics } from "@/contexts/FunnelMetricsContext";
import { Mail, MailOpen, MessageCircle, Calendar, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Lightbulb, Wrench, BookOpen, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FUNNEL_COLORS = {
  enviados: "hsl(220, 15%, 40%)",
  abiertos: "hsl(45, 100%, 51%)",
  respondidos: "hsl(217, 91%, 60%)",
  reuniones: "hsl(152, 69%, 31%)",
};

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  conversionRate?: number;
}

// Benchmarks para email outreach B2B
const benchmarks = {
  abiertosEnviados: { min: 20, max: 40, avg: 30 },
  respondidosAbiertos: { min: 5, max: 15, avg: 10 },
  reunionesRespondidos: { min: 20, max: 50, avg: 35 },
};

type TimePeriod = 'daily' | 'weekly' | 'monthly';

const EmailFunnelCalculator = () => {
  const { language } = useLanguage();
  const { emailMetrics, setEmailMetrics } = useFunnelMetrics();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  
  // Datos del usuario - sincronizados con el contexto
  const [emailsEnviados, setEmailsEnviados] = useState(emailMetrics.emailsEnviados);
  const [emailsAbiertos, setEmailsAbiertos] = useState(emailMetrics.emailsAbiertos);
  const [emailsRespondidos, setEmailsRespondidos] = useState(emailMetrics.emailsRespondidos);
  const [reuniones, setReuniones] = useState(emailMetrics.reuniones);

  // Sincronizar con el contexto cuando cambian los valores
  useEffect(() => {
    setEmailMetrics({
      emailsEnviados,
      emailsAbiertos,
      emailsRespondidos,
      reuniones,
    });
  }, [emailsEnviados, emailsAbiertos, emailsRespondidos, reuniones, setEmailMetrics]);

  // Cálculo de tasas de conversión
  const tasas = useMemo(() => {
    const tasaAbiertos = emailsEnviados > 0 ? (emailsAbiertos / emailsEnviados) * 100 : 0;
    const tasaRespondidos = emailsAbiertos > 0 ? (emailsRespondidos / emailsAbiertos) * 100 : 0;
    const tasaReuniones = emailsRespondidos > 0 ? (reuniones / emailsRespondidos) * 100 : 0;
    const tasaTotal = emailsEnviados > 0 ? (reuniones / emailsEnviados) * 100 : 0;

    return {
      abiertos: tasaAbiertos,
      respondidos: tasaRespondidos,
      reuniones: tasaReuniones,
      total: tasaTotal,
    };
  }, [emailsEnviados, emailsAbiertos, emailsRespondidos, reuniones]);

  const [targetMeetings, setTargetMeetings] = useState(5);

  const businessDays = useMemo(() => {
    if (timePeriod === 'monthly') return 20;
    if (timePeriod === 'weekly') return 5;
    return 1;
  }, [timePeriod]);

  const simulatedMetrics = useMemo(() => {
    const rAbiertos = tasas.abiertos > 0 ? tasas.abiertos / 100 : benchmarks.abiertosEnviados.avg / 100;
    const rRespondidos = tasas.respondidos > 0 ? tasas.respondidos / 100 : benchmarks.respondidosAbiertos.avg / 100;
    const rReuniones = tasas.reuniones > 0 ? tasas.reuniones / 100 : benchmarks.reunionesRespondidos.avg / 100;

    const respondidos = targetMeetings / rReuniones;
    const abiertos = respondidos / rRespondidos;
    const enviados = abiertos / rAbiertos;

    return {
      enviados: isNaN(enviados) || !isFinite(enviados) ? 0 : enviados,
      abiertos: isNaN(abiertos) || !isFinite(abiertos) ? 0 : abiertos,
      respondidos: isNaN(respondidos) || !isFinite(respondidos) ? 0 : respondidos,
    };
  }, [targetMeetings, tasas]);

  const getFunnelWidth = (value: number) => {
    if (emailsEnviados === 0) return "100%";
    const percentage = Math.max((value / emailsEnviados) * 100, 15);
    return `${Math.min(percentage, 100)}%`;
  };

  const getConversionStatus = (value: number, benchmark: { min: number; max: number; avg: number }) => {
    if (value >= benchmark.avg) return { icon: <TrendingUp className="w-4 h-4 text-green-500" />, status: "good" };
    if (value >= benchmark.min) return { icon: <Minus className="w-4 h-4 text-yellow-500" />, status: "average" };
    return { icon: <TrendingDown className="w-4 h-4 text-red-500" />, status: "low" };
  };

  const funnelStages: FunnelStage[] = [
    {
      id: "enviados",
      name: language === "es" ? "Emails Enviados" : "Emails Sent",
      value: emailsEnviados,
      color: FUNNEL_COLORS.enviados,
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: "abiertos",
      name: language === "es" ? "Abiertos" : "Opened",
      value: emailsAbiertos,
      color: FUNNEL_COLORS.abiertos,
      icon: <MailOpen className="w-5 h-5" />,
      conversionRate: tasas.abiertos,
    },
    {
      id: "respondidos",
      name: language === "es" ? "Respondidos" : "Replied",
      value: emailsRespondidos,
      color: FUNNEL_COLORS.respondidos,
      icon: <MessageCircle className="w-5 h-5" />,
      conversionRate: tasas.respondidos,
    },
    {
      id: "reuniones",
      name: language === "es" ? "Reuniones" : "Meetings",
      value: reuniones,
      color: FUNNEL_COLORS.reuniones,
      icon: <Calendar className="w-5 h-5" />,
      conversionRate: tasas.reuniones,
    },
  ];

  const getDiagnosis = () => {
    const issues: string[] = [];
    
    if (tasas.abiertos < benchmarks.abiertosEnviados.min) {
      issues.push(language === "es" 
        ? `Tu tasa de apertura (${tasas.abiertos.toFixed(1)}%) está por debajo del mínimo (${benchmarks.abiertosEnviados.min}%). Mejora tus asuntos y remitente.`
        : `Your open rate (${tasas.abiertos.toFixed(1)}%) is below minimum (${benchmarks.abiertosEnviados.min}%). Improve your subject lines and sender name.`
      );
    }
    
    if (tasas.respondidos < benchmarks.respondidosAbiertos.min) {
      issues.push(language === "es"
        ? `Tu tasa de respuesta (${tasas.respondidos.toFixed(1)}%) está baja. Personaliza más tus mensajes y ofrece valor claro.`
        : `Your reply rate (${tasas.respondidos.toFixed(1)}%) is low. Personalize your messages more and offer clear value.`
      );
    }
    
    if (tasas.reuniones < benchmarks.reunionesRespondidos.avg) {
      issues.push(language === "es"
        ? `Tu conversión a reuniones (${tasas.reuniones.toFixed(1)}%) puede mejorar. Incluye un CTA claro y facilita la agenda.`
        : `Your meeting conversion (${tasas.reuniones.toFixed(1)}%) can improve. Include a clear CTA and make scheduling easy.`
      );
    }

    if (issues.length === 0) {
      return language === "es"
        ? `¡Excelentes métricas! Tu conversión total es del ${tasas.total.toFixed(2)}% (${reuniones} reuniones de ${emailsEnviados} emails).`
        : `Excellent metrics! Your total conversion is ${tasas.total.toFixed(2)}% (${reuniones} meetings from ${emailsEnviados} emails).`;
    }

    return issues.join(" ");
  };

  const timePeriodLabels = {
    es: { daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual' },
    en: { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' },
  };

  const text = {
    es: {
      title: "Funnel de Emails",
      subtitle: "Mide el rendimiento de tus campañas de email outreach",
      showCalculator: "Mostrar Calculadora",
      hideCalculator: "Ocultar Calculadora",
      tusDatos: "Tus Datos",
      emailsEnviados: "Emails Enviados",
      abiertos: "Abiertos",
      respondidos: "Respondidos",
      reunion: "Reunión",
      tasaConversion: "Tasa de Conversión",
      conversionTotal: "Conversión Total",
      periodo: "Período",
    },
    en: {
      title: "Email Funnel",
      subtitle: "Measure your email outreach campaign performance",
      showCalculator: "Show Calculator",
      hideCalculator: "Hide Calculator",
      tusDatos: "Your Data",
      emailsEnviados: "Emails Sent",
      abiertos: "Opened",
      respondidos: "Replied",
      reunion: "Meeting",
      tasaConversion: "Conversion Rate",
      conversionTotal: "Total Conversion",
      periodo: "Period",
    },
  };

  const t = text[language];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-effect rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-card/60 transition-all duration-200 group"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-md bg-gradient-to-br from-purple-500/80 to-purple-600/80">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-sm sm:text-base font-semibold text-foreground font-display">
              {t.title}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:inline">
            {isExpanded ? t.hideCalculator : t.showCalculator}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
      </button>

      {/* Calculator Content */}
      {isExpanded && (
        <div className="mt-6 glass-effect rounded-xl p-4 sm:p-6 space-y-8">
          {/* Time Period Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">{t.periodo}:</span>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    timePeriod === period
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {timePeriodLabels[language][period]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-semibold text-lg border-b border-border pb-2">
                {t.tusDatos}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emailsEnviados" className="text-sm font-medium">
                      {t.emailsEnviados}
                    </Label>
                    <Input
                      id="emailsEnviados"
                      type="number"
                      min="0"
                      value={emailsEnviados}
                      onChange={(e) => setEmailsEnviados(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <span className="text-muted-foreground text-sm pb-2">—</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="abiertos" className="text-sm font-medium">
                      {t.abiertos}
                    </Label>
                    <Input
                      id="abiertos"
                      type="number"
                      min="0"
                      value={emailsAbiertos}
                      onChange={(e) => setEmailsAbiertos(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    {getConversionStatus(tasas.abiertos, benchmarks.abiertosEnviados).icon}
                    <span className="font-semibold text-lg">{tasas.abiertos.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      ({benchmarks.abiertosEnviados.min}-{benchmarks.abiertosEnviados.max}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="respondidos" className="text-sm font-medium">
                      {t.respondidos}
                    </Label>
                    <Input
                      id="respondidos"
                      type="number"
                      min="0"
                      value={emailsRespondidos}
                      onChange={(e) => setEmailsRespondidos(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    {getConversionStatus(tasas.respondidos, benchmarks.respondidosAbiertos).icon}
                    <span className="font-semibold text-lg">{tasas.respondidos.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      ({benchmarks.respondidosAbiertos.min}-{benchmarks.respondidosAbiertos.max}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reunionesEmail" className="text-sm font-medium">
                      {t.reunion}
                    </Label>
                    <Input
                      id="reunionesEmail"
                      type="number"
                      min="0"
                      value={reuniones}
                      onChange={(e) => setReuniones(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    {getConversionStatus(tasas.reuniones, benchmarks.reunionesRespondidos).icon}
                    <span className="font-semibold text-lg">{tasas.reuniones.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      ({benchmarks.reunionesRespondidos.min}-{benchmarks.reunionesRespondidos.max}%)
                    </span>
                  </div>
                </div>

                {/* Conversión Total */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t.conversionTotal}</span>
                    <span className="text-2xl font-bold text-primary">{tasas.total.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulador de Metas */}
            <div className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm mt-6">
              <h3 className="font-semibold text-lg border-b border-border pb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                {language === "es" ? "Simulador de Actividad (Planificación)" : "Activity Simulator (Planning)"}
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="targetMeetings" className="text-sm font-medium">
                    {language === "es" ? "Meta de reuniones a lograr" : "Meeting goal to achieve"}
                  </Label>
                  <Input
                    id="targetMeetings"
                    type="number"
                    min="1"
                    value={targetMeetings}
                    onChange={(e) => setTargetMeetings(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {language === "es" 
                      ? `Calculado usando tus tasas de conversión actuales (o benchmarks si no hay datos) y asumiendo ${timePeriod === 'monthly' ? '20' : timePeriod === 'weekly' ? '5' : '1'} días hábiles para el período ${timePeriodLabels[language][timePeriod].toLowerCase()}:`
                      : `Calculated using your current conversion rates (or benchmarks if no data) and assuming ${timePeriod === 'monthly' ? '20' : timePeriod === 'weekly' ? '5' : '1'} business days for the ${timePeriodLabels[language][timePeriod].toLowerCase()} period:`
                    }
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-background/80 rounded p-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-1">{language === "es" ? "Enviados" : "Sent"}</p>
                      <p className="text-sm font-bold text-foreground">{Math.ceil(simulatedMetrics.enviados)}</p>
                      <span className="text-[9px] text-muted-foreground font-normal block">({(simulatedMetrics.enviados / businessDays).toFixed(1)}/día)</span>
                    </div>
                    <div className="bg-background/80 rounded p-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-1">{language === "es" ? "Abiertos" : "Opened"}</p>
                      <p className="text-sm font-bold text-foreground">{Math.ceil(simulatedMetrics.abiertos)}</p>
                      <span className="text-[9px] text-muted-foreground font-normal block">({(simulatedMetrics.abiertos / businessDays).toFixed(1)}/día)</span>
                    </div>
                    <div className="bg-background/80 rounded p-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-1">{language === "es" ? "Respondidos" : "Replied"}</p>
                      <p className="text-sm font-bold text-foreground">{Math.ceil(simulatedMetrics.respondidos)}</p>
                      <span className="text-[9px] text-muted-foreground font-normal block">({(simulatedMetrics.respondidos / businessDays).toFixed(1)}/día)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">
                  {language === "es" ? "Visualización del Embudo" : "Funnel Visualization"}
                </h3>
                
                <div className="space-y-4">
                  {funnelStages.map((stage) => (
                    <div key={stage.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <span className="text-muted-foreground">{stage.icon}</span>
                          <span>{stage.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {stage.conversionRate !== undefined && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                              {stage.conversionRate.toFixed(1)}%
                            </span>
                          )}
                          <span className="font-bold text-foreground">{stage.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: stage.color,
                            width: getFunnelWidth(stage.value)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {language === "es" ? "Diagnóstico" : "Diagnosis"}
                </h4>
                <p className="text-sm text-muted-foreground">{getDiagnosis()}</p>
              </div>
            </div>
          </div>

          {/* Educational Accordion */}
          <div className="mt-8">
            <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
              <AccordionItem value="tips" className="border-none">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <span className="flex items-center gap-2 font-semibold">
                    <Lightbulb className="w-4 h-4" />
                    {language === "es" ? "Consejos para mejorar tu email outreach" : "Tips to improve your email outreach"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center gap-2">
                        <MailOpen className="w-4 h-4" style={{ color: FUNNEL_COLORS.abiertos }} />
                        {language === "es" ? "Mejorar Apertura" : "Improve Open Rate"}
                      </h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• {language === "es" ? "Usa asuntos cortos y curiosos" : "Use short, curious subject lines"}</li>
                        <li>• {language === "es" ? "Personaliza el nombre del remitente" : "Personalize sender name"}</li>
                        <li>• {language === "es" ? "Envía en horarios óptimos (martes-jueves 9-11am)" : "Send at optimal times (Tue-Thu 9-11am)"}</li>
                        <li>• {language === "es" ? "Evita palabras spam" : "Avoid spam trigger words"}</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" style={{ color: FUNNEL_COLORS.respondidos }} />
                        {language === "es" ? "Mejorar Respuestas" : "Improve Reply Rate"}
                      </h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• {language === "es" ? "Personaliza cada mensaje" : "Personalize each message"}</li>
                        <li>• {language === "es" ? "Ofrece valor inmediato" : "Offer immediate value"}</li>
                        <li>• {language === "es" ? "Haz preguntas específicas" : "Ask specific questions"}</li>
                        <li>• {language === "es" ? "Sé breve y directo" : "Be brief and direct"}</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: FUNNEL_COLORS.reuniones }} />
                        {language === "es" ? "Cerrar Reuniones" : "Close Meetings"}
                      </h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• {language === "es" ? "Incluye enlace de Calendly" : "Include Calendly link"}</li>
                        <li>• {language === "es" ? "Propón fechas específicas" : "Propose specific dates"}</li>
                        <li>• {language === "es" ? "Follow-up estratégico (3-5 emails)" : "Strategic follow-up (3-5 emails)"}</li>
                        <li>• {language === "es" ? "Facilita la toma de decisión" : "Make decision-making easy"}</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tools" className="border-t border-border">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <span className="flex items-center gap-2 font-semibold">
                    <Wrench className="w-4 h-4" />
                    {language === "es" ? "Herramientas Recomendadas" : "Recommended Tools"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <a 
                      href="https://www.lemlist.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <h5 className="font-semibold mb-1 flex items-center gap-2">
                        Lemlist <ExternalLink className="w-3 h-3" />
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {language === "es" ? "Automatización de secuencias de email con personalización avanzada" : "Email sequence automation with advanced personalization"}
                      </p>
                    </a>
                    <a 
                      href="https://www.apollo.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <h5 className="font-semibold mb-1 flex items-center gap-2">
                        Apollo.io <ExternalLink className="w-3 h-3" />
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {language === "es" ? "Prospección y engagement de ventas todo en uno" : "All-in-one sales prospecting and engagement"}
                      </p>
                    </a>
                    <a 
                      href="https://www.mailshake.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <h5 className="font-semibold mb-1 flex items-center gap-2">
                        Mailshake <ExternalLink className="w-3 h-3" />
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {language === "es" ? "Outreach de ventas simple y efectivo" : "Simple and effective sales outreach"}
                      </p>
                    </a>
                    <a 
                      href="https://hunter.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <h5 className="font-semibold mb-1 flex items-center gap-2">
                        Hunter.io <ExternalLink className="w-3 h-3" />
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {language === "es" ? "Encuentra y verifica emails profesionales" : "Find and verify professional emails"}
                      </p>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="resources" className="border-t border-border">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <span className="flex items-center gap-2 font-semibold">
                    <BookOpen className="w-4 h-4" />
                    {language === "es" ? "Recursos para Mejorar" : "Resources to Improve"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h5 className="font-semibold mb-3">{language === "es" ? "📚 Libros Recomendados" : "📚 Recommended Books"}</h5>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>
                          <a href="https://www.amazon.com/Predictable-Revenue-Business-Practices-Salesforce-com/dp/0984380213" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <span className="font-medium text-foreground">Predictable Revenue</span> - Aaron Ross
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.amazon.com/Email-Persuasion-Captivate-Authority-Prospects/dp/0692294961" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <span className="font-medium text-foreground">Email Persuasion</span> - Ian Brodie
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.amazon.com/Cold-Email-Manifesto-Pipeline-Money/dp/B0BYBRGF2C" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <span className="font-medium text-foreground">Cold Email Manifesto</span> - Alex Berman
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-3">{language === "es" ? "🎓 Cursos y Materiales" : "🎓 Courses & Materials"}</h5>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>
                          <a href="https://www.lemlist.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <span className="font-medium text-foreground">Lemlist Blog & Templates</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.youtube.com/@alexberman" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <span className="font-medium text-foreground">Alex Berman YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.hubspot.com/resources/template/email-templates" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <span className="font-medium text-foreground">HubSpot Email Templates</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailFunnelCalculator;
