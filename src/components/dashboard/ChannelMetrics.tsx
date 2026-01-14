import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLeadsStore, calculateConversionRates, calculateSalesCycleTimes, LeadChannel } from "@/hooks/useLeadsStore";
import { Linkedin, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const channelConfig: Record<LeadChannel, { label: string; icon: typeof Linkedin; color: string; bgColor: string }> = {
  linkedin: { 
    label: "LinkedIn", 
    icon: Linkedin, 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  phone: { 
    label: "Teléfono", 
    icon: Phone, 
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  email: { 
    label: "Email", 
    icon: Mail, 
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
};

export const ChannelMetrics = () => {
  const { leads } = useLeadsStore();

  const metrics = useMemo(() => {
    const conversionRates = calculateConversionRates(leads);
    const cycleTimes = calculateSalesCycleTimes(leads);

    return conversionRates.map((cr) => {
      const cycleTime = cycleTimes.find((ct) => ct.channel === cr.channel);
      return {
        channel: cr.channel,
        conversionRate: cr.rate,
        leads: cr.leads,
        won: cr.won,
        avgDays: cycleTime?.avgDays || 0,
      };
    });
  }, [leads]);

  const maxLeads = Math.max(...metrics.map((m) => m.leads), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Métricas por canal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric) => {
          const config = channelConfig[metric.channel];
          const Icon = config.icon;
          const progress = (metric.leads / maxLeads) * 100;

          return (
            <div key={metric.channel} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("p-2 rounded-lg", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <span className="font-medium">{config.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {metric.leads} leads
                </span>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Conversión</p>
                  <p className="font-medium">{metric.conversionRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ganados</p>
                  <p className="font-medium">{metric.won}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ciclo prom.</p>
                  <p className="font-medium">{metric.avgDays.toFixed(0)} días</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
