import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLeadsStore, Lead, LeadChannel } from "@/hooks/useLeadsStore";

const channelLabels: Record<LeadChannel, string> = {
  linkedin: "LinkedIn",
  phone: "Teléfono",
  email: "Email",
};

const channelColors: Record<LeadChannel, string> = {
  linkedin: "#0077B5",
  phone: "#22c55e",
  email: "#f97316",
};

export const LeadChart = () => {
  const { leads } = useLeadsStore();

  const chartData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }

    return last7Days.map((date) => {
      const dayLeads = leads.filter((lead) => {
        const leadDate = new Date(lead.date);
        leadDate.setHours(0, 0, 0, 0);
        return leadDate.getTime() === date.getTime();
      });

      const dayName = date.toLocaleDateString("es-MX", { weekday: "short" });

      return {
        name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        linkedin: dayLeads.filter((l) => l.channel === "linkedin").length,
        phone: dayLeads.filter((l) => l.channel === "phone").length,
        email: dayLeads.filter((l) => l.channel === "email").length,
      };
    });
  }, [leads]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Leads por canal (últimos 7 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar 
                dataKey="linkedin" 
                name="LinkedIn" 
                fill={channelColors.linkedin} 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="phone" 
                name="Teléfono" 
                fill={channelColors.phone} 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="email" 
                name="Email" 
                fill={channelColors.email} 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
