import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface Translations {
  header: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    marketing: string;
    productivity: string;
    automation: string;
    tools: string;
    categories: string;
    free: string;
  };
  categories: {
    email: string;
    writing: string;
    seo: string;
    prospecting: string;
    data: string;
    social: string;
    ai: string;
    education: string;
    video: string;
    design: string;
    sales: string;
    verification: string;
    warmup: string;
    resources: string;
  };
  toolCard: {
    visitSite: string;
    free: string;
  };
  footer: {
    madeWith: string;
    forProductivity: string;
    disclaimer: string;
  };
  nav: {
    back: string;
    viewCategories: string;
  };
}

const translations: Record<Language, Translations> = {
  es: {
    header: {
      badge: "Colección curada de herramientas digitales",
      title1: "Herramientas",
      title2: "Digitales",
      subtitle: "Una colección organizada de las mejores herramientas para",
      marketing: "marketing",
      productivity: "productividad",
      automation: "automatización",
      tools: "Herramientas",
      categories: "Categorías",
      free: "Gratuito",
    },
    categories: {
      email: "Email Marketing",
      writing: "Escritura e IA",
      seo: "SEO y Análisis",
      prospecting: "Prospección",
      data: "Datos y Leads",
      social: "Redes Sociales",
      ai: "Inteligencia Artificial",
      education: "Educación",
      video: "Video y Multimedia",
      design: "Diseño",
      sales: "Ventas",
      verification: "Verificación Email",
      warmup: "Email Warmup",
      resources: "Recursos",
    },
    toolCard: {
      visitSite: "Visitar sitio",
      free: "Gratis",
    },
    footer: {
      madeWith: "Hecho con",
      forProductivity: "para la productividad digital",
      disclaimer: "Todas las herramientas listadas son propiedad de sus respectivos creadores.",
    },
    nav: {
      back: "Volver",
      viewCategories: "Ver más categorías",
    },
  },
  en: {
    header: {
      badge: "Curated collection of digital tools",
      title1: "Digital",
      title2: "Tools",
      subtitle: "An organized collection of the best tools for",
      marketing: "marketing",
      productivity: "productivity",
      automation: "automation",
      tools: "Tools",
      categories: "Categories",
      free: "Free",
    },
    categories: {
      email: "Email Marketing",
      writing: "Writing & AI",
      seo: "SEO & Analytics",
      prospecting: "Prospecting",
      data: "Data & Leads",
      social: "Social Media",
      ai: "Artificial Intelligence",
      education: "Education",
      video: "Video & Multimedia",
      design: "Design",
      sales: "Sales",
      verification: "Email Verification",
      warmup: "Email Warmup",
      resources: "Resources",
    },
    toolCard: {
      visitSite: "Visit site",
      free: "Free",
    },
    footer: {
      madeWith: "Made with",
      forProductivity: "for digital productivity",
      disclaimer: "All listed tools are property of their respective creators.",
    },
    nav: {
      back: "Back",
      viewCategories: "View more categories",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("es");

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export type { Language, Translations };
