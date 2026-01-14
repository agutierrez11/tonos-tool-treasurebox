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

  // Get category colors for calendar view
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prospecting': return { bg: '#f97316', text: '#ffffff' }; // Orange
      case 'calls': return { bg: '#f97316', text: '#ffffff' }; // Orange
      case 'emails': return { bg: '#eab308', text: '#000000' }; // Yellow
      case 'meetings': return { bg: '#f97316', text: '#ffffff' }; // Orange
      case 'admin': return { bg: '#eab308', text: '#000000' }; // Yellow
      case 'break': return { bg: '#ec4899', text: '#ffffff' }; // Pink/Magenta
      default: return { bg: '#6b7280', text: '#ffffff' };
    }
  };

  // Get week days starting from today
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    const dayNames = language === 'es' 
      ? ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
      : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        name: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const timeSlots = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];

  // Export to PDF with weekly calendar format
  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'es' ? 'Estrategia de Time Blocking - Vista Semanal' : 'Time Blocking Strategy - Weekly View', pageWidth / 2, 15, { align: 'center' });
    
    // Week range
    const startDate = weekDays[0].fullDate;
    const endDate = weekDays[4].fullDate;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, pageWidth / 2, 22, { align: 'center' });

    // Calendar grid
    const gridStartX = 25;
    const gridStartY = 30;
    const dayWidth = (pageWidth - 50) / 5;
    const hourHeight = 18;
    const headerHeight = 15;

    // Draw day headers
    doc.setFillColor(245, 245, 245);
    doc.rect(gridStartX, gridStartY, pageWidth - 50, headerHeight, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    weekDays.forEach((day, index) => {
      const x = gridStartX + (index * dayWidth) + (dayWidth / 2);
      doc.text(day.name, x, gridStartY + 6, { align: 'center' });
      doc.setFontSize(14);
      doc.text(String(day.date), x, gridStartY + 13, { align: 'center' });
      doc.setFontSize(10);
    });

    // Draw time slots and grid
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(220, 220, 220);
    
    timeSlots.forEach((time, index) => {
      const y = gridStartY + headerHeight + (index * hourHeight);
      
      // Time label
      doc.setTextColor(128, 128, 128);
      doc.text(time, 5, y + 10);
      
      // Horizontal line
      doc.line(gridStartX, y, pageWidth - 25, y);
      
      // Vertical lines for each day
      for (let i = 0; i <= 5; i++) {
        doc.line(gridStartX + (i * dayWidth), y, gridStartX + (i * dayWidth), y + hourHeight);
      }
    });
    
    // Last horizontal line
    const lastY = gridStartY + headerHeight + (timeSlots.length * hourHeight);
    doc.line(gridStartX, lastY, pageWidth - 25, lastY);

    // Draw time blocks on each day
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    
    weekDays.forEach((day, dayIndex) => {
      timeBlocks.forEach((block) => {
        const startHour = parseInt(block.startTime.split(':')[0]);
        const endHour = parseInt(block.endTime.split(':')[0]);
        const duration = endHour - startHour;
        
        const x = gridStartX + (dayIndex * dayWidth) + 2;
        const y = gridStartY + headerHeight + ((startHour - 8) * hourHeight) + 2;
        const width = dayWidth - 4;
        const height = (duration * hourHeight) - 4;
        
        const colors = getCategoryColor(block.category);
        
        // Parse hex color to RGB
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 0, g: 0, b: 0 };
        };
        
        const bgRgb = hexToRgb(colors.bg);
        const textRgb = hexToRgb(colors.text);
        
        // Draw block
        doc.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
        doc.roundedRect(x, y, width, height, 2, 2, 'F');
        
        // Block text
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        doc.setFont('helvetica', 'bold');
        
        const activityText = language === 'es' ? block.activity : block.activityEn;
        const shortActivity = activityText.length > 15 ? activityText.substring(0, 15) + '...' : activityText;
        
        doc.text(shortActivity, x + 3, y + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${block.startTime} - ${block.endTime}`, x + 3, y + 14);
      });
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text(language === 'es' 
      ? 'Generado por Digital Tools - Hecho con el Corazón, de vendedor a vendedor'
      : 'Generated by Digital Tools - Made with Heart, from seller to seller', 
      pageWidth / 2, 
      pageHeight - 8, 
      { align: 'center' }
    );

    // Save PDF
    doc.save(`time-blocking-weekly-${new Date().toISOString().split('T')[0]}.pdf`);
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

          {/* Weekly Calendar View */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t.yourSchedule}
            </h3>
            
            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Header with days */}
                <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-border">
                  <div className="p-2 text-xs text-muted-foreground"></div>
                  {weekDays.map((day, index) => (
                    <div key={index} className="p-3 text-center border-l border-border bg-muted/30">
                      <div className="text-xs text-muted-foreground font-medium">{day.name}</div>
                      <div className="text-xl font-bold">{day.date}</div>
                    </div>
                  ))}
                </div>
                
                {/* Time slots grid */}
                <div className="relative">
                  {timeSlots.map((time, timeIndex) => (
                    <div key={timeIndex} className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-border" style={{ height: '70px' }}>
                      <div className="p-2 text-xs text-muted-foreground flex items-start justify-end pr-3">
                        {time}
                      </div>
                      {weekDays.map((day, dayIndex) => {
                        const slotHour = parseInt(time.split(' ')[0]) + (time.includes('PM') && !time.includes('12') ? 12 : 0);
                        const blockInSlot = timeBlocks.find(block => {
                          const blockHour = parseInt(block.startTime.split(':')[0]);
                          return blockHour === slotHour || (slotHour === 12 && blockHour === 12);
                        });
                        
                        if (blockInSlot) {
                          const startHour = parseInt(blockInSlot.startTime.split(':')[0]);
                          const endHour = parseInt(blockInSlot.endTime.split(':')[0]);
                          const duration = endHour - startHour;
                          const colors = getCategoryColor(blockInSlot.category);
                          
                          return (
                            <div key={dayIndex} className="border-l border-border p-1 relative">
                              <a
                                href={generateGoogleCalendarUrl(blockInSlot)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg p-2 h-full cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ 
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  height: `${duration * 70 - 8}px`,
                                }}
                              >
                                <div className="text-xs font-semibold truncate">
                                  {language === 'es' 
                                    ? blockInSlot.activity.split(' ').slice(0, 2).join(' ')
                                    : blockInSlot.activityEn.split(' ').slice(0, 2).join(' ')}
                                </div>
                                <div className="text-xs opacity-90">
                                  {blockInSlot.startTime} - {blockInSlot.endTime}
                                </div>
                              </a>
                            </div>
                          );
                        }
                        
                        return <div key={dayIndex} className="border-l border-border"></div>;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
                <span className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Llamadas/Reuniones' : 'Calls/Meetings'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
                <span className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Emails/Admin' : 'Emails/Admin'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ec4899' }}></div>
                <span className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Descanso' : 'Break'}
                </span>
              </div>
            </div>

            {/* Tip */}
            <p className="text-xs text-muted-foreground">
              💡 {language === 'es' 
                ? 'Haz clic en cualquier bloque para agregarlo a Google Calendar' 
                : 'Click on any block to add it to Google Calendar'}
            </p>
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
