import { Lead, statusLabels, channelLabels, LeadChannel, LeadStatus } from "@/utils/crm-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Linkedin, Phone, Mail } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
}

const channelIcons: Record<LeadChannel, React.ReactNode> = {
  linkedin: <Linkedin className="h-4 w-4 text-blue-500" />,
  phone: <Phone className="h-4 w-4 text-green-500" />,
  email: <Mail className="h-4 w-4 text-orange-500" />,
};

const statusColors: Record<LeadStatus, string> = {
  prospect: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
  contacted: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  meeting: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  proposal: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  closed_won: "bg-green-500/20 text-green-700 dark:text-green-300",
  closed_lost: "bg-red-500/20 text-red-700 dark:text-red-300",
};

export const LeadsTable = ({ leads }: LeadsTableProps) => {
  return (
    <div className="rounded-xl border bg-card">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Lista de Leads</h3>
        <p className="text-sm text-muted-foreground">
          {leads.length} leads en total
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.slice(0, 15).map((lead) => (
              <TableRow key={lead.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {channelIcons[lead.channel]}
                    <span className="text-sm hidden sm:inline">{channelLabels[lead.channel]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs", statusColors[lead.status])}>
                    {statusLabels[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${lead.value.toLocaleString("es-MX")}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {lead.date.toLocaleDateString("es-MX")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
