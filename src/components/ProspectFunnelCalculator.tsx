import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Phone, Calendar, CheckCircle2, Target, Info, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FUNNEL_COLORS = {
  prospectosGenerados: 'hsl(220, 15%, 50%)',
  prospectosContactados: 'hsl(217, 91%, 60%)',
  reunionesGeneradas: 'hsl(45, 100%, 51%)',
  reunionesRealizadas: 'hsl(25, 95%, 53%)',
  ventas: 'hsl(152, 69%, 31%)',
};

const benchmarks = {
  contactoRate: { min: 15, max: 30, avg: 20 },
  reunionGeneradaRate: { min: 40, max: 60, avg: 50 },
  showRate: { min: 60, max: 80, avg: 70 },
  cierreRate: { min: 10, max: 20, avg: 14 },
};

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  conversionRate?: number;
}

const ProspectFunnelCalculator: React.FC = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Datos reales del usuario (basado en el Excel)
  const [prospectosGenerados, setProspectosGenerados] = useState(500);
  const [prospectosContactados, setProspectosContactados] = useState(100);
  const [reunionesGeneradas, setReunionesGeneradas] = useState(50);
  const [reunionesRealizadas, setReunionesRealizadas] = useState(35);
  const [ventas, setVentas] = useState(5);
  const [ticketPromedio, setTicketPromedio] = useState(15000);

  // Cálculo de tasas de conversión
  const tasas = useMemo(() => {
    const tasaContacto = prospectosGenerados > 0 ? (prospectosContactados / prospectosGenerados) * 100 : 0;
    const tasaReunionGenerada = prospectosContactados > 0 ? (reunionesGeneradas / prospectosContactados) * 100 : 0;
    const showRate = reunionesGeneradas > 0 ? (reunionesRealizadas / reunionesGeneradas) * 100 : 0;
    const tasaCierre = reunionesRealizadas > 0 ? (ventas / reunionesRealizadas) * 100 : 0;
    const tasaLeadAReunion = prospectosContactados > 0 ? (reunionesGeneradas / prospectosContactados) * 100 : 0;
    const conversionTotal = prospectosGenerados > 0 ? (ventas / prospectosGenerados) * 100 : 0;
    const ingresos = ventas * ticketPromedio;

    return {
      contacto: tasaContacto,
      reunionGenerada: tasaReunionGenerada,
      showRate,
      cierre: tasaCierre,
      leadAReunion: tasaLeadAReunion,
      total: conversionTotal,
      ingresos,
    };
  }, [prospectosGenerados, prospectosContactados, reunionesGeneradas, reunionesRealizadas, ventas, ticketPromedio]);

  const getConversionStatus = (value: number, benchmark: { min: number; max: number; avg: number }) => {
    if (value >= benchmark.avg) return { icon: <TrendingUp className="w-4 h-4 text-green-500" />, status: "good" };
    if (value >= benchmark.min) return { icon: <Minus className="w-4 h-4 text-yellow-500" />, status: "average" };
    return { icon: <TrendingDown className="w-4 h-4 text-red-500" />, status: "low" };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getFunnelWidth = (value: number) => {
    if (prospectosGenerados === 0) return '100%';
    const percentage = Math.max((value / prospectosGenerados) * 100, 12);
    return `${Math.min(percentage, 100)}%`;
  };

  const getLowConversionWarnings = () => {
    const warnings: string[] = [];
    
    if (tasas.contacto < benchmarks.contactoRate.min) {
      warnings.push(language === 'es' 
        ? `Tasa de contacto (${tasas.contacto.toFixed(1)}%) por debajo del benchmark (${benchmarks.contactoRate.min}%). Mejora la calidad de tu base de datos.`
        : `Contact rate (${tasas.contacto.toFixed(1)}%) below benchmark (${benchmarks.contactoRate.min}%). Improve your database quality.`);
    }
    
    if (tasas.reunionGenerada < benchmarks.reunionGeneradaRate.min) {
      warnings.push(language === 'es'
        ? `Tasa de reunión generada (${tasas.reunionGenerada.toFixed(1)}%) por debajo del benchmark (${benchmarks.reunionGeneradaRate.min}%). Mejora tu pitch de prospección.`
        : `Meeting generation rate (${tasas.reunionGenerada.toFixed(1)}%) below benchmark (${benchmarks.reunionGeneradaRate.min}%). Improve your prospecting pitch.`);
    }
    
    if (tasas.showRate < benchmarks.showRate.min) {
      warnings.push(language === 'es'
        ? `Show Rate (${tasas.showRate.toFixed(1)}%) por debajo del benchmark (${benchmarks.showRate.min}%). Implementa recordatorios y confirmaciones.`
        : `Show Rate (${tasas.showRate.toFixed(1)}%) below benchmark (${benchmarks.showRate.min}%). Implement reminders and confirmations.`);
    }
    
    if (tasas.cierre < benchmarks.cierreRate.min) {
      warnings.push(language === 'es'
        ? `Tasa de cierre (${tasas.cierre.toFixed(1)}%) por debajo del benchmark (${benchmarks.cierreRate.min}%). Enfócate en mejorar tu propuesta de valor.`
        : `Close rate (${tasas.cierre.toFixed(1)}%) below benchmark (${benchmarks.cierreRate.min}%). Focus on improving your value proposition.`);
    }
    
    return warnings;
  };

  const funnelStages: FunnelStage[] = [
    {
      id: 'prospectosGenerados',
      name: language === 'es' ? 'Prospectos Generados' : 'Prospects Generated',
      value: prospectosGenerados,
      color: FUNNEL_COLORS.prospectosGenerados,
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'prospectosContactados',
      name: language === 'es' ? 'Prospectos Contactados' : 'Prospects Contacted',
      value: prospectosContactados,
      color: FUNNEL_COLORS.prospectosContactados,
      icon: <Phone className="w-5 h-5" />,
      conversionRate: tasas.contacto,
    },
    {
      id: 'reunionesGeneradas',
      name: language === 'es' ? 'Reuniones Generadas' : 'Meetings Generated',
      value: reunionesGeneradas,
      color: FUNNEL_COLORS.reunionesGeneradas,
      icon: <Calendar className="w-5 h-5" />,
      conversionRate: tasas.reunionGenerada,
    },
    {
      id: 'reunionesRealizadas',
      name: language === 'es' ? 'Reuniones Realizadas' : 'Meetings Held',
      value: reunionesRealizadas,
      color: FUNNEL_COLORS.reunionesRealizadas,
      icon: <CheckCircle2 className="w-5 h-5" />,
      conversionRate: tasas.showRate,
    },
    {
      id: 'ventas',
      name: language === 'es' ? 'Ventas' : 'Sales',
      value: ventas,
      color: FUNNEL_COLORS.ventas,
      icon: <Target className="w-5 h-5" />,
      conversionRate: tasas.cierre,
    },
  ];

  const texts = {
    es: {
      title: 'Funnel de Prospectos',
      subtitle: 'Ingresa tus datos reales y mide tus tasas de conversión',
      showCalculator: 'Mostrar Calculadora',
      hideCalculator: 'Ocultar Calculadora',
      tusDatos: 'Tus Datos',
      prospectosGenerados: '# Prospectos Generados',
      prospectosContactados: '# Prospectos Contactados',
      reunionesGeneradas: '# Reuniones Generadas/Lead',
      reunionesRealizadas: '# Reuniones Realizadas',
      ventas: '# Ventas',
      ticketPromedio: 'Ticket Promedio ($)',
      tasaConversion: 'Tasa Conversión',
      showRate: '% Show Rate',
      leadAReunion: '% Lead a Reunión',
      conversionTotal: 'Conversión Total',
      ingresosProyectados: 'Ingresos Proyectados',
      diagnóstico: 'Diagnóstico',
      embudoSaludable: '¡Excelente! Tu embudo de prospectos está saludable.',
      consejos: 'Consejos para mejorar tu funnel de prospectos',
    },
    en: {
      title: 'Prospect Funnel',
      subtitle: 'Enter your real data and measure your conversion rates',
      showCalculator: 'Show Calculator',
      hideCalculator: 'Hide Calculator',
      tusDatos: 'Your Data',
      prospectosGenerados: '# Prospects Generated',
      prospectosContactados: '# Prospects Contacted',
      reunionesGeneradas: '# Meetings Generated/Lead',
      reunionesRealizadas: '# Meetings Held',
      ventas: '# Sales',
      ticketPromedio: 'Average Ticket ($)',
      tasaConversion: 'Conversion Rate',
      showRate: '% Show Rate',
      leadAReunion: '% Lead to Meeting',
      conversionTotal: 'Total Conversion',
      ingresosProyectados: 'Projected Revenue',
      diagnóstico: 'Diagnosis',
      embudoSaludable: 'Excellent! Your prospect funnel is healthy.',
      consejos: 'Tips to improve your prospect funnel',
    },
  };

  const t = texts[language];
  const warnings = getLowConversionWarnings();

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full glass-effect rounded-xl p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-card/80 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs - Formulario de datos */}
              <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="font-semibold text-lg border-b border-border pb-2">
                  {t.tusDatos}
                </h3>
                
                <div className="space-y-4">
                  {/* Prospectos Generados */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prospectosGenerados" className="text-sm font-medium">
                        {t.prospectosGenerados}
                      </Label>
                      <Input
                        id="prospectosGenerados"
                        type="number"
                        min="0"
                        value={prospectosGenerados}
                        onChange={(e) => setProspectosGenerados(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <span className="text-muted-foreground text-sm pb-2">—</span>
                    </div>
                  </div>

                  {/* Prospectos Contactados */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prospectosContactados" className="text-sm font-medium">
                        {t.prospectosContactados}
                      </Label>
                      <Input
                        id="prospectosContactados"
                        type="number"
                        min="0"
                        value={prospectosContactados}
                        onChange={(e) => setProspectosContactados(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      {getConversionStatus(tasas.contacto, benchmarks.contactoRate).icon}
                      <span className="font-semibold text-lg">{tasas.contacto.toFixed(1)}%</span>
                      <span className="text-xs text-muted-foreground">
                        ({benchmarks.contactoRate.min}-{benchmarks.contactoRate.max}%)
                      </span>
                    </div>
                  </div>

                  {/* Reuniones Generadas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reunionesGeneradas" className="text-sm font-medium">
                        {t.reunionesGeneradas}
                      </Label>
                      <Input
                        id="reunionesGeneradas"
                        type="number"
                        min="0"
                        value={reunionesGeneradas}
                        onChange={(e) => setReunionesGeneradas(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      {getConversionStatus(tasas.reunionGenerada, benchmarks.reunionGeneradaRate).icon}
                      <span className="font-semibold text-lg">{tasas.reunionGenerada.toFixed(1)}%</span>
                      <span className="text-xs text-muted-foreground">
                        ({benchmarks.reunionGeneradaRate.min}-{benchmarks.reunionGeneradaRate.max}%)
                      </span>
                    </div>
                  </div>

                  {/* Reuniones Realizadas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reunionesRealizadas" className="text-sm font-medium">
                        {t.reunionesRealizadas}
                      </Label>
                      <Input
                        id="reunionesRealizadas"
                        type="number"
                        min="0"
                        value={reunionesRealizadas}
                        onChange={(e) => setReunionesRealizadas(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      {getConversionStatus(tasas.showRate, benchmarks.showRate).icon}
                      <span className="font-semibold text-lg">{tasas.showRate.toFixed(1)}%</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-xs text-muted-foreground">
                            ({t.showRate})
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{benchmarks.showRate.min}-{benchmarks.showRate.max}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Ventas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ventas" className="text-sm font-medium">
                        {t.ventas}
                      </Label>
                      <Input
                        id="ventas"
                        type="number"
                        min="0"
                        value={ventas}
                        onChange={(e) => setVentas(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      {getConversionStatus(tasas.cierre, benchmarks.cierreRate).icon}
                      <span className="font-semibold text-lg">{tasas.cierre.toFixed(1)}%</span>
                      <span className="text-xs text-muted-foreground">
                        ({benchmarks.cierreRate.min}-{benchmarks.cierreRate.max}%)
                      </span>
                    </div>
                  </div>

                  {/* Ticket Promedio */}
                  <div className="pt-4 border-t border-border">
                    <Label htmlFor="ticketPromedio" className="text-sm font-medium">
                      {t.ticketPromedio}
                    </Label>
                    <Input
                      id="ticketPromedio"
                      type="number"
                      min="0"
                      value={ticketPromedio}
                      onChange={(e) => setTicketPromedio(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  {/* Resumen */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t.leadAReunion}</span>
                      <span className="font-semibold">{tasas.leadAReunion.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t.conversionTotal}</span>
                      <span className="text-2xl font-bold text-primary">{tasas.total.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t.ingresosProyectados}</span>
                      <span className="text-xl font-bold text-emerald-600">{formatCurrency(tasas.ingresos)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funnel Visualization */}
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">
                    {language === 'es' ? 'Visualización del Embudo' : 'Funnel Visualization'}
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
                            <span className="font-medium text-sm truncate">{stage.name}</span>
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
                <div className={`p-4 rounded-xl border ${warnings.length > 0 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'}`}>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    {warnings.length > 0 ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    )}
                    {t.diagnóstico}
                  </h4>
                  {warnings.length > 0 ? (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t.embudoSaludable}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Accordion */}
            <div className="mt-8">
              <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
                <AccordionItem value="tips" className="border-none">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <span className="font-semibold">{t.consejos}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" style={{ color: FUNNEL_COLORS.prospectosContactados }} />
                          {language === 'es' ? 'Mejorar Contacto' : 'Improve Contact'}
                        </h5>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• {language === 'es' ? 'Valida tu base de datos' : 'Validate your database'}</li>
                          <li>• {language === 'es' ? 'Usa múltiples canales' : 'Use multiple channels'}</li>
                          <li>• {language === 'es' ? 'Define horarios óptimos' : 'Define optimal timing'}</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: FUNNEL_COLORS.reunionesGeneradas }} />
                          {language === 'es' ? 'Generar Reuniones' : 'Generate Meetings'}
                        </h5>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• {language === 'es' ? 'Pitch de valor claro' : 'Clear value pitch'}</li>
                          <li>• {language === 'es' ? 'Personaliza el mensaje' : 'Personalize the message'}</li>
                          <li>• {language === 'es' ? 'Ofrece valor inmediato' : 'Offer immediate value'}</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" style={{ color: FUNNEL_COLORS.reunionesRealizadas }} />
                          {language === 'es' ? 'Mejorar Show Rate' : 'Improve Show Rate'}
                        </h5>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• {language === 'es' ? 'Envía recordatorios' : 'Send reminders'}</li>
                          <li>• {language === 'es' ? 'Confirma por múltiples canales' : 'Confirm via multiple channels'}</li>
                          <li>• {language === 'es' ? 'Propuesta de valor clara' : 'Clear value proposition'}</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" style={{ color: FUNNEL_COLORS.ventas }} />
                          {language === 'es' ? 'Cerrar Ventas' : 'Close Sales'}
                        </h5>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• {language === 'es' ? 'Califica antes de la reunión' : 'Qualify before meeting'}</li>
                          <li>• {language === 'es' ? 'Demo personalizada' : 'Personalized demo'}</li>
                          <li>• {language === 'es' ? 'Define próximos pasos' : 'Define next steps'}</li>
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
    </TooltipProvider>
  );
};

export default ProspectFunnelCalculator;
