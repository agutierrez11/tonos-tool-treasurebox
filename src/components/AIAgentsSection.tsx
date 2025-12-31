import { Bot, Zap } from "lucide-react";
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
            <span className="bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full text-xs">
              Demo
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {language === "es"
              ? "Potencia tus Ventas con IA"
              : "Supercharge Your Sales with AI"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "es"
              ? "Explora estas demos interactivas de agentes de IA. Para funcionalidad completa, conecta tu propia API de OpenAI o Claude."
              : "Explore these interactive AI agent demos. For full functionality, connect your own OpenAI or Claude API."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ChatbotDemo />
          <ContentGeneratorDemo />
          <DataAnalyzerDemo />
          <SmartSearchDemo />
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
            <Zap className="w-4 h-4 text-amber-500" />
            {language === "es"
              ? "Para activar IA real, habilita Lovable Cloud y conecta una API"
              : "To enable real AI, enable Lovable Cloud and connect an API"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentsSection;
