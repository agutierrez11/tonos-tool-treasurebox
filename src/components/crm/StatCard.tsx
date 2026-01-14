import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LeadChannel } from "@/utils/crm-data";

interface Trend {
  value: number;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  channel?: LeadChannel;
  trend?: Trend;
  className?: string;
}

const channelColors: Record<LeadChannel, string> = {
  linkedin: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  phone: "from-green-500/20 to-green-600/10 border-green-500/30",
  email: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
};

export const StatCard = ({
  title,
  value,
  icon,
  description,
  channel,
  trend,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        channel ? channelColors[channel] : "from-primary/10 to-primary/5 border-primary/20",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-lg bg-background/50 p-2 sm:p-3 backdrop-blur-sm">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">vs mes anterior</span>
        </div>
      )}
    </div>
  );
};
