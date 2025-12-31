import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [leads, setLeads] = useState("100");
  const [calls, setCalls] = useState("50");
  const [meetings, setMeetings] = useState("15");
  const [closes, setCloses] = useState("5");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = () => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const leadsNum = parseInt(leads) || 0;
      const callsNum = parseInt(calls) || 0;
      const meetingsNum = parseInt(meetings) || 0;
      const closesNum = parseInt(closes) || 0;

      const contactRate = leadsNum > 0 ? (callsNum / leadsNum) * 100 : 0;
      const meetingRate = callsNum > 0 ? (meetingsNum / callsNum) * 100 : 0;
      const closeRate = meetingsNum > 0 ? (closesNum / meetingsNum) * 100 : 0;
      const overallRate = leadsNum > 0 ? (closesNum / leadsNum) * 100 : 0;

      const insights: AnalysisResult["insights"] = [];
      const recommendations: string[] = [];

      // Contact rate analysis
      if (contactRate >= 50) {
        insights.push({
          type: "positive",
          text: language === "es"
            ? `Excelente tasa de contacto: ${contactRate.toFixed(1)}%`
            : `Excellent contact rate: ${contactRate.toFixed(1)}%`,
        });
      } else if (contactRate >= 30) {
        insights.push({
          type: "warning",
          text: language === "es"
            ? `Tasa de contacto mejorable: ${contactRate.toFixed(1)}%`
            : `Contact rate could improve: ${contactRate.toFixed(1)}%`,
        });
        recommendations.push(
          language === "es"
            ? "Mejora la calidad de tu lista de leads usando herramientas como Apollo.io o ZoomInfo"
            : "Improve lead list quality using tools like Apollo.io or ZoomInfo"
        );
      } else {
        insights.push({
          type: "negative",
          text: language === "es"
            ? `Tasa de contacto baja: ${contactRate.toFixed(1)}%`
            : `Low contact rate: ${contactRate.toFixed(1)}%`,
        });
        recommendations.push(
          language === "es"
            ? "Revisa tu segmentación y considera usar un servicio de verificación de datos"
            : "Review your segmentation and consider using a data verification service"
        );
      }

      // Meeting rate analysis
      if (meetingRate >= 30) {
        insights.push({
          type: "positive",
          text: language === "es"
            ? `Gran conversión a reuniones: ${meetingRate.toFixed(1)}%`
            : `Great meeting conversion: ${meetingRate.toFixed(1)}%`,
        });
      } else if (meetingRate >= 15) {
        insights.push({
          type: "warning",
          text: language === "es"
            ? `Conversión a reuniones promedio: ${meetingRate.toFixed(1)}%`
            : `Average meeting conversion: ${meetingRate.toFixed(1)}%`,
        });
        recommendations.push(
          language === "es"
            ? "Trabaja en tu pitch inicial - prueba diferentes enfoques de valor"
            : "Work on your initial pitch - test different value approaches"
        );
      } else {
        insights.push({
          type: "negative",
          text: language === "es"
            ? `Baja conversión a reuniones: ${meetingRate.toFixed(1)}%`
            : `Low meeting conversion: ${meetingRate.toFixed(1)}%`,
        });
        recommendations.push(
          language === "es"
            ? "Revisa tu propuesta de valor y practica técnicas de manejo de objeciones"
            : "Review your value proposition and practice objection handling techniques"
        );
      }

      // Close rate analysis
      if (closeRate >= 33) {
        insights.push({
          type: "positive",
          text: language === "es"
            ? `Excelente tasa de cierre: ${closeRate.toFixed(1)}%`
            : `Excellent close rate: ${closeRate.toFixed(1)}%`,
        });
      } else if (closeRate >= 20) {
        insights.push({
          type: "warning",
          text: language === "es"
            ? `Tasa de cierre promedio: ${closeRate.toFixed(1)}%`
            : `Average close rate: ${closeRate.toFixed(1)}%`,
        });
        recommendations.push(
          language === "es"
            ? "Implementa un proceso de seguimiento más estructurado con un CRM"
            : "Implement a more structured follow-up process with a CRM"
        );
      } else {
        insights.push({
          type: "negative",
          text: language === "es"
            ? `Tasa de cierre baja: ${closeRate.toFixed(1)}%`
            : `Low close rate: ${closeRate.toFixed(1)}%`,
        });
        recommendations.push(
          language === "es"
            ? "Califica mejor tus leads antes de las reuniones y trabaja en técnicas de cierre"
            : "Better qualify your leads before meetings and work on closing techniques"
        );
      }

      const score = Math.min(100, Math.round((contactRate * 0.2 + meetingRate * 0.3 + closeRate * 0.5)));

      setResult({ score, insights, recommendations });
      setIsAnalyzing(false);
    }, 1500);
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
          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full ml-auto">
            Demo
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
            <>{language === "es" ? "Analizando..." : "Analyzing..."}</>
          ) : (
            <>
              <BarChart3 className="w-4 h-4 mr-2" />
              {language === "es" ? "Analizar mi embudo" : "Analyze my funnel"}
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4 pt-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {language === "es" ? "Puntuación de rendimiento" : "Performance Score"}
              </p>
              <p className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}/100
              </p>
              <Progress value={result.score} className="mt-2" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">{language === "es" ? "Insights:" : "Insights:"}</p>
              {result.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  {insight.type === "positive" && <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                  {insight.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                  {insight.type === "negative" && <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
                  <span>{insight.text}</span>
                </div>
              ))}
            </div>

            {result.recommendations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {language === "es" ? "Recomendaciones:" : "Recommendations:"}
                </p>
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? "💡 Demo: Análisis basado en reglas. Conecta una API de IA para análisis predictivo."
            : "💡 Demo: Rule-based analysis. Connect an AI API for predictive analytics."}
        </p>
      </CardContent>
    </Card>
  );
};

export default DataAnalyzerDemo;
