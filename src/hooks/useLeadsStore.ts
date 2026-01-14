import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LeadChannel = 'linkedin' | 'phone' | 'email';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  channel: LeadChannel;
  status: LeadStatus;
  value: number;
  date: Date;
  notes?: string;
  closedAt?: Date;
}

interface LeadsStore {
  leads: Lead[];
  hasMockData: boolean;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  clearAllData: () => void;
  loadMockData: () => void;
}

const generateMockLeads = (): Lead[] => {
  const channels: LeadChannel[] = ['linkedin', 'phone', 'email'];
  const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const companies = ['Tech Corp', 'Digital Solutions', 'Innovation Labs', 'Cloud Systems', 'Data Dynamics'];
  const names = ['Juan García', 'María López', 'Carlos Rodríguez', 'Ana Martínez', 'Pedro Sánchez'];
  
  const leads: Lead[] = [];
  
  for (let i = 0; i < 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let closedAt: Date | undefined;
    
    if (status === 'won' || status === 'lost') {
      closedAt = new Date(date);
      closedAt.setDate(closedAt.getDate() + Math.floor(Math.random() * 30) + 5);
    }
    
    leads.push({
      id: `lead-${i + 1}`,
      name: names[Math.floor(Math.random() * names.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      email: `contacto${i + 1}@empresa.com`,
      phone: `+52 55 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      channel: channels[Math.floor(Math.random() * channels.length)],
      status,
      value: Math.floor(Math.random() * 50000) + 5000,
      date,
      closedAt,
    });
  }
  
  return leads;
};

export const useLeadsStore = create<LeadsStore>()(
  persist(
    (set) => ({
      leads: [],
      hasMockData: false,
      addLead: (lead) =>
        set((state) => ({
          leads: [...state.leads, { ...lead, id: `lead-${Date.now()}` }],
        })),
      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id ? { ...lead, ...updates } : lead
          ),
        })),
      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        })),
      clearAllData: () => set({ leads: [], hasMockData: false }),
      loadMockData: () => set({ leads: generateMockLeads(), hasMockData: true }),
    }),
    {
      name: 'leads-storage',
      partialize: (state) => ({ leads: state.leads, hasMockData: state.hasMockData }),
      onRehydrateStorage: () => (state) => {
        if (state?.leads) {
          state.leads = state.leads.map((lead) => ({
            ...lead,
            date: new Date(lead.date),
            closedAt: lead.closedAt ? new Date(lead.closedAt) : undefined,
          }));
        }
      },
    }
  )
);

export const calculateConversionRates = (leads: Lead[]) => {
  const channels: LeadChannel[] = ['linkedin', 'phone', 'email'];
  
  return channels.map((channel) => {
    const channelLeads = leads.filter((lead) => lead.channel === channel);
    const wonLeads = channelLeads.filter((lead) => lead.status === 'won');
    const rate = channelLeads.length > 0 ? (wonLeads.length / channelLeads.length) * 100 : 0;
    
    return {
      channel,
      rate,
      leads: channelLeads.length,
      won: wonLeads.length,
    };
  });
};

export const calculateSalesCycleTimes = (leads: Lead[]) => {
  const channels: LeadChannel[] = ['linkedin', 'phone', 'email'];
  
  return channels.map((channel) => {
    const closedLeads = leads.filter(
      (lead) => lead.channel === channel && lead.closedAt
    );
    
    const totalDays = closedLeads.reduce((sum, lead) => {
      const days = Math.floor(
        (lead.closedAt!.getTime() - lead.date.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);
    
    const avgDays = closedLeads.length > 0 ? totalDays / closedLeads.length : 0;
    
    return {
      channel,
      avgDays,
      count: closedLeads.length,
    };
  });
};
