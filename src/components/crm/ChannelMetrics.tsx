import { Linkedin, Phone, Mail } from "lucide-react";
import { Lead, LeadChannel, channelLabels } from "@/utils/crm-data";
import { cn } from "@/lib/utils";

interface ChannelMetricsProps {
  leads: Lead[];
}

const channelConfig: Record<LeadChannel, { icon: React.ReactNode; color: string; bgColor: string }> = {
  linkedin: {
    icon: <Linkedin className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  phone: {
    icon: <Phone className="h-5 w-5" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  email: {
    icon: <Mail className="h-5 w-5" />,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
};

export const ChannelMetrics = ({ leads }: ChannelMetricsProps) => {
  const channels: LeadChannel[] = ["linkedin", "phone", "email"];
  
  const getChannelStats = (channel: LeadChannel) => {
    const channelLeads = leads.filter((l) => l.channel === channel);
    const total = channelLeads.length;
    const closedWon = channelLeads.filter((l) => l.status === "closed_won").length;
    const revenue = channelLeads
      .filter((l) => l.status === "closed_won")
      .reduce((sum, l) => sum + l.value, 0);
    const conversionRate = total > 0 ? ((closedWon / total) * 100).toFixed(1) : "0";
    
    return { total, closedWon, revenue, conversionRate };
  };

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Métricas por Canal</h3>
      <div className="space-y-4">
        {channels.map((channel) => {
          const stats = getChannelStats(channel);
          const config = channelConfig[channel];
          
          return (
            <div
              key={channel}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", config.bgColor, config.color)}>
                  {config.icon}
                </div>
                <div>
                  <p className="font-medium">{channelLabels[channel]}</p>
                  <p className="text-sm text-muted-foreground">{stats.total} leads</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-sm text-muted-foreground">Conversión</p>
                  <p className="font-semibold">{stats.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                  <p className="font-semibold text-green-500">
                    ${stats.revenue.toLocaleString("es-MX")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
