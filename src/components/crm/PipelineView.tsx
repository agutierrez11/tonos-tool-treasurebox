import { Lead, LeadStatus, statusLabels } from "@/utils/crm-data";
import { cn } from "@/lib/utils";
import { Users, UserCheck, Calendar, FileText, Trophy, XCircle } from "lucide-react";

interface PipelineViewProps {
  leads: Lead[];
}

const stageConfig: Record<LeadStatus, { icon: React.ReactNode; color: string; bgColor: string }> = {
  prospect: {
    icon: <Users className="h-4 w-4" />,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10 border-slate-500/30",
  },
  contacted: {
    icon: <UserCheck className="h-4 w-4" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  meeting: {
    icon: <Calendar className="h-4 w-4" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 border-purple-500/30",
  },
  proposal: {
    icon: <FileText className="h-4 w-4" />,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 border-orange-500/30",
  },
  closed_won: {
    icon: <Trophy className="h-4 w-4" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10 border-green-500/30",
  },
  closed_lost: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30",
  },
};

const pipelineStages: LeadStatus[] = ["prospect", "contacted", "meeting", "proposal", "closed_won", "closed_lost"];

export const PipelineView = ({ leads }: PipelineViewProps) => {
  const getStageLeads = (status: LeadStatus) => {
    return leads.filter((l) => l.status === status);
  };

  const getStageValue = (status: LeadStatus) => {
    return getStageLeads(status).reduce((sum, l) => sum + l.value, 0);
  };

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Pipeline de Ventas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pipelineStages.map((status) => {
          const stageLeads = getStageLeads(status);
          const stageValue = getStageValue(status);
          const config = stageConfig[status];

          return (
            <div
              key={status}
              className={cn(
                "rounded-lg border p-3 sm:p-4 transition-all hover:shadow-md",
                config.bgColor
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={config.color}>{config.icon}</div>
                <span className="text-xs font-medium truncate">{statusLabels[status]}</span>
              </div>
              <p className="text-2xl font-bold">{stageLeads.length}</p>
              <p className="text-xs text-muted-foreground">
                ${stageValue.toLocaleString("es-MX")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
