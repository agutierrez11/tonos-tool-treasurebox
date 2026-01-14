export type LeadChannel = "linkedin" | "phone" | "email";
export type LeadStatus = "prospect" | "contacted" | "meeting" | "proposal" | "closed_won" | "closed_lost";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  channel: LeadChannel;
  status: LeadStatus;
  value: number;
  date: Date;
  notes: string;
}

export interface ConversionRate {
  stage: string;
  rate: number;
  leads: number;
}

export interface SalesCycleTime {
  stage: string;
  avgDays: number;
  count: number;
}

// Generate mock leads
const generateMockLeads = (): Lead[] => {
  const names = [
    "Carlos Mendoza", "María García", "Juan López", "Ana Martínez", "Pedro Sánchez",
    "Laura Rodríguez", "Diego Hernández", "Sofía González", "Miguel Torres", "Valentina Díaz",
    "Andrés Ruiz", "Camila Flores", "Roberto Castro", "Isabella Morales", "Fernando Jiménez"
  ];
  
  const companies = [
    "TechCorp MX", "Innovate Solutions", "Digital Growth", "StartUp Hub", "Enterprise Co",
    "Global Services", "Smart Systems", "Cloud Nine", "Data Dynamics", "Future Labs"
  ];
  
  const channels: LeadChannel[] = ["linkedin", "phone", "email"];
  const statuses: LeadStatus[] = ["prospect", "contacted", "meeting", "proposal", "closed_won", "closed_lost"];
  
  const leads: Lead[] = [];
  
  for (let i = 0; i < 50; i++) {
    const randomDays = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - randomDays);
    
    leads.push({
      id: `lead-${i + 1}`,
      name: names[Math.floor(Math.random() * names.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      email: `contacto${i}@empresa.com`,
      phone: `+52 55 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      channel: channels[Math.floor(Math.random() * channels.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      value: Math.floor(Math.random() * 100000) + 5000,
      date,
      notes: ""
    });
  }
  
  return leads;
};

export const mockLeads = generateMockLeads();

export const conversionRates: ConversionRate[] = [
  { stage: "Prospecto → Contactado", rate: 65, leads: 50 },
  { stage: "Contactado → Reunión", rate: 40, leads: 33 },
  { stage: "Reunión → Propuesta", rate: 55, leads: 13 },
  { stage: "Propuesta → Cierre", rate: 35, leads: 7 },
];

export const salesCycleTimes: SalesCycleTime[] = [
  { stage: "Prospecto", avgDays: 3, count: 50 },
  { stage: "Contactado", avgDays: 7, count: 33 },
  { stage: "Reunión", avgDays: 14, count: 13 },
  { stage: "Propuesta", avgDays: 10, count: 7 },
  { stage: "Cierre", avgDays: 5, count: 3 },
];

export const statusLabels: Record<LeadStatus, string> = {
  prospect: "Prospecto",
  contacted: "Contactado",
  meeting: "Reunión",
  proposal: "Propuesta",
  closed_won: "Cerrado Ganado",
  closed_lost: "Cerrado Perdido",
};

export const channelLabels: Record<LeadChannel, string> = {
  linkedin: "LinkedIn",
  phone: "Teléfono",
  email: "Email",
};
