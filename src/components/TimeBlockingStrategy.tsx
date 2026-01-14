import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFunnelMetrics } from '@/contexts/FunnelMetricsContext';
import { 
  Clock, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Phone,
  Mail,
  Users,
  Coffee,
  Target,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

interface TimeBlock {
  startTime: string;
  endTime: string;
  activity: string;
  activityEn: string;
  category: 'prospecting' | 'calls' | 'emails' | 'meetings' | 'admin' | 'break';
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  color: string;
  notes: string;
  notesEn: string;
}

const TimeBlockingStrategy: React.FC = () => {
  const { language } = useLanguage();
  const { callMetrics, emailMetrics, prospectMetrics } = useFunnelMetrics();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate conversion rates from shared metrics
  const conversionRates = useMemo(() => {
    return {
      callConnection: callMetrics.llamadasRealizadas > 0 ? (callMetrics.contestadas / callMetrics.llamadasRealizadas) * 100 : 0,
      callConversation: callMetrics.contestadas > 0 ? (callMetrics.conversaciones / callMetrics.contestadas) * 100 : 0,
      callMeeting: callMetrics.conversaciones > 0 ? (callMetrics.reuniones / callMetrics.conversaciones) * 100 : 0,
      emailOpen: emailMetrics.emailsEnviados > 0 ? (emailMetrics.emailsAbiertos / emailMetrics.emailsEnviados) * 100 : 0,
      emailReply: emailMetrics.emailsAbiertos > 0 ? (emailMetrics.emailsRespondidos / emailMetrics.emailsAbiertos) * 100 : 0,
      emailMeeting: emailMetrics.emailsRespondidos > 0 ? (emailMetrics.reuniones / emailMetrics.emailsRespondidos) * 100 : 0,
      prospectContact: prospectMetrics.prospectosGenerados > 0 ? (prospectMetrics.prospectosContactados / prospectMetrics.prospectosGenerados) * 100 : 0,
      prospectMeeting: prospectMetrics.prospectosContactados > 0 ? (prospectMetrics.reunionesGeneradas / prospectMetrics.prospectosContactados) * 100 : 0,
      showRate: prospectMetrics.reunionesGeneradas > 0 ? (prospectMetrics.reunionesRealizadas / prospectMetrics.reunionesGeneradas) * 100 : 0,
      closeRate: prospectMetrics.reunionesRealizadas > 0 ? (prospectMetrics.ventas / prospectMetrics.reunionesRealizadas) * 100 : 0,
    };
  }, [callMetrics, emailMetrics, prospectMetrics]);

  // Generate time blocking strategy based on metrics
  const timeBlocks = useMemo((): TimeBlock[] => {
    const blocks: TimeBlock[] = [];
    
    // Determine focus areas based on weak points
    const needsMoreCalls = conversionRates.callConnection < 50 || conversionRates.callMeeting < 10;
    const needsMoreEmails = conversionRates.emailOpen < 30 || conversionRates.emailReply < 10;
    const needsMoreProspecting = conversionRates.prospectContact < 20;
    const needsFollowUp = conversionRates.showRate < 70;

    // Morning block - High energy activities
    blocks.push({
      startTime: '09:00',
      endTime: '10:00',
      activity: 'Prospección y Generación de Leads',
      activityEn: 'Prospecting & Lead Generation',
      category: 'prospecting',
      priority: needsMoreProspecting ? 'high' : 'medium',
      icon: <Users className="w-4 h-4" />,
      color: 'hsl(220, 15%, 50%)',
      notes: needsMoreProspecting 
        ? 'Tu tasa de contacto está baja. Enfócate en mejorar la calidad de tu base de datos.'
        : 'Mantén tu ritmo de prospección para llenar el pipeline.',
      notesEn: needsMoreProspecting
        ? 'Your contact rate is low. Focus on improving your database quality.'
        : 'Maintain your prospecting rhythm to fill the pipeline.',
    });

    blocks.push({
      startTime: '10:00',
      endTime: '11:00',
      activity: 'Bloque de Llamadas en Frío',
      activityEn: 'Cold Calling Block',
      category: 'calls',
      priority: needsMoreCalls ? 'high' : 'medium',
      icon: <Phone className="w-4 h-4" />,
      color: 'hsl(217, 91%, 60%)',
      notes: needsMoreCalls
        ? `Tasa de conexión: ${conversionRates.callConnection.toFixed(1)}%. Prueba diferentes horarios y scripts.`
        : `Excelente! Tu tasa de conexión es ${conversionRates.callConnection.toFixed(1)}%.`,
      notesEn: needsMoreCalls
        ? `Connection rate: ${conversionRates.callConnection.toFixed(1)}%. Try different times and scripts.`
        : `Excellent! Your connection rate is ${conversionRates.callConnection.toFixed(1)}%.`,
    });

    blocks.push({
      startTime: '11:00',
      endTime: '12:00',
      activity: 'Email Outreach y Seguimiento',
      activityEn: 'Email Outreach & Follow-up',
      category: 'emails',
      priority: needsMoreEmails ? 'high' : 'medium',
      icon: <Mail className="w-4 h-4" />,
      color: 'hsl(280, 65%, 60%)',
      notes: needsMoreEmails
        ? `Tasa de apertura: ${conversionRates.emailOpen.toFixed(1)}%. Mejora tus asuntos y personalización.`
        : `Bien! Tasa de apertura: ${conversionRates.emailOpen.toFixed(1)}%.`,
      notesEn: needsMoreEmails
        ? `Open rate: ${conversionRates.emailOpen.toFixed(1)}%. Improve your subject lines and personalization.`
        : `Good! Open rate: ${conversionRates.emailOpen.toFixed(1)}%.`,
    });

    // Lunch break
    blocks.push({
      startTime: '12:00',
      endTime: '13:00',
      activity: 'Almuerzo y Descanso',
      activityEn: 'Lunch & Break',
      category: 'break',
      priority: 'low',
      icon: <Coffee className="w-4 h-4" />,
      color: 'hsl(25, 95%, 53%)',
      notes: 'Descansa para mantener tu energía alta.',
      notesEn: 'Rest to keep your energy high.',
    });

    // Afternoon - Meetings and follow-ups
    blocks.push({
      startTime: '13:00',
      endTime: '14:00',
      activity: 'Reuniones con Prospectos',
      activityEn: 'Prospect Meetings',
      category: 'meetings',
      priority: 'high',
      icon: <Calendar className="w-4 h-4" />,
      color: 'hsl(152, 69%, 31%)',
      notes: `Show rate: ${conversionRates.showRate.toFixed(1)}%. ${needsFollowUp ? 'Implementa recordatorios.' : 'Mantén tu sistema de confirmación.'}`,
      notesEn: `Show rate: ${conversionRates.showRate.toFixed(1)}%. ${needsFollowUp ? 'Implement reminders.' : 'Keep your confirmation system.'}`,
    });

    blocks.push({
      startTime: '14:00',
      endTime: '15:00',
      activity: 'Segundo Bloque de Llamadas',
      activityEn: 'Second Calling Block',
      category: 'calls',
      priority: needsMoreCalls ? 'high' : 'medium',
      icon: <Phone className="w-4 h-4" />,
      color: 'hsl(217, 91%, 60%)',
      notes: 'Horario óptimo para decisores. Aprovecha para llamadas de seguimiento.',
      notesEn: 'Optimal time for decision makers. Use for follow-up calls.',
    });

    blocks.push({
      startTime: '15:00',
      endTime: '16:00',
      activity: 'Preparación y Administración',
      activityEn: 'Preparation & Admin',
      category: 'admin',
      priority: 'medium',
      icon: <Target className="w-4 h-4" />,
      color: 'hsl(45, 100%, 51%)',
      notes: 'Actualiza CRM, prepara propuestas, investiga prospectos.',
      notesEn: 'Update CRM, prepare proposals, research prospects.',
    });

    return blocks;
  }, [conversionRates]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs: { es: string; en: string; priority: 'high' | 'medium' | 'low' }[] = [];

    if (conversionRates.callConnection < 30) {
      recs.push({
        es: '🔴 Tu tasa de conexión telefónica es muy baja. Considera verificar la calidad de tus datos de contacto y experimentar con diferentes horarios.',
        en: '🔴 Your phone connection rate is very low. Consider verifying your contact data quality and experimenting with different times.',
        priority: 'high',
      });
    }

    if (conversionRates.emailOpen < 20) {
      recs.push({
        es: '🔴 Tu tasa de apertura de emails está por debajo del benchmark. Mejora tus líneas de asunto y usa nombres personalizados.',
        en: '🔴 Your email open rate is below benchmark. Improve your subject lines and use personalized names.',
        priority: 'high',
      });
    }

    if (conversionRates.showRate < 60) {
      recs.push({
        es: '🟡 Tu show rate necesita atención. Implementa un sistema de confirmación con recordatorios 24h y 1h antes.',
        en: '🟡 Your show rate needs attention. Implement a confirmation system with 24h and 1h reminders.',
        priority: 'medium',
      });
    }

    if (conversionRates.closeRate < 10) {
      recs.push({
        es: '🔴 Tu tasa de cierre está baja. Enfócate en mejorar tu propuesta de valor y manejo de objeciones.',
        en: '🔴 Your close rate is low. Focus on improving your value proposition and objection handling.',
        priority: 'high',
      });
    }

    if (recs.length === 0) {
      recs.push({
        es: '🟢 ¡Excelente! Tus métricas están en buen estado. Mantén la consistencia en tu proceso.',
        en: '🟢 Excellent! Your metrics are in good shape. Maintain consistency in your process.',
        priority: 'low',
      });
    }

    return recs;
  }, [conversionRates]);

  // Export to Excel
  const exportToExcel = () => {
    // Prepare calculator data
    const callFunnelData = [
      { Metric: language === 'es' ? 'Llamadas Realizadas' : 'Calls Made', Value: callMetrics.llamadasRealizadas, ConversionRate: '-' },
      { Metric: language === 'es' ? 'Contestadas' : 'Answered', Value: callMetrics.contestadas, ConversionRate: `${conversionRates.callConnection.toFixed(1)}%` },
      { Metric: language === 'es' ? 'Conversaciones' : 'Conversations', Value: callMetrics.conversaciones, ConversionRate: `${conversionRates.callConversation.toFixed(1)}%` },
      { Metric: language === 'es' ? 'Reuniones' : 'Meetings', Value: callMetrics.reuniones, ConversionRate: `${conversionRates.callMeeting.toFixed(1)}%` },
    ];

    const emailFunnelData = [
      { Metric: language === 'es' ? 'Emails Enviados' : 'Emails Sent', Value: emailMetrics.emailsEnviados, ConversionRate: '-' },
      { Metric: language === 'es' ? 'Abiertos' : 'Opened', Value: emailMetrics.emailsAbiertos, ConversionRate: `${conversionRates.emailOpen.toFixed(1)}%` },
      { Metric: language === 'es' ? 'Respondidos' : 'Replied', Value: emailMetrics.emailsRespondidos, ConversionRate: `${conversionRates.emailReply.toFixed(1)}%` },
      { Metric: language === 'es' ? 'Reuniones' : 'Meetings', Value: emailMetrics.reuniones, ConversionRate: `${conversionRates.emailMeeting.toFixed(1)}%` },
    ];

    const prospectFunnelData = [
      { Metric: language === 'es' ? 'Prospectos Generados' : 'Prospects Generated', Value: prospectMetrics.prospectosGenerados, ConversionRate: '-' },
      { Metric: language === 'es' ? 'Prospectos Contactados' : 'Prospects Contacted', Value: prospectMetrics.prospectosContactados, ConversionRate: `${conversionRates.prospectContact.toFixed(1)}%` },
      { Metric: language === 'es' ? 'Reuniones Generadas' : 'Meetings Generated', Value: prospectMetrics.reunionesGeneradas, ConversionRate: `${conversionRates.prospectMeeting.toFixed(1)}%` },
      { Metric: language === 'es' ? 'Reuniones Realizadas' : 'Meetings Held', Value: prospectMetrics.reunionesRealizadas, ConversionRate: `${conversionRates.showRate.toFixed(1)}%` },
      { Metric: language === 'es' ? 'Ventas' : 'Sales', Value: prospectMetrics.ventas, ConversionRate: `${conversionRates.closeRate.toFixed(1)}%` },
    ];

    const timeBlockData = timeBlocks.map(block => ({
      [language === 'es' ? 'Hora Inicio' : 'Start Time']: block.startTime,
      [language === 'es' ? 'Hora Fin' : 'End Time']: block.endTime,
      [language === 'es' ? 'Actividad' : 'Activity']: language === 'es' ? block.activity : block.activityEn,
      [language === 'es' ? 'Prioridad' : 'Priority']: block.priority === 'high' ? (language === 'es' ? 'Alta' : 'High') : block.priority === 'medium' ? (language === 'es' ? 'Media' : 'Medium') : (language === 'es' ? 'Baja' : 'Low'),
      [language === 'es' ? 'Notas' : 'Notes']: language === 'es' ? block.notes : block.notesEn,
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.json_to_sheet(callFunnelData);
    XLSX.utils.book_append_sheet(wb, ws1, language === 'es' ? 'Funnel Llamadas' : 'Call Funnel');
    
    const ws2 = XLSX.utils.json_to_sheet(emailFunnelData);
    XLSX.utils.book_append_sheet(wb, ws2, language === 'es' ? 'Funnel Emails' : 'Email Funnel');
    
    const ws3 = XLSX.utils.json_to_sheet(prospectFunnelData);
    XLSX.utils.book_append_sheet(wb, ws3, language === 'es' ? 'Funnel Prospectos' : 'Prospect Funnel');
    
    const ws4 = XLSX.utils.json_to_sheet(timeBlockData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Time Blocking');

    // Save file
    XLSX.writeFile(wb, `sales-funnel-metrics-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'es' ? 'Estrategia de Time Blocking' : 'Time Blocking Strategy', pageWidth / 2, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${language === 'es' ? 'Fecha' : 'Date'}: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text(language === 'es' 
      ? 'Horario optimizado basado en tus métricas de ventas'
      : 'Optimized schedule based on your sales metrics', pageWidth / 2, 36, { align: 'center' });

    let yPos = 50;

    // Time blocks table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'es' ? 'Tu Horario Diario' : 'Your Daily Schedule', 14, yPos);
    yPos += 10;

    // Table header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(59, 130, 246);
    doc.rect(14, yPos, pageWidth - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(language === 'es' ? 'Hora' : 'Time', 16, yPos + 6);
    doc.text(language === 'es' ? 'Actividad' : 'Activity', 50, yPos + 6);
    doc.text(language === 'es' ? 'Prioridad' : 'Priority', 140, yPos + 6);
    yPos += 10;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    timeBlocks.forEach((block, index) => {
      const bgColor = index % 2 === 0 ? 245 : 255;
      doc.setFillColor(bgColor, bgColor, bgColor);
      doc.rect(14, yPos, pageWidth - 28, 12, 'F');
      
      doc.text(`${block.startTime} - ${block.endTime}`, 16, yPos + 8);
      doc.text(language === 'es' ? block.activity : block.activityEn, 50, yPos + 8);
      
      // Priority color
      if (block.priority === 'high') {
        doc.setTextColor(220, 38, 38);
        doc.text(language === 'es' ? 'ALTA' : 'HIGH', 140, yPos + 8);
      } else if (block.priority === 'medium') {
        doc.setTextColor(234, 179, 8);
        doc.text(language === 'es' ? 'MEDIA' : 'MEDIUM', 140, yPos + 8);
      } else {
        doc.setTextColor(34, 197, 94);
        doc.text(language === 'es' ? 'BAJA' : 'LOW', 140, yPos + 8);
      }
      doc.setTextColor(0, 0, 0);
      
      yPos += 12;
    });

    yPos += 15;

    // Recommendations
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'es' ? 'Recomendaciones Personalizadas' : 'Personalized Recommendations', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    recommendations.forEach((rec) => {
      const text = language === 'es' ? rec.es : rec.en;
      const splitText = doc.splitTextToSize(text, pageWidth - 28);
      doc.text(splitText, 14, yPos);
      yPos += splitText.length * 5 + 5;
    });

    yPos += 10;

    // Key metrics summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'es' ? 'Resumen de Métricas Clave' : 'Key Metrics Summary', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const metricsText = [
      `${language === 'es' ? 'Tasa de Conexión Telefónica' : 'Phone Connection Rate'}: ${conversionRates.callConnection.toFixed(1)}%`,
      `${language === 'es' ? 'Tasa de Apertura de Emails' : 'Email Open Rate'}: ${conversionRates.emailOpen.toFixed(1)}%`,
      `${language === 'es' ? 'Show Rate' : 'Show Rate'}: ${conversionRates.showRate.toFixed(1)}%`,
      `${language === 'es' ? 'Tasa de Cierre' : 'Close Rate'}: ${conversionRates.closeRate.toFixed(1)}%`,
    ];
    
    metricsText.forEach(text => {
      doc.text(text, 14, yPos);
      yPos += 6;
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text(language === 'es' 
      ? 'Generado por Digital Tools - Hecho con el Corazón, de vendedor a vendedor'
      : 'Generated by Digital Tools - Made with Heart, from seller to seller', 
      pageWidth / 2, 
      doc.internal.pageSize.getHeight() - 10, 
      { align: 'center' }
    );

    // Save PDF
    doc.save(`time-blocking-strategy-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Generate calendar links for time blocks
  const generateGoogleCalendarUrl = (block: TimeBlock) => {
    const today = new Date();
    const [startHour, startMin] = block.startTime.split(':').map(Number);
    const [endHour, endMin] = block.endTime.split(':').map(Number);
    
    const startDate = new Date(today);
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date(today);
    endDate.setHours(endHour, endMin, 0, 0);
    
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = encodeURIComponent(language === 'es' ? block.activity : block.activityEn);
    const details = encodeURIComponent(language === 'es' ? block.notes : block.notesEn);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
  };

  const generateOutlookUrl = (block: TimeBlock) => {
    const today = new Date();
    const [startHour, startMin] = block.startTime.split(':').map(Number);
    const [endHour, endMin] = block.endTime.split(':').map(Number);
    
    const startDate = new Date(today);
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date(today);
    endDate.setHours(endHour, endMin, 0, 0);
    
    const title = encodeURIComponent(language === 'es' ? block.activity : block.activityEn);
    const body = encodeURIComponent(language === 'es' ? block.notes : block.notesEn);
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${body}`;
  };

  const addAllToGoogleCalendar = () => {
    timeBlocks.forEach((block, index) => {
      setTimeout(() => {
        window.open(generateGoogleCalendarUrl(block), '_blank');
      }, index * 500);
    });
  };

  const texts = {
    es: {
      title: 'Estrategia de Time Blocking',
      subtitle: 'Optimiza tu tiempo basado en tus métricas de ventas',
      showCalculator: 'Mostrar Estrategia',
      hideCalculator: 'Ocultar Estrategia',
      metricsLinked: 'Métricas Sincronizadas',
      metricsLinkedDesc: 'Los datos se toman automáticamente de las calculadoras de arriba',
      callFunnel: 'Funnel de Llamadas',
      emailFunnel: 'Funnel de Emails',
      prospectFunnel: 'Funnel de Prospectos',
      yourSchedule: 'Tu Horario Optimizado',
      recommendations: 'Recomendaciones',
      exportExcel: 'Exportar a Excel',
      exportPDF: 'Exportar PDF para Calendario',
      priority: 'Prioridad',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      connectionRate: 'Tasa Conexión',
      openRate: 'Tasa Apertura',
      showRate: 'Show Rate',
      closeRate: 'Tasa Cierre',
      addToCalendar: 'Agregar a Calendario',
      googleCalendar: 'Google Calendar',
      outlook: 'Outlook',
      addAll: 'Agregar todos',
    },
    en: {
      title: 'Time Blocking Strategy',
      subtitle: 'Optimize your time based on your sales metrics',
      showCalculator: 'Show Strategy',
      hideCalculator: 'Hide Strategy',
      metricsLinked: 'Synced Metrics',
      metricsLinkedDesc: 'Data is automatically taken from the calculators above',
      callFunnel: 'Call Funnel',
      emailFunnel: 'Email Funnel',
      prospectFunnel: 'Prospect Funnel',
      yourSchedule: 'Your Optimized Schedule',
      recommendations: 'Recommendations',
      exportExcel: 'Export to Excel',
      exportPDF: 'Export PDF for Calendar',
      priority: 'Priority',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      connectionRate: 'Connection Rate',
      openRate: 'Open Rate',
      showRate: 'Show Rate',
      closeRate: 'Close Rate',
      addToCalendar: 'Add to Calendar',
      googleCalendar: 'Google Calendar',
      outlook: 'Outlook',
      addAll: 'Add all',
    },
  };

  const t = texts[language];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-effect rounded-xl p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-card/80 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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

      {/* Content */}
      {isExpanded && (
        <div className="mt-6 glass-effect rounded-xl p-4 sm:p-6 space-y-8">
          {/* Export & Calendar Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            <Button onClick={exportToExcel} variant="outline" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              {t.exportExcel}
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              {t.exportPDF}
            </Button>
            <Button 
              onClick={addAllToGoogleCalendar} 
              className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Calendar className="w-4 h-4" />
              {t.googleCalendar} ({t.addAll})
            </Button>
          </div>

          {/* Synced Metrics Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-300">{t.metricsLinked}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t.metricsLinkedDesc}</p>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-card p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-medium">{t.connectionRate}</span>
                </div>
                <span className="text-xl font-bold">{conversionRates.callConnection.toFixed(1)}%</span>
              </div>
              <div className="bg-card p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-medium">{t.openRate}</span>
                </div>
                <span className="text-xl font-bold">{conversionRates.emailOpen.toFixed(1)}%</span>
              </div>
              <div className="bg-card p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">{t.showRate}</span>
                </div>
                <span className="text-xl font-bold">{conversionRates.showRate.toFixed(1)}%</span>
              </div>
              <div className="bg-card p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-medium">{t.closeRate}</span>
                </div>
                <span className="text-xl font-bold">{conversionRates.closeRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Time Blocks Schedule */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t.yourSchedule}
            </h3>
            
            <div className="grid gap-3">
              {timeBlocks.map((block, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: block.color }}
                  >
                    {block.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">
                        {block.startTime} - {block.endTime}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(block.priority)}`}>
                        {block.priority === 'high' ? t.high : block.priority === 'medium' ? t.medium : t.low}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">
                      {language === 'es' ? block.activity : block.activityEn}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {language === 'es' ? block.notes : block.notesEn}
                    </p>
                  </div>
                  {/* Calendar buttons for each block */}
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={generateGoogleCalendarUrl(block)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors"
                      title="Google Calendar"
                    >
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </a>
                    <a
                      href={generateOutlookUrl(block)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50 transition-colors"
                      title="Outlook"
                    >
                      <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {t.recommendations}
            </h3>
            
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border ${
                    rec.priority === 'high' 
                      ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800' 
                      : rec.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800'
                      : 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                  }`}
                >
                  <p className="text-sm">
                    {language === 'es' ? rec.es : rec.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeBlockingStrategy;
