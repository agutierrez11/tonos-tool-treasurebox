import { useState } from "react";
import { Sparkles, Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const CONTENT_TEMPLATES: Record<string, Record<string, string[]>> = {
  es: {
    email: [
      "Asunto: 🚀 Aumenta tus ventas un 40% este mes\n\nHola [Nombre],\n\nSé que tu tiempo es valioso, así que iré al grano: nuestros clientes están aumentando sus conversiones un 40% en promedio.\n\n¿Cómo? Con [Tu Producto] automatizamos el seguimiento de leads para que ninguna oportunidad se escape.\n\n¿Te gustaría ver cómo funciona en una demo de 15 minutos?\n\nSaludos,\n[Tu nombre]",
      "Asunto: Pregunta rápida sobre [Empresa]\n\nHola [Nombre],\n\nEstuve investigando sobre [Empresa] y noté que están expandiendo su equipo de ventas.\n\nCuriosidad: ¿Cómo están gestionando el pipeline de nuevos leads?\n\nPregunto porque ayudamos a equipos similares a reducir el tiempo de respuesta de 24h a 5 minutos.\n\n¿Vale la pena una conversación de 10 minutos?\n\n[Tu nombre]",
    ],
    script: [
      "📞 Script de Llamada en Frío\n\n[APERTURA - 10 seg]\n\"Hola [Nombre], soy [Tu nombre] de [Empresa]. ¿Tienes 30 segundos?\"\n\n[GANCHO - 15 seg]\n\"Perfecto. Te llamo porque ayudamos a empresas como [Empresa similar] a aumentar sus ventas un 35% automatizando el seguimiento de leads.\"\n\n[PREGUNTA CALIFICADORA]\n\"Curiosidad: ¿Cómo están manejando actualmente el seguimiento de prospectos interesados?\"\n\n[CIERRE]\n\"Me encantaría mostrarte cómo funciona. ¿Te viene bien el martes a las 10am para una demo de 15 minutos?\"",
    ],
    linkedin: [
      "👋 Hola [Nombre],\n\nVi tu publicación sobre [tema] y me pareció muy interesante tu perspectiva.\n\nTrabajo con líderes de ventas que enfrentan desafíos similares, y hemos encontrado formas creativas de abordarlos.\n\n¿Te interesaría intercambiar ideas? Sin pitch, solo conversación.\n\nSaludos,\n[Tu nombre]",
    ],
  },
  en: {
    email: [
      "Subject: 🚀 Increase your sales by 40% this month\n\nHi [Name],\n\nI know your time is valuable, so I'll get straight to the point: our clients are increasing their conversions by 40% on average.\n\nHow? With [Your Product] we automate lead follow-up so no opportunity slips away.\n\nWould you like to see how it works in a 15-minute demo?\n\nBest regards,\n[Your name]",
      "Subject: Quick question about [Company]\n\nHi [Name],\n\nI was researching [Company] and noticed you're expanding your sales team.\n\nCurious: How are you managing the pipeline of new leads?\n\nI ask because we help similar teams reduce response time from 24h to 5 minutes.\n\nWorth a 10-minute conversation?\n\n[Your name]",
    ],
    script: [
      "📞 Cold Call Script\n\n[OPENING - 10 sec]\n\"Hi [Name], this is [Your name] from [Company]. Do you have 30 seconds?\"\n\n[HOOK - 15 sec]\n\"Perfect. I'm calling because we help companies like [Similar Company] increase their sales by 35% by automating lead follow-up.\"\n\n[QUALIFYING QUESTION]\n\"Curious: How are you currently handling follow-up with interested prospects?\"\n\n[CLOSE]\n\"I'd love to show you how it works. Does Tuesday at 10am work for a 15-minute demo?\"",
    ],
    linkedin: [
      "👋 Hi [Name],\n\nI saw your post about [topic] and found your perspective very interesting.\n\nI work with sales leaders facing similar challenges, and we've found creative ways to address them.\n\nWould you be interested in exchanging ideas? No pitch, just conversation.\n\nBest,\n[Your name]",
    ],
  },
};

const ContentGeneratorDemo = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [contentType, setContentType] = useState("email");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedContent("");

    const templates = CONTENT_TEMPLATES[language][contentType];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Simulate typing effect
    let i = 0;
    const interval = setInterval(() => {
      if (i < template.length) {
        setGeneratedContent(template.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 15);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast({
      title: language === "es" ? "¡Copiado!" : "Copied!",
      description: language === "es" ? "Contenido copiado al portapapeles" : "Content copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          {language === "es" ? "Generador de Contenido" : "Content Generator"}
          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full ml-auto">
            Demo
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">
                {language === "es" ? "Email de ventas" : "Sales email"}
              </SelectItem>
              <SelectItem value="script">
                {language === "es" ? "Script de llamada" : "Call script"}
              </SelectItem>
              <SelectItem value="linkedin">
                {language === "es" ? "Mensaje LinkedIn" : "LinkedIn message"}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {language === "es" ? "Generando..." : "Generating..."}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {language === "es" ? "Generar" : "Generate"}
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <Textarea
            value={generatedContent}
            readOnly
            className="min-h-[200px] font-mono text-sm resize-none"
            placeholder={
              language === "es"
                ? "El contenido generado aparecerá aquí..."
                : "Generated content will appear here..."
            }
          />
          {generatedContent && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? "💡 Demo: Plantillas pre-escritas. Conecta una API de IA para contenido personalizado."
            : "💡 Demo: Pre-written templates. Connect an AI API for personalized content."}
        </p>
      </CardContent>
    </Card>
  );
};

export default ContentGeneratorDemo;
