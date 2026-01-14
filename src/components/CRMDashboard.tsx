import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, BarChart3, Linkedin, Phone, Mail, Users, TrendingUp, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/crm/StatCard";
import { LeadChart } from "@/components/crm/LeadChart";
import { ChannelMetrics } from "@/components/crm/ChannelMetrics";
import { PipelineView } from "@/components/crm/PipelineView";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { mockLeads, conversionRates, salesCycleTimes } from "@/utils/crm-data";
import { useLanguage } from "@/contexts/LanguageContext";
import * as XLSX from "xlsx";

const CRMDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();

  const stats = useMemo(() => {
    const totalLeads = mockLeads.length;

    const byChannel = {
      linkedin: mockLeads.filter((lead) => lead.channel === "linkedin").length,
      phone: mockLeads.filter((lead) => lead.channel === "phone").length,
      email: mockLeads.filter((lead) => lead.channel === "email").length,
    };

    // Calculate percentages for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLeads = mockLeads.filter((lead) => lead.date > thirtyDaysAgo);

    // Generate random trends
    const linkedinTrend = Math.floor(Math.random() * 30) + 5;
    const phoneTrend = Math.floor(Math.random() * 15) + 2;
    const emailTrend = Math.floor(Math.random() * 20) - 5;
    const totalTrend = Math.floor((linkedinTrend + phoneTrend + emailTrend) / 3);

    // Get overall conversion rate and cycle time
    const overallConversionRate =
      conversionRates.reduce((sum, item) => sum + item.rate * item.leads, 0) / totalLeads;
    const overallCycleTime =
      salesCycleTimes.reduce((sum, item) => sum + item.avgDays * item.count, 0) /
      salesCycleTimes.reduce((sum, item) => sum + item.count, 0);

    return {
      total: totalLeads,
      byChannel,
      conversionRate: parseFloat(overallConversionRate.toFixed(1)),
      salesCycleTime: parseFloat(overallCycleTime.toFixed(1)),
      trends: {
        linkedin: { value: linkedinTrend, isPositive: linkedinTrend >= 0 },
        phone: { value: phoneTrend, isPositive: phoneTrend >= 0 },
        email: { value: emailTrend, isPositive: emailTrend >= 0 },
        total: { value: totalTrend, isPositive: totalTrend >= 0 },
      },
    };
  }, []);

  const exportToExcel = () => {
    // Leads sheet
    const leadsData = mockLeads.map((lead) => ({
      ID: lead.id,
      Nombre: lead.name,
      Empresa: lead.company,
      Email: lead.email,
      Teléfono: lead.phone,
      Canal: lead.channel === "linkedin" ? "LinkedIn" : lead.channel === "phone" ? "Teléfono" : "Email",
      Estado: lead.status === "prospect" ? "Prospecto" : 
              lead.status === "contacted" ? "Contactado" :
              lead.status === "meeting" ? "Reunión" :
              lead.status === "proposal" ? "Propuesta" :
              lead.status === "closed_won" ? "Cerrado Ganado" : "Cerrado Perdido",
      Valor: lead.value,
      Fecha: lead.date.toLocaleDateString("es-MX"),
    }));

    // Stats sheet
    const statsData = [
      { Métrica: "Total Leads", Valor: stats.total },
      { Métrica: "Leads LinkedIn", Valor: stats.byChannel.linkedin },
      { Métrica: "Leads Teléfono", Valor: stats.byChannel.phone },
      { Métrica: "Leads Email", Valor: stats.byChannel.email },
      { Métrica: "Tasa de Conversión (%)", Valor: stats.conversionRate },
      { Métrica: "Ciclo de Ventas (días)", Valor: stats.salesCycleTime },
    ];

    // Pipeline sheet
    const pipelineData = [
      { Etapa: "Prospecto", Leads: mockLeads.filter(l => l.status === "prospect").length },
      { Etapa: "Contactado", Leads: mockLeads.filter(l => l.status === "contacted").length },
      { Etapa: "Reunión", Leads: mockLeads.filter(l => l.status === "meeting").length },
      { Etapa: "Propuesta", Leads: mockLeads.filter(l => l.status === "proposal").length },
      { Etapa: "Cerrado Ganado", Leads: mockLeads.filter(l => l.status === "closed_won").length },
      { Etapa: "Cerrado Perdido", Leads: mockLeads.filter(l => l.status === "closed_lost").length },
    ];

    const workbook = XLSX.utils.book_new();
    
    const leadsSheet = XLSX.utils.json_to_sheet(leadsData);
    XLSX.utils.book_append_sheet(workbook, leadsSheet, "Leads");
    
    const statsSheet = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, "Estadísticas");
    
    const pipelineSheet = XLSX.utils.json_to_sheet(pipelineData);
    XLSX.utils.book_append_sheet(workbook, pipelineSheet, "Pipeline");

    XLSX.writeFile(workbook, `CRM_Export_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-br from-indigo-50/50 via-background to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 sm:p-6 bg-card/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {language === "es" ? "CRM Dashboard" : "CRM Dashboard"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {language === "es"
                  ? "Gestión de leads y pipeline de ventas"
                  : "Lead management and sales pipeline"}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-6 animate-fade-in">
            {/* Export Button */}
            <div className="flex justify-end">
              <Button onClick={exportToExcel} className="gap-2">
                <Download className="h-4 w-4" />
                {language === "es" ? "Exportar a Excel" : "Export to Excel"}
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title={language === "es" ? "Total Leads" : "Total Leads"}
                value={stats.total}
                icon={<Users className="h-5 w-5 text-primary" />}
                description={language === "es" ? "Todos los canales" : "All channels"}
                trend={stats.trends.total}
              />
              <StatCard
                title="LinkedIn"
                value={stats.byChannel.linkedin}
                icon={<Linkedin className="h-5 w-5 text-blue-500" />}
                description={language === "es" ? "Leads vía LinkedIn" : "LinkedIn leads"}
                channel="linkedin"
                trend={stats.trends.linkedin}
              />
              <StatCard
                title={language === "es" ? "Teléfono" : "Phone"}
                value={stats.byChannel.phone}
                icon={<Phone className="h-5 w-5 text-green-500" />}
                description={language === "es" ? "Leads vía Teléfono" : "Phone leads"}
                channel="phone"
                trend={stats.trends.phone}
              />
              <StatCard
                title="Email"
                value={stats.byChannel.email}
                icon={<Mail className="h-5 w-5 text-orange-500" />}
                description={language === "es" ? "Leads vía Email" : "Email leads"}
                channel="email"
                trend={stats.trends.email}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                title={language === "es" ? "Tasa de Conversión" : "Conversion Rate"}
                value={`${stats.conversionRate}%`}
                icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                description={language === "es" ? "Promedio general" : "Overall average"}
                className="lg:col-span-1"
              />
              <StatCard
                title={language === "es" ? "Ciclo de Ventas" : "Sales Cycle"}
                value={`${stats.salesCycleTime} días`}
                icon={<Clock className="h-5 w-5 text-amber-500" />}
                description={language === "es" ? "Tiempo promedio" : "Average time"}
                className="lg:col-span-2"
              />
            </div>

            {/* Pipeline View */}
            <PipelineView leads={mockLeads} />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LeadChart leads={mockLeads} />
              <ChannelMetrics leads={mockLeads} />
            </div>

            {/* Leads Table */}
            <LeadsTable leads={mockLeads} />
          </div>
        )}
      </div>
    </section>
  );
};

export default CRMDashboard;
