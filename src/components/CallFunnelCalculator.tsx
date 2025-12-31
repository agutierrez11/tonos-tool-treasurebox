import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, PhoneCall, MessageSquare, Calendar, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FUNNEL_COLORS = {
  llamadas: "hsl(220, 15%, 40%)",
  conectadas: "hsl(45, 100%, 51%)",
  conversaciones: "hsl(217, 91%, 60%)",
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

// Benchmarks basados en los datos proporcionados
const benchmarks = {
  conectadasLlamadas: { min: 30, max: 60, avg: 50 },
  conversacionesConectadas: { min: 15, max: 30, avg: 20 },
  reunionesConversaciones: { min: 5, max: 15, avg: 10 },
};

type TimePeriod = 'daily' | 'weekly' | 'monthly';

const CallFunnelCalculator = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  
  // Datos reales del usuario
  const [llamadasRealizadas, setLlamadasRealizadas] = useState(100);
  const [contestadas, setContestadas] = useState(50);
  const [conversaciones, setConversaciones] = useState(10);
  const [reuniones, setReuniones] = useState(1);

  // Cálculo de tasas de conversión
  const tasas = useMemo(() => {
    const tasaContestadas = llamadasRealizadas > 0 ? (contestadas / llamadasRealizadas) * 100 : 0;
    const tasaConversaciones = contestadas > 0 ? (conversaciones / contestadas) * 100 : 0;
    const tasaReuniones = conversaciones > 0 ? (reuniones / conversaciones) * 100 : 0;
    const tasaTotal = llamadasRealizadas > 0 ? (reuniones / llamadasRealizadas) * 100 : 0;

    return {
      contestadas: tasaContestadas,
      conversaciones: tasaConversaciones,
      reuniones: tasaReuniones,
      total: tasaTotal,
    };
  }, [llamadasRealizadas, contestadas, conversaciones, reuniones]);

  const getFunnelWidth = (value: number) => {
    if (llamadasRealizadas === 0) return "100%";
    const percentage = Math.max((value / llamadasRealizadas) * 100, 15);
    return `${Math.min(percentage, 100)}%`;
  };

  const getConversionStatus = (value: number, benchmark: { min: number; max: number; avg: number }) => {
    if (value >= benchmark.avg) return { icon: <TrendingUp className="w-4 h-4 text-green-500" />, status: "good" };
    if (value >= benchmark.min) return { icon: <Minus className="w-4 h-4 text-yellow-500" />, status: "average" };
    return { icon: <TrendingDown className="w-4 h-4 text-red-500" />, status: "low" };
  };

  const funnelStages: FunnelStage[] = [
    {
      id: "llamadas",
      name: language === "es" ? "Llamadas Realizadas" : "Calls Made",
      value: llamadasRealizadas,
      color: FUNNEL_COLORS.llamadas,
      icon: <Phone className="w-5 h-5" />,
    },
    {
      id: "conectadas",
      name: language === "es" ? "Contestadas" : "Answered",
      value: contestadas,
      color: FUNNEL_COLORS.conectadas,
      icon: <PhoneCall className="w-5 h-5" />,
      conversionRate: tasas.contestadas,
    },
    {
      id: "conversaciones",
      name: language === "es" ? "Conversaciones" : "Conversations",
      value: conversaciones,
      color: FUNNEL_COLORS.conversaciones,
      icon: <MessageSquare className="w-5 h-5" />,
      conversionRate: tasas.conversaciones,
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
    
    if (tasas.contestadas < benchmarks.conectadasLlamadas.min) {
      issues.push(language === "es" 
        ? `Tu tasa de conexión (${tasas.contestadas.toFixed(1)}%) está por debajo del benchmark mínimo (${benchmarks.conectadasLlamadas.min}%). Revisa la calidad de tus datos de contacto y horarios de llamada.`
        : `Your connection rate (${tasas.contestadas.toFixed(1)}%) is below minimum benchmark (${benchmarks.conectadasLlamadas.min}%). Review your contact data quality and call timing.`
      );
    }
    
    if (tasas.conversaciones < benchmarks.conversacionesConectadas.min) {
      issues.push(language === "es"
        ? `Tu tasa de conversación (${tasas.conversaciones.toFixed(1)}%) está baja. Mejora tu apertura y propuesta de valor inicial.`
        : `Your conversation rate (${tasas.conversaciones.toFixed(1)}%) is low. Improve your opening and initial value proposition.`
      );
    }
    
    if (tasas.reuniones < benchmarks.reunionesConversaciones.avg) {
      issues.push(language === "es"
        ? `Tu tasa de reuniones (${tasas.reuniones.toFixed(1)}%) puede mejorar. Enfócate en generar interés genuino durante la conversación.`
        : `Your meeting rate (${tasas.reuniones.toFixed(1)}%) can improve. Focus on generating genuine interest during the conversation.`
      );
    }

    if (issues.length === 0) {
      return language === "es"
        ? `¡Excelentes métricas! Tu conversión total es del ${tasas.total.toFixed(2)}% (${reuniones} reuniones de ${llamadasRealizadas} llamadas).`
        : `Excellent metrics! Your total conversion is ${tasas.total.toFixed(2)}% (${reuniones} meetings from ${llamadasRealizadas} calls).`;
    }

    return issues.join(" ");
  };

  const timePeriodLabels = {
    es: { daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual' },
    en: { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' },
  };

  const text = {
    es: {
      title: "Funnel de Llamadas",
      subtitle: "Ingresa tus datos reales y mide tus tasas de conversión",
      showCalculator: "Mostrar Calculadora",
      hideCalculator: "Ocultar Calculadora",
      tusDatos: "Tus Datos",
      llamadasRealizadas: "Llamadas Realizadas",
      contestadas: "Contestadas",
      conversacion: "Conversación",
      reunion: "Reunión",
      tasaConversion: "Tasa de Conversión",
      conversionTotal: "Conversión Total",
      periodo: "Período",
    },
    en: {
      title: "Call Funnel",
      subtitle: "Enter your real data and measure your conversion rates",
      showCalculator: "Show Calculator",
      hideCalculator: "Hide Calculator",
      tusDatos: "Your Data",
      llamadasRealizadas: "Calls Made",
      contestadas: "Answered",
      conversacion: "Conversation",
      reunion: "Meeting",
      tasaConversion: "Conversion Rate",
      conversionTotal: "Total Conversion",
      periodo: "Period",
    },
  };

  const t = text[language];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-effect rounded-xl p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-card/80 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-display">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {isExpanded ? t.hideCalculator : t.showCalculator}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
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
            {/* Inputs - Formulario de datos */}
            <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-semibold text-lg border-b border-border pb-2">
                {t.tusDatos}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="llamadasRealizadas" className="text-sm font-medium">
                      {t.llamadasRealizadas}
                    </Label>
                    <Input
                      id="llamadasRealizadas"
                      type="number"
                      min="0"
                      value={llamadasRealizadas}
                      onChange={(e) => setLlamadasRealizadas(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <span className="text-muted-foreground text-sm pb-2">—</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contestadas" className="text-sm font-medium">
                      {t.contestadas}
                    </Label>
                    <Input
                      id="contestadas"
                      type="number"
                      min="0"
                      value={contestadas}
                      onChange={(e) => setContestadas(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    {getConversionStatus(tasas.contestadas, benchmarks.conectadasLlamadas).icon}
                    <span className="font-semibold text-lg">{tasas.contestadas.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      ({benchmarks.conectadasLlamadas.min}-{benchmarks.conectadasLlamadas.max}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="conversaciones" className="text-sm font-medium">
                      {t.conversacion}
                    </Label>
                    <Input
                      id="conversaciones"
                      type="number"
                      min="0"
                      value={conversaciones}
                      onChange={(e) => setConversaciones(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    {getConversionStatus(tasas.conversaciones, benchmarks.conversacionesConectadas).icon}
                    <span className="font-semibold text-lg">{tasas.conversaciones.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      ({benchmarks.conversacionesConectadas.min}-{benchmarks.conversacionesConectadas.max}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reuniones" className="text-sm font-medium">
                      {t.reunion}
                    </Label>
                    <Input
                      id="reuniones"
                      type="number"
                      min="0"
                      value={reuniones}
                      onChange={(e) => setReuniones(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    {getConversionStatus(tasas.reuniones, benchmarks.reunionesConversaciones).icon}
                    <span className="font-semibold text-lg">{tasas.reuniones.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      ({benchmarks.reunionesConversaciones.min}-{benchmarks.reunionesConversaciones.max}%)
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

            {/* Funnel Visualization */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">
                  {language === "es" ? "Visualización del Embudo" : "Funnel Visualization"}
                </h3>
                
                <div className="space-y-3">
                  {funnelStages.map((stage, index) => (
                    <div key={stage.id} className="flex flex-col items-center">
                      <div
                        className="relative flex items-center justify-between px-4 py-3 rounded-lg text-white transition-all duration-500 min-h-[50px]"
                        style={{
                          backgroundColor: stage.color,
                          width: getFunnelWidth(stage.value),
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {stage.icon}
                          <span className="font-medium text-sm">{stage.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {stage.conversionRate !== undefined && (
                            <span className="text-xs opacity-80">
                              {stage.conversionRate.toFixed(1)}%
                            </span>
                          )}
                          <span className="font-bold text-lg">{stage.value}</span>
                        </div>
                      </div>
                      {index < funnelStages.length - 1 && (
                        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-l-transparent border-r-transparent border-t-muted-foreground/30 my-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
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
                  <span className="font-semibold">
                    {language === "es" ? "Consejos para mejorar tu funnel de llamadas" : "Tips to improve your call funnel"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center gap-2">
                        <PhoneCall className="w-4 h-4" style={{ color: FUNNEL_COLORS.conectadas }} />
                        {language === "es" ? "Mejorar Conexión" : "Improve Connection"}
                      </h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• {language === "es" ? "Llama en horarios óptimos (10-12am, 2-4pm)" : "Call during optimal hours (10-12am, 2-4pm)"}</li>
                        <li>• {language === "es" ? "Verifica la calidad de los datos" : "Verify data quality"}</li>
                        <li>• {language === "es" ? "Usa número local cuando sea posible" : "Use local number when possible"}</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" style={{ color: FUNNEL_COLORS.conversaciones }} />
                        {language === "es" ? "Mejorar Conversación" : "Improve Conversation"}
                      </h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• {language === "es" ? "Ten un pitch de apertura claro" : "Have a clear opening pitch"}</li>
                        <li>• {language === "es" ? "Haz preguntas abiertas" : "Ask open questions"}</li>
                        <li>• {language === "es" ? "Escucha activamente" : "Listen actively"}</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: FUNNEL_COLORS.reuniones }} />
                        {language === "es" ? "Cerrar Reuniones" : "Close Meetings"}
                      </h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• {language === "es" ? "Identifica el dolor rápidamente" : "Identify pain quickly"}</li>
                        <li>• {language === "es" ? "Ofrece valor inmediato" : "Offer immediate value"}</li>
                        <li>• {language === "es" ? "Propón fecha concreta" : "Propose specific date"}</li>
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

export default CallFunnelCalculator;
