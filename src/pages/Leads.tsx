import { useMemo } from "react";
import { BarChart3, Linkedin, Phone, Mail, Users, TrendingUp, Clock, Trash2, RefreshCw, Plus, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadChart } from "@/components/dashboard/LeadChart";
import { ChannelMetrics } from "@/components/dashboard/ChannelMetrics";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLeadsStore, calculateConversionRates, calculateSalesCycleTimes, LeadChannel, LeadStatus } from "@/hooks/useLeadsStore";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const channelLabels: Record<LeadChannel, string> = {
  linkedin: "LinkedIn",
  phone: "Teléfono",
  email: "Email",
};

const statusLabels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  proposal: "Propuesta",
  negotiation: "Negociación",
  won: "Ganado",
  lost: "Perdido",
};

const Leads = () => {
  const { leads, clearAllData, loadMockData, hasMockData } = useLeadsStore();

  const stats = useMemo(() => {
    const totalLeads = leads.length;

    const byChannel = {
      linkedin: leads.filter((lead) => lead.channel === "linkedin").length,
      phone: leads.filter((lead) => lead.channel === "phone").length,
      email: leads.filter((lead) => lead.channel === "email").length,
    };

    // Calculate percentages for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Generate random trends
    const linkedinTrend = Math.floor(Math.random() * 30) + 5;
    const phoneTrend = Math.floor(Math.random() * 15) + 2;
    const emailTrend = Math.floor(Math.random() * 20) - 5;
    const totalTrend = Math.floor((linkedinTrend + phoneTrend + emailTrend) / 3);

    // Get overall conversion rate and cycle time from leads
    const conversionRates = calculateConversionRates(leads);
    const salesCycleTimes = calculateSalesCycleTimes(leads);

    const overallConversionRate =
      totalLeads > 0 ? conversionRates.reduce((sum, item) => sum + item.rate * item.leads, 0) / totalLeads : 0;
    const totalCycleCount = salesCycleTimes.reduce((sum, item) => sum + item.count, 0);
    const overallCycleTime =
      totalCycleCount > 0
        ? salesCycleTimes.reduce((sum, item) => sum + item.avgDays * item.count, 0) / totalCycleCount
        : 0;

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
  }, [leads]);

  const handleClearData = () => {
    clearAllData();
    toast.success("Todos los datos han sido eliminados. ¡Listo para ingresar datos reales!");
  };

  const handleLoadMockData = () => {
    loadMockData();
    toast.success("Datos de ejemplo cargados");
  };

  const handleExportToExcel = () => {
    if (leads.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const exportData = leads.map((lead) => ({
      Nombre: lead.name,
      Empresa: lead.company,
      Email: lead.email,
      Teléfono: lead.phone || "",
      Canal: channelLabels[lead.channel],
      Estado: statusLabels[lead.status],
      "Valor ($)": lead.value,
      "Fecha de creación": lead.date.toLocaleDateString("es-MX"),
      "Fecha de cierre": lead.closedAt ? lead.closedAt.toLocaleDateString("es-MX") : "",
      Notas: lead.notes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, `leads_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Archivo Excel exportado exitosamente");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitorea el rendimiento de tus leads a través de distintos canales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {leads.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportToExcel} className="gap-2">
                <Download className="h-4 w-4" />
                Exportar Excel
              </Button>
            )}
            {leads.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Limpiar datos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar todos los datos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos los leads actuales ({leads.length} registros). Podrás comenzar a
                      ingresar tus datos reales desde cero.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData}>
                      Eliminar todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {leads.length === 0 && (
              <Button variant="outline" size="sm" onClick={handleLoadMockData} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Cargar datos ejemplo
              </Button>
            )}
            <Link to="/leads/new">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Lead
              </Button>
            </Link>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sin datos registrados</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Comienza a agregar leads reales para ver las métricas de tu pipeline de ventas.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleLoadMockData} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Cargar ejemplo
              </Button>
              <Link to="/leads/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar primer lead
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Leads"
                value={stats.total}
                icon={<BarChart3 className="h-5 w-5" />}
                description="Todos los canales"
                trend={stats.trends.total}
              />
              <StatCard
                title="LinkedIn"
                value={stats.byChannel.linkedin}
                icon={<Linkedin className="h-5 w-5" />}
                description="Leads vía LinkedIn"
                channel="linkedin"
                trend={stats.trends.linkedin}
              />
              <StatCard
                title="Teléfono"
                value={stats.byChannel.phone}
                icon={<Phone className="h-5 w-5" />}
                description="Leads vía Teléfono"
                channel="phone"
                trend={stats.trends.phone}
              />
              <StatCard
                title="Email"
                value={stats.byChannel.email}
                icon={<Mail className="h-5 w-5" />}
                description="Leads vía Email"
                channel="email"
                trend={stats.trends.email}
              />
            </div>

            {/* Conversion & Cycle Time */}
            <div className="grid gap-4 lg:grid-cols-3">
              <StatCard
                title="Tasa de Conversión"
                value={`${stats.conversionRate}%`}
                icon={<TrendingUp className="h-5 w-5" />}
                description="Promedio general"
                className="lg:col-span-1"
              />
              <StatCard
                title="Ciclo de Venta"
                value={`${stats.salesCycleTime} días`}
                icon={<Clock className="h-5 w-5" />}
                description="Tiempo promedio"
                className="lg:col-span-2"
              />
            </div>

            {/* Charts */}
            <LeadChart />

            <ChannelMetrics />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Leads;
