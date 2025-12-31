import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  score: number;
  insights: Array<{
    type: "positive" | "warning" | "negative";
    text: string;
  }>;
  recommendations: string[];
}

const DataAnalyzerDemo = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [leads, setLeads] = useState("100");
  const [calls, setCalls] = useState("50");
  const [meetings, setMeetings] = useState("15");
  const [closes, setCloses] = useState("5");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis("");
    setResult(null);

    const leadsNum = parseInt(leads) || 0;
    const callsNum = parseInt(calls) || 0;
    const meetingsNum = parseInt(meetings) || 0;
    const closesNum = parseInt(closes) || 0;

    const contactRate = leadsNum > 0 ? (callsNum / leadsNum) * 100 : 0;
    const meetingRate = callsNum > 0 ? (meetingsNum / callsNum) * 100 : 0;
    const closeRate = meetingsNum > 0 ? (closesNum / meetingsNum) * 100 : 0;

    const prompt = language === "es"
      ? `Analiza estos datos de embudo de ventas y proporciona un análisis detallado con recomendaciones específicas:

Métricas:
- Leads totales: ${leadsNum}
- Llamadas realizadas: ${callsNum} (Tasa de contacto: ${contactRate.toFixed(1)}%)
- Reuniones agendadas: ${meetingsNum} (Tasa de conversión a reuniones: ${meetingRate.toFixed(1)}%)
- Ventas cerradas: ${closesNum} (Tasa de cierre: ${closeRate.toFixed(1)}%)

Benchmarks de referencia B2B:
- Tasa de contacto objetivo: 40-60%
- Tasa de reuniones desde llamadas: 20-35%
- Tasa de cierre desde reuniones: 25-40%

Proporciona:
1. Diagnóstico del embudo (qué etapas están bien, cuáles necesitan mejora)
2. Las 3 acciones prioritarias para mejorar resultados
3. Herramientas específicas que podrían ayudar en cada etapa débil`
      : `Analyze this sales funnel data and provide a detailed analysis with specific recommendations:

Metrics:
- Total leads: ${leadsNum}
- Calls made: ${callsNum} (Contact rate: ${contactRate.toFixed(1)}%)
- Meetings booked: ${meetingsNum} (Meeting conversion rate: ${meetingRate.toFixed(1)}%)
- Deals closed: ${closesNum} (Close rate: ${closeRate.toFixed(1)}%)

B2B Reference Benchmarks:
- Target contact rate: 40-60%
- Meetings from calls rate: 20-35%
- Close rate from meetings: 25-40%

Provide:
1. Funnel diagnosis (which stages are good, which need improvement)
2. Top 3 priority actions to improve results
3. Specific tools that could help at each weak stage`;

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
            messages: [{ role: "user", content: prompt }],
            type: "analyzer",
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
                  setAiAnalysis(content);
                }
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Calculate score based on metrics
      const score = Math.min(100, Math.round(
        (Math.min(contactRate / 50, 1) * 20) +
        (Math.min(meetingRate / 25, 1) * 30) +
        (Math.min(closeRate / 30, 1) * 50)
      ));

      setResult({
        score,
        insights: [],
        recommendations: [],
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: language === "es" ? "Error" : "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          {language === "es" ? "Analizador de Datos de Ventas" : "Sales Data Analyzer"}
          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full ml-auto">
            IA Real
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{language === "es" ? "Leads totales" : "Total leads"}</Label>
            <Input
              type="number"
              value={leads}
              onChange={(e) => setLeads(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">{language === "es" ? "Llamadas realizadas" : "Calls made"}</Label>
            <Input
              type="number"
              value={calls}
              onChange={(e) => setCalls(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">{language === "es" ? "Reuniones agendadas" : "Meetings booked"}</Label>
            <Input
              type="number"
              value={meetings}
              onChange={(e) => setMeetings(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">{language === "es" ? "Ventas cerradas" : "Deals closed"}</Label>
            <Input
              type="number"
              value={closes}
              onChange={(e) => setCloses(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <Button onClick={analyze} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {language === "es" ? "Analizando con IA..." : "Analyzing with AI..."}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {language === "es" ? "Analizar con IA" : "Analyze with AI"}
            </>
          )}
        </Button>

        {result && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-1">
              {language === "es" ? "Puntuación de rendimiento" : "Performance Score"}
            </p>
            <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}/100
            </p>
            <Progress value={result.score} className="mt-2" />
          </div>
        )}

        {aiAnalysis && (
          <div className="p-3 rounded-lg border bg-muted/30 max-h-48 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{aiAnalysis}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? "🤖 Powered by Lovable AI - Análisis inteligente de tu embudo"
            : "🤖 Powered by Lovable AI - Intelligent funnel analysis"}
        </p>
      </CardContent>
    </Card>
  );
};

export default DataAnalyzerDemo;
