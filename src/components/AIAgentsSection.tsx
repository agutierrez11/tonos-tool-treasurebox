import { Bot, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ChatbotDemo from "./ai-agents/ChatbotDemo";
import ContentGeneratorDemo from "./ai-agents/ContentGeneratorDemo";
import DataAnalyzerDemo from "./ai-agents/DataAnalyzerDemo";
import SmartSearchDemo from "./ai-agents/SmartSearchDemo";

const AIAgentsSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Bot className="w-4 h-4" />
            {language === "es" ? "Agentes de IA" : "AI Agents"}
            <span className="bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full text-xs">
              Activos
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {language === "es"
              ? "Potencia tus Ventas con IA Real"
              : "Supercharge Your Sales with Real AI"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "es"
              ? "Agentes de IA conectados a Lovable AI. Obtén respuestas inteligentes, contenido personalizado y análisis en tiempo real."
              : "AI agents connected to Lovable AI. Get intelligent answers, personalized content, and real-time analysis."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ChatbotDemo />
          <ContentGeneratorDemo />
          <DataAnalyzerDemo />
          <SmartSearchDemo />
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-green-500/10 text-green-700 px-4 py-2 rounded-lg">
            <Sparkles className="w-4 h-4" />
            {language === "es"
              ? "Powered by Lovable AI - Respuestas inteligentes sin configuración"
              : "Powered by Lovable AI - Smart responses with no setup"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentsSection;
