import { useState } from "react";
import { Sparkles, Copy, RefreshCw, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const ContentGeneratorDemo = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [contentType, setContentType] = useState("email");
  const [context, setContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const getPrompt = () => {
    const contextInfo = context ? `\n\nContexto adicional del usuario: ${context}` : "";
    
    const prompts: Record<string, Record<string, string>> = {
      es: {
        email: `Genera un email de ventas profesional y persuasivo para prospección en frío. Incluye un asunto atractivo. Usa variables como [Nombre], [Empresa], [Producto] para personalización.${contextInfo}`,
        script: `Genera un script de llamada en frío estructurado con: apertura (10 seg), gancho de valor (15 seg), pregunta calificadora, y cierre para agendar reunión. Incluye manejo de objeciones comunes.${contextInfo}`,
        linkedin: `Genera un mensaje de LinkedIn profesional para conectar con un prospecto. Debe ser breve, personalizado y sin ser invasivo. Objetivo: iniciar una conversación, no vender directamente.${contextInfo}`,
        followup: `Genera un email de seguimiento después de una reunión o demo. Debe reforzar el valor discutido, resolver posibles dudas y proponer siguientes pasos claros.${contextInfo}`,
      },
      en: {
        email: `Generate a professional and persuasive cold outreach sales email. Include an attractive subject line. Use variables like [Name], [Company], [Product] for personalization.${contextInfo}`,
        script: `Generate a structured cold call script with: opening (10 sec), value hook (15 sec), qualifying question, and close to schedule a meeting. Include handling of common objections.${contextInfo}`,
        linkedin: `Generate a professional LinkedIn message to connect with a prospect. It should be brief, personalized, and non-invasive. Goal: start a conversation, not sell directly.${contextInfo}`,
        followup: `Generate a follow-up email after a meeting or demo. It should reinforce the value discussed, address potential concerns, and propose clear next steps.${contextInfo}`,
      },
    };

    return prompts[language][contentType];
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: getPrompt() }],
            type: "content",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la respuesta");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  content += delta;
                  setGeneratedContent(content);
                }
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Content generation error:", error);
      toast({
        variant: "destructive",
        title: language === "es" ? "Error" : "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsGenerating(false);
    }
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
          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full ml-auto">
            IA Real
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label className="text-xs mb-1.5 block">
              {language === "es" ? "Tipo de contenido" : "Content type"}
            </Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  {language === "es" ? "📧 Email de prospección" : "📧 Prospecting email"}
                </SelectItem>
                <SelectItem value="script">
                  {language === "es" ? "📞 Script de llamada" : "📞 Call script"}
                </SelectItem>
                <SelectItem value="linkedin">
                  {language === "es" ? "💼 Mensaje LinkedIn" : "💼 LinkedIn message"}
                </SelectItem>
                <SelectItem value="followup">
                  {language === "es" ? "🔄 Email de seguimiento" : "🔄 Follow-up email"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-xs mb-1.5 block">
              {language === "es" ? "Contexto (opcional)" : "Context (optional)"}
            </Label>
            <Input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={language === "es" ? "Ej: Software de RRHH para empresas de +100 empleados" : "E.g.: HR software for companies with 100+ employees"}
            />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {language === "es" ? "Generando..." : "Generating..."}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {language === "es" ? "Generar con IA" : "Generate with AI"}
            </>
          )}
        </Button>

        <div className="relative">
          <Textarea
            value={generatedContent}
            readOnly
            className="min-h-[180px] font-mono text-sm resize-none"
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
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? "🤖 Powered by Lovable AI - Contenido personalizado generado con IA"
            : "🤖 Powered by Lovable AI - Personalized content generated with AI"}
        </p>
      </CardContent>
    </Card>
  );
};

export default ContentGeneratorDemo;
