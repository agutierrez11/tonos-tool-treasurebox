import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, PhoneCall, MessageSquare, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
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

const CallFunnelCalculator = () => {
  const { language } = useLanguage();
  
  const [metaReuniones, setMetaReuniones] = useState(10);
  const [crConectadasLlamadas, setCrConectadasLlamadas] = useState(36.6);
  const [crConversacionesConectadas, setCrConversacionesConectadas] = useState(41.4);
  const [crReunionesConversaciones, setCrReunionesConversaciones] = useState(16.0);

  // Benchmarks basados en los datos proporcionados
  const benchmarks = {
    conectadasLlamadas: { min: 25.8, max: 50, avg: 36.6 },
    conversacionesConectadas: { min: 25, max: 52.9, avg: 41.4 },
    reunionesConversaciones: { min: 0, max: 25, avg: 16.0 },
  };

  // Cálculo inverso del embudo
  const conversacionesNecesarias = crReunionesConversaciones > 0 
    ? Math.ceil(metaReuniones / (crReunionesConversaciones / 100)) 
    : 0;
  const conectadasNecesarias = crConversacionesConectadas > 0 
    ? Math.ceil(conversacionesNecesarias / (crConversacionesConectadas / 100)) 
    : 0;
  const llamadasNecesarias = crConectadasLlamadas > 0 
    ? Math.ceil(conectadasNecesarias / (crConectadasLlamadas / 100)) 
    : 0;

  const getFunnelWidth = (value: number) => {
    if (llamadasNecesarias === 0) return "100%";
    const percentage = Math.max((value / llamadasNecesarias) * 100, 15);
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
      name: language === "es" ? "Llamadas" : "Calls",
      value: llamadasNecesarias,
      color: FUNNEL_COLORS.llamadas,
      icon: <Phone className="w-5 h-5" />,
    },
    {
      id: "conectadas",
      name: language === "es" ? "Conectadas" : "Connected",
      value: conectadasNecesarias,
      color: FUNNEL_COLORS.conectadas,
      icon: <PhoneCall className="w-5 h-5" />,
      conversionRate: crConectadasLlamadas,
    },
    {
      id: "conversaciones",
      name: language === "es" ? "Conversaciones" : "Conversations",
      value: conversacionesNecesarias,
      color: FUNNEL_COLORS.conversaciones,
      icon: <MessageSquare className="w-5 h-5" />,
      conversionRate: crConversacionesConectadas,
    },
    {
      id: "reuniones",
      name: language === "es" ? "Reuniones" : "Meetings",
      value: metaReuniones,
      color: FUNNEL_COLORS.reuniones,
      icon: <Calendar className="w-5 h-5" />,
      conversionRate: crReunionesConversaciones,
    },
  ];

  const getDiagnosis = () => {
    const issues: string[] = [];
    
    if (crConectadasLlamadas < benchmarks.conectadasLlamadas.min) {
      issues.push(language === "es" 
        ? `Tu tasa de conexión (${crConectadasLlamadas}%) está por debajo del benchmark mínimo (${benchmarks.conectadasLlamadas.min}%). Revisa la calidad de tus datos de contacto y horarios de llamada.`
        : `Your connection rate (${crConectadasLlamadas}%) is below minimum benchmark (${benchmarks.conectadasLlamadas.min}%). Review your contact data quality and call timing.`
      );
    }
    
    if (crConversacionesConectadas < benchmarks.conversacionesConectadas.min) {
      issues.push(language === "es"
        ? `Tu tasa de conversación (${crConversacionesConectadas}%) está baja. Mejora tu apertura y propuesta de valor inicial.`
        : `Your conversation rate (${crConversacionesConectadas}%) is low. Improve your opening and initial value proposition.`
      );
    }
    
    if (crReunionesConversaciones < benchmarks.reunionesConversaciones.avg) {
      issues.push(language === "es"
        ? `Tu tasa de reuniones (${crReunionesConversaciones}%) puede mejorar. Enfócate en generar interés genuino durante la conversación.`
        : `Your meeting rate (${crReunionesConversaciones}%) can improve. Focus on generating genuine interest during the conversation.`
      );
    }

    if (issues.length === 0) {
      return language === "es"
        ? `¡Excelentes métricas! Para conseguir ${metaReuniones} reuniones necesitas realizar ${llamadasNecesarias} llamadas.`
        : `Excellent metrics! To get ${metaReuniones} meetings you need to make ${llamadasNecesarias} calls.`;
    }

    return issues.join(" ");
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {language === "es" ? "Funnel de Llamadas" : "Call Funnel"}
          </h2>
          <p className="text-muted-foreground">
            {language === "es" 
              ? "Calcula cuántas llamadas necesitas para alcanzar tus metas de reuniones"
              : "Calculate how many calls you need to reach your meeting goals"
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold text-lg border-b border-border pb-2">
              {language === "es" ? "Configura tu Embudo" : "Configure Your Funnel"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="metaReuniones" className="text-sm font-medium">
                  {language === "es" ? "Meta de Reuniones" : "Meeting Goal"}
                </Label>
                <Input
                  id="metaReuniones"
                  type="number"
                  value={metaReuniones}
                  onChange={(e) => setMetaReuniones(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="crConectadas" className="text-sm font-medium">
                    {language === "es" ? "% Conectadas / Llamadas" : "% Connected / Calls"}
                  </Label>
                  {getConversionStatus(crConectadasLlamadas, benchmarks.conectadasLlamadas).icon}
                </div>
                <Input
                  id="crConectadas"
                  type="number"
                  step="0.1"
                  value={crConectadasLlamadas}
                  onChange={(e) => setCrConectadasLlamadas(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Benchmark: {benchmarks.conectadasLlamadas.min}% - {benchmarks.conectadasLlamadas.max}%
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="crConversaciones" className="text-sm font-medium">
                    {language === "es" ? "% Conversaciones / Conectadas" : "% Conversations / Connected"}
                  </Label>
                  {getConversionStatus(crConversacionesConectadas, benchmarks.conversacionesConectadas).icon}
                </div>
                <Input
                  id="crConversaciones"
                  type="number"
                  step="0.1"
                  value={crConversacionesConectadas}
                  onChange={(e) => setCrConversacionesConectadas(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Benchmark: {benchmarks.conversacionesConectadas.min}% - {benchmarks.conversacionesConectadas.max}%
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="crReuniones" className="text-sm font-medium">
                    {language === "es" ? "% Reuniones / Conversaciones" : "% Meetings / Conversations"}
                  </Label>
                  {getConversionStatus(crReunionesConversaciones, benchmarks.reunionesConversaciones).icon}
                </div>
                <Input
                  id="crReuniones"
                  type="number"
                  step="0.1"
                  value={crReunionesConversaciones}
                  onChange={(e) => setCrReunionesConversaciones(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Benchmark: {benchmarks.reunionesConversaciones.min}% - {benchmarks.reunionesConversaciones.max}%
                </p>
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
    </section>
  );
};

export default CallFunnelCalculator;
