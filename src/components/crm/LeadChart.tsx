import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Lead } from "@/utils/crm-data";

interface LeadChartProps {
  leads: Lead[];
}

export const LeadChart = ({ leads }: LeadChartProps) => {
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
        fullDate: date.toISOString().split("T")[0],
        linkedin: 0,
        phone: 0,
        email: 0,
        total: 0,
      };
    });

    leads.forEach((lead) => {
      const leadDate = lead.date.toISOString().split("T")[0];
      const dayData = last30Days.find((d) => d.fullDate === leadDate);
      if (dayData) {
        dayData[lead.channel]++;
        dayData.total++;
      }
    });

    return last30Days;
  }, [leads]);

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Leads por Canal (Últimos 30 días)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLinkedin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0077B5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0077B5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPhone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="linkedin"
              name="LinkedIn"
              stroke="#0077B5"
              fillOpacity={1}
              fill="url(#colorLinkedin)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="phone"
              name="Teléfono"
              stroke="#22C55E"
              fillOpacity={1}
              fill="url(#colorPhone)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="email"
              name="Email"
              stroke="#F97316"
              fillOpacity={1}
              fill="url(#colorEmail)"
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
