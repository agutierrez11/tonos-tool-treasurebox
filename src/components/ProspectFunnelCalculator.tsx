import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Phone, Calendar, CheckCircle2, Target, Info, ChevronDown, ChevronUp, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalculatorInputs {
  metaVentas: number;
  ticketPromedio: number;
  contactoRate: number;
  reunionGeneradaRate: number;
  showRate: number;
  cierreRate: number;
}

interface CalculatorResults {
  ventas: number;
  reunionesRealizadas: number;
  reunionesGeneradas: number;
  prospectosContactados: number;
  prospectosGenerados: number;
  ingresos: number;
}

const FUNNEL_COLORS = {
  prospectosGenerados: 'bg-slate-500',
  prospectosContactados: 'bg-blue-500',
  reunionesGeneradas: 'bg-amber-500',
  reunionesRealizadas: 'bg-orange-500',
  ventas: 'bg-emerald-500',
};

const benchmarks = {
  contactoRate: { min: 15, max: 30, avg: 20 },
  reunionGeneradaRate: { min: 40, max: 60, avg: 50 },
  showRate: { min: 60, max: 80, avg: 70 },
  cierreRate: { min: 10, max: 20, avg: 14 },
};

const ProspectFunnelCalculator: React.FC = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    metaVentas: 5,
    ticketPromedio: 15000,
    contactoRate: 20,
    reunionGeneradaRate: 50,
    showRate: 70,
    cierreRate: 14,
  });

  const [results, setResults] = useState<CalculatorResults>({
    ventas: 0,
    reunionesRealizadas: 0,
    reunionesGeneradas: 0,
    prospectosContactados: 0,
    prospectosGenerados: 0,
    ingresos: 0,
  });

  const calculate = () => {
    const { metaVentas, ticketPromedio, contactoRate, reunionGeneradaRate, showRate, cierreRate } = inputs;

    if (contactoRate <= 0 || reunionGeneradaRate <= 0 || showRate <= 0 || cierreRate <= 0) {
      return;
    }

    // Cálculo inverso desde ventas
    const ventas = metaVentas;
    const reunionesRealizadas = Math.ceil(ventas / (cierreRate / 100));
    const reunionesGeneradas = Math.ceil(reunionesRealizadas / (showRate / 100));
    const prospectosContactados = Math.ceil(reunionesGeneradas / (reunionGeneradaRate / 100));
    const prospectosGenerados = Math.ceil(prospectosContactados / (contactoRate / 100));
    const ingresos = ventas * ticketPromedio;

    setResults({
      ventas,
      reunionesRealizadas,
      reunionesGeneradas,
      prospectosContactados,
      prospectosGenerados,
      ingresos,
    });
  };

  useEffect(() => {
    calculate();
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const getBenchmarkStatus = (value: number, benchmark: { min: number; max: number; avg: number }) => {
    if (value < benchmark.min) return 'low';
    if (value > benchmark.max) return 'high';
    return 'normal';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getFunnelWidth = (value: number, maxValue: number) => {
    if (maxValue === 0) return '100%';
    const percentage = Math.max((value / maxValue) * 100, 15);
    return `${Math.min(percentage, 100)}%`;
  };

  const getConversionRateBetweenStages = (current: number, previous: number) => {
    if (previous === 0) return '0%';
    return `${((current / previous) * 100).toFixed(1)}%`;
  };

  const getLowConversionWarnings = () => {
    const warnings: string[] = [];
    
    if (inputs.contactoRate < benchmarks.contactoRate.min) {
      warnings.push(language === 'es' 
        ? `Tasa de contacto (${inputs.contactoRate}%) por debajo del benchmark (${benchmarks.contactoRate.min}%). Mejora la calidad de tu base de datos.`
        : `Contact rate (${inputs.contactoRate}%) below benchmark (${benchmarks.contactoRate.min}%). Improve your database quality.`);
    }
    
    if (inputs.reunionGeneradaRate < benchmarks.reunionGeneradaRate.min) {
      warnings.push(language === 'es'
        ? `Tasa de reunión generada (${inputs.reunionGeneradaRate}%) por debajo del benchmark (${benchmarks.reunionGeneradaRate.min}%). Mejora tu pitch de prospección.`
        : `Meeting generation rate (${inputs.reunionGeneradaRate}%) below benchmark (${benchmarks.reunionGeneradaRate.min}%). Improve your prospecting pitch.`);
    }
    
    if (inputs.showRate < benchmarks.showRate.min) {
      warnings.push(language === 'es'
        ? `Show Rate (${inputs.showRate}%) por debajo del benchmark (${benchmarks.showRate.min}%). Implementa recordatorios y confirmaciones.`
        : `Show Rate (${inputs.showRate}%) below benchmark (${benchmarks.showRate.min}%). Implement reminders and confirmations.`);
    }
    
    if (inputs.cierreRate < benchmarks.cierreRate.min) {
      warnings.push(language === 'es'
        ? `Tasa de cierre (${inputs.cierreRate}%) por debajo del benchmark (${benchmarks.cierreRate.min}%). Enfócate en mejorar tu propuesta de valor.`
        : `Close rate (${inputs.cierreRate}%) below benchmark (${benchmarks.cierreRate.min}%). Focus on improving your value proposition.`);
    }
    
    return warnings;
  };

  const texts = {
    es: {
      title: 'Funnel de Prospectos',
      subtitle: 'Calcula los prospectos necesarios para alcanzar tu meta de ventas',
      showCalculator: 'Mostrar Calculadora',
      hideCalculator: 'Ocultar Calculadora',
      metaVentas: 'Meta de Ventas',
      ticketPromedio: 'Ticket Promedio ($)',
      contactoRate: '% Prospectos Contactados',
      reunionGeneradaRate: '% Reuniones Generadas',
      showRate: '% Show Rate',
      cierreRate: '% Tasa de Cierre',
      prospectosGenerados: 'Prospectos Generados',
      prospectosContactados: 'Prospectos Contactados',
      reunionesGeneradas: 'Reuniones Generadas',
      reunionesRealizadas: 'Reuniones Realizadas',
      ventas: 'Ventas',
      projectedRevenue: 'Ingresos Proyectados',
      totalConversion: 'Conversión Total',
      healthyFunnel: '¡Excelente! Tu embudo de prospectos está saludable.',
      optimizationTips: 'Oportunidades de Optimización',
      benchmark: 'Benchmark',
      howToMeasure: '¿Cómo medir cada etapa?',
      kpiSection: 'KPIs Relevantes',
    },
    en: {
      title: 'Prospect Funnel',
      subtitle: 'Calculate the prospects needed to reach your sales goal',
      showCalculator: 'Show Calculator',
      hideCalculator: 'Hide Calculator',
      metaVentas: 'Sales Goal',
      ticketPromedio: 'Average Ticket ($)',
      contactoRate: '% Prospects Contacted',
      reunionGeneradaRate: '% Meetings Generated',
      showRate: '% Show Rate',
      cierreRate: '% Close Rate',
      prospectosGenerados: 'Prospects Generated',
      prospectosContactados: 'Prospects Contacted',
      reunionesGeneradas: 'Meetings Generated',
      reunionesRealizadas: 'Meetings Held',
      ventas: 'Sales',
      projectedRevenue: 'Projected Revenue',
      totalConversion: 'Total Conversion',
      healthyFunnel: 'Excellent! Your prospect funnel is healthy.',
      optimizationTips: 'Optimization Opportunities',
      benchmark: 'Benchmark',
      howToMeasure: 'How to measure each stage?',
      kpiSection: 'Relevant KPIs',
    },
  };

  const t = texts[language];
  const warnings = getLowConversionWarnings();

  const kpiSection = [
    {
      title: language === 'es' ? 'Prospectos Generados' : 'Prospects Generated',
      description: language === 'es' 
        ? 'Total de prospectos identificados en tu base de datos o campaña de generación de leads.'
        : 'Total prospects identified in your database or lead generation campaign.',
    },
    {
      title: language === 'es' ? 'Tasa de Contacto' : 'Contact Rate',
      description: language === 'es'
        ? 'Porcentaje de prospectos que efectivamente contactas. Depende de la calidad de datos y persistencia.'
        : 'Percentage of prospects you effectively contact. Depends on data quality and persistence.',
    },
    {
      title: language === 'es' ? 'Reuniones Generadas' : 'Meetings Generated',
      description: language === 'es'
        ? 'Prospectos contactados que aceptan una reunión. Mide la efectividad de tu pitch inicial.'
        : 'Contacted prospects who accept a meeting. Measures your initial pitch effectiveness.',
    },
    {
      title: language === 'es' ? 'Show Rate' : 'Show Rate',
      description: language === 'es'
        ? 'Porcentaje de reuniones agendadas que realmente se realizan. Los recordatorios mejoran esta métrica.'
        : 'Percentage of scheduled meetings that actually happen. Reminders improve this metric.',
    },
  ];

  const howToItems = [
    {
      question: language === 'es' ? '¿Cómo mejorar la tasa de contacto?' : 'How to improve contact rate?',
      answer: language === 'es'
        ? 'Valida y enriquece tu base de datos, utiliza múltiples canales de contacto (llamada, email, LinkedIn), y define horarios óptimos de contacto según tu ICP.'
        : 'Validate and enrich your database, use multiple contact channels (call, email, LinkedIn), and define optimal contact times based on your ICP.',
    },
    {
      question: language === 'es' ? '¿Cómo generar más reuniones?' : 'How to generate more meetings?',
      answer: language === 'es'
        ? 'Desarrolla un pitch de valor claro en 30 segundos, personaliza tu mensaje según el prospecto, y ofrece valor inmediato en la primera interacción.'
        : 'Develop a clear 30-second value pitch, personalize your message per prospect, and offer immediate value in the first interaction.',
    },
    {
      question: language === 'es' ? '¿Cómo mejorar el Show Rate?' : 'How to improve Show Rate?',
      answer: language === 'es'
        ? 'Envía recordatorios 24h y 1h antes, confirma la reunión por múltiples canales, y asegúrate de que la propuesta de valor sea clara para el prospecto.'
        : 'Send reminders 24h and 1h before, confirm the meeting via multiple channels, and ensure the value proposition is clear to the prospect.',
    },
    {
      question: language === 'es' ? '¿Cómo aumentar la tasa de cierre?' : 'How to increase close rate?',
      answer: language === 'es'
        ? 'Califica rigurosamente antes de la reunión, prepara una demo personalizada, maneja objeciones con casos de éxito, y define claramente los próximos pasos.'
        : 'Qualify rigorously before the meeting, prepare a personalized demo, handle objections with success cases, and clearly define next steps.',
    },
  ];

  return (
    <TooltipProvider>
      <Card className="w-full bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">{t.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  {t.hideCalculator} <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  {t.showCalculator} <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-6">
            {/* Inputs Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaVentas" className="flex items-center gap-2">
                  {t.metaVentas}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{language === 'es' ? 'Número de ventas que deseas cerrar' : 'Number of sales you want to close'}</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="metaVentas"
                  type="number"
                  value={inputs.metaVentas}
                  onChange={(e) => handleInputChange('metaVentas', e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketPromedio">{t.ticketPromedio}</Label>
                <Input
                  id="ticketPromedio"
                  type="number"
                  value={inputs.ticketPromedio}
                  onChange={(e) => handleInputChange('ticketPromedio', e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactoRate" className="flex items-center gap-2">
                  {t.contactoRate}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    getBenchmarkStatus(inputs.contactoRate, benchmarks.contactoRate) === 'low' 
                      ? 'bg-red-500/20 text-red-400' 
                      : getBenchmarkStatus(inputs.contactoRate, benchmarks.contactoRate) === 'high'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {t.benchmark}: {benchmarks.contactoRate.min}-{benchmarks.contactoRate.max}%
                  </span>
                </Label>
                <Input
                  id="contactoRate"
                  type="number"
                  value={inputs.contactoRate}
                  onChange={(e) => handleInputChange('contactoRate', e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reunionGeneradaRate" className="flex items-center gap-2">
                  {t.reunionGeneradaRate}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    getBenchmarkStatus(inputs.reunionGeneradaRate, benchmarks.reunionGeneradaRate) === 'low' 
                      ? 'bg-red-500/20 text-red-400' 
                      : getBenchmarkStatus(inputs.reunionGeneradaRate, benchmarks.reunionGeneradaRate) === 'high'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {t.benchmark}: {benchmarks.reunionGeneradaRate.min}-{benchmarks.reunionGeneradaRate.max}%
                  </span>
                </Label>
                <Input
                  id="reunionGeneradaRate"
                  type="number"
                  value={inputs.reunionGeneradaRate}
                  onChange={(e) => handleInputChange('reunionGeneradaRate', e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="showRate" className="flex items-center gap-2">
                  {t.showRate}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    getBenchmarkStatus(inputs.showRate, benchmarks.showRate) === 'low' 
                      ? 'bg-red-500/20 text-red-400' 
                      : getBenchmarkStatus(inputs.showRate, benchmarks.showRate) === 'high'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {t.benchmark}: {benchmarks.showRate.min}-{benchmarks.showRate.max}%
                  </span>
                </Label>
                <Input
                  id="showRate"
                  type="number"
                  value={inputs.showRate}
                  onChange={(e) => handleInputChange('showRate', e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cierreRate" className="flex items-center gap-2">
                  {t.cierreRate}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    getBenchmarkStatus(inputs.cierreRate, benchmarks.cierreRate) === 'low' 
                      ? 'bg-red-500/20 text-red-400' 
                      : getBenchmarkStatus(inputs.cierreRate, benchmarks.cierreRate) === 'high'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {t.benchmark}: {benchmarks.cierreRate.min}-{benchmarks.cierreRate.max}%
                  </span>
                </Label>
                <Input
                  id="cierreRate"
                  type="number"
                  value={inputs.cierreRate}
                  onChange={(e) => handleInputChange('cierreRate', e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card className="bg-slate-500/20 border-slate-500/30">
                <CardContent className="p-3 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-slate-400" />
                  <p className="text-xs text-muted-foreground">{t.prospectosGenerados}</p>
                  <p className="text-xl font-bold text-foreground">{results.prospectosGenerados}</p>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/20 border-blue-500/30">
                <CardContent className="p-3 text-center">
                  <Phone className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                  <p className="text-xs text-muted-foreground">{t.prospectosContactados}</p>
                  <p className="text-xl font-bold text-foreground">{results.prospectosContactados}</p>
                </CardContent>
              </Card>

              <Card className="bg-amber-500/20 border-amber-500/30">
                <CardContent className="p-3 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                  <p className="text-xs text-muted-foreground">{t.reunionesGeneradas}</p>
                  <p className="text-xl font-bold text-foreground">{results.reunionesGeneradas}</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-500/20 border-orange-500/30">
                <CardContent className="p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-orange-400" />
                  <p className="text-xs text-muted-foreground">{t.reunionesRealizadas}</p>
                  <p className="text-xl font-bold text-foreground">{results.reunionesRealizadas}</p>
                </CardContent>
              </Card>

              <Card className="bg-emerald-500/20 border-emerald-500/30">
                <CardContent className="p-3 text-center">
                  <Target className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                  <p className="text-xs text-muted-foreground">{t.ventas}</p>
                  <p className="text-xl font-bold text-foreground">{results.ventas}</p>
                </CardContent>
              </Card>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground mb-4">
                {language === 'es' ? 'Visualización del Embudo' : 'Funnel Visualization'}
              </h3>
              
              <div className="space-y-2">
                {/* Prospectos Generados */}
                <div 
                  className={`${FUNNEL_COLORS.prospectosGenerados} rounded-md p-3 mx-auto transition-all duration-500 flex justify-between items-center text-white`}
                  style={{ width: '100%' }}
                >
                  <span className="text-sm font-medium">{t.prospectosGenerados}</span>
                  <span className="text-lg font-bold">{results.prospectosGenerados}</span>
                </div>

                {/* Prospectos Contactados */}
                <div 
                  className={`${FUNNEL_COLORS.prospectosContactados} rounded-md p-3 mx-auto transition-all duration-500 flex justify-between items-center text-white`}
                  style={{ width: getFunnelWidth(results.prospectosContactados, results.prospectosGenerados) }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.prospectosContactados}</span>
                    <span className="text-xs opacity-80">
                      ({getConversionRateBetweenStages(results.prospectosContactados, results.prospectosGenerados)})
                    </span>
                  </div>
                  <span className="text-lg font-bold">{results.prospectosContactados}</span>
                </div>

                {/* Reuniones Generadas */}
                <div 
                  className={`${FUNNEL_COLORS.reunionesGeneradas} rounded-md p-3 mx-auto transition-all duration-500 flex justify-between items-center text-white`}
                  style={{ width: getFunnelWidth(results.reunionesGeneradas, results.prospectosGenerados) }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.reunionesGeneradas}</span>
                    <span className="text-xs opacity-80">
                      ({getConversionRateBetweenStages(results.reunionesGeneradas, results.prospectosContactados)})
                    </span>
                  </div>
                  <span className="text-lg font-bold">{results.reunionesGeneradas}</span>
                </div>

                {/* Reuniones Realizadas */}
                <div 
                  className={`${FUNNEL_COLORS.reunionesRealizadas} rounded-md p-3 mx-auto transition-all duration-500 flex justify-between items-center text-white`}
                  style={{ width: getFunnelWidth(results.reunionesRealizadas, results.prospectosGenerados) }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.reunionesRealizadas}</span>
                    <span className="text-xs opacity-80">
                      ({getConversionRateBetweenStages(results.reunionesRealizadas, results.reunionesGeneradas)})
                    </span>
                  </div>
                  <span className="text-lg font-bold">{results.reunionesRealizadas}</span>
                </div>

                {/* Ventas */}
                <div 
                  className={`${FUNNEL_COLORS.ventas} rounded-md p-3 mx-auto transition-all duration-500 flex justify-between items-center text-white`}
                  style={{ width: getFunnelWidth(results.ventas, results.prospectosGenerados) }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.ventas}</span>
                    <span className="text-xs opacity-80">
                      ({getConversionRateBetweenStages(results.ventas, results.reunionesRealizadas)})
                    </span>
                  </div>
                  <span className="text-lg font-bold">{results.ventas}</span>
                </div>
              </div>
            </div>

            {/* Projection & Diagnosis */}
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.projectedRevenue}</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(results.ingresos)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t.totalConversion}</p>
                    <p className="text-xl font-bold text-foreground">
                      {results.prospectosGenerados > 0 
                        ? ((results.ventas / results.prospectosGenerados) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>

                {warnings.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{t.healthyFunnel}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">{t.optimizationTips}</span>
                    </div>
                    <ul className="space-y-1">
                      {warnings.map((warning, index) => (
                        <li key={index} className="text-xs text-muted-foreground pl-6">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KPIs & How-to Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-background/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t.kpiSection}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {kpiSection.map((kpi, index) => (
                    <div key={index} className="border-l-2 border-primary/50 pl-3">
                      <p className="text-sm font-medium text-foreground">{kpi.title}</p>
                      <p className="text-xs text-muted-foreground">{kpi.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-background/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t.howToMeasure}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {howToItems.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                        <AccordionTrigger className="text-xs py-2 hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default ProspectFunnelCalculator;
