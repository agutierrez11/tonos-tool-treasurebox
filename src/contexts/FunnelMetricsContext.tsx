import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CallFunnelMetrics {
  llamadasRealizadas: number;
  contestadas: number;
  conversaciones: number;
  reuniones: number;
}

export interface EmailFunnelMetrics {
  emailsEnviados: number;
  emailsAbiertos: number;
  emailsRespondidos: number;
  reuniones: number;
}

export interface ProspectFunnelMetrics {
  prospectosGenerados: number;
  prospectosContactados: number;
  reunionesGeneradas: number;
  reunionesRealizadas: number;
  ventas: number;
  ticketPromedio: number;
}

interface FunnelMetricsContextType {
  callMetrics: CallFunnelMetrics;
  setCallMetrics: (metrics: CallFunnelMetrics) => void;
  emailMetrics: EmailFunnelMetrics;
  setEmailMetrics: (metrics: EmailFunnelMetrics) => void;
  prospectMetrics: ProspectFunnelMetrics;
  setProspectMetrics: (metrics: ProspectFunnelMetrics) => void;
}

const FunnelMetricsContext = createContext<FunnelMetricsContextType | undefined>(undefined);

export const FunnelMetricsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [callMetrics, setCallMetrics] = useState<CallFunnelMetrics>({
    llamadasRealizadas: 100,
    contestadas: 50,
    conversaciones: 10,
    reuniones: 1,
  });

  const [emailMetrics, setEmailMetrics] = useState<EmailFunnelMetrics>({
    emailsEnviados: 500,
    emailsAbiertos: 150,
    emailsRespondidos: 15,
    reuniones: 5,
  });

  const [prospectMetrics, setProspectMetrics] = useState<ProspectFunnelMetrics>({
    prospectosGenerados: 500,
    prospectosContactados: 100,
    reunionesGeneradas: 50,
    reunionesRealizadas: 35,
    ventas: 5,
    ticketPromedio: 15000,
  });

  return (
    <FunnelMetricsContext.Provider
      value={{
        callMetrics,
        setCallMetrics,
        emailMetrics,
        setEmailMetrics,
        prospectMetrics,
        setProspectMetrics,
      }}
    >
      {children}
    </FunnelMetricsContext.Provider>
  );
};

export const useFunnelMetrics = () => {
  const context = useContext(FunnelMetricsContext);
  if (!context) {
    throw new Error('useFunnelMetrics must be used within a FunnelMetricsProvider');
  }
  return context;
};
