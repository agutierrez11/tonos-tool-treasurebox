import { useState } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DEMO_RESPONSES: Record<string, string[]> = {
  es: [
    "¡Hola! Soy tu asistente de ventas virtual. ¿En qué puedo ayudarte hoy?",
    "Basándome en tu pregunta, te recomiendo revisar nuestras herramientas de Email Marketing como Mailchimp o Brevo para automatizar tus campañas.",
    "Para mejorar tu tasa de conversión, considera usar un CRM como HubSpot o Pipedrive para hacer seguimiento de tus leads.",
    "¡Excelente pregunta! El cold calling sigue siendo efectivo si lo combinas con una buena segmentación previa. Te sugiero usar Apollo.io para identificar prospectos.",
    "Para calcular tu ROI en ventas, usa nuestra calculadora de embudo. Necesitas conocer tu tasa de conversión en cada etapa.",
  ],
  en: [
    "Hello! I'm your virtual sales assistant. How can I help you today?",
    "Based on your question, I recommend checking out our Email Marketing tools like Mailchimp or Brevo to automate your campaigns.",
    "To improve your conversion rate, consider using a CRM like HubSpot or Pipedrive to track your leads.",
    "Great question! Cold calling is still effective if you combine it with good prior segmentation. I suggest using Apollo.io to identify prospects.",
    "To calculate your sales ROI, use our funnel calculator. You need to know your conversion rate at each stage.",
  ],
};

const ChatbotDemo = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: DEMO_RESPONSES[language][0],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = DEMO_RESPONSES[language];
      const randomResponse = responses[Math.floor(Math.random() * (responses.length - 1)) + 1];
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="w-5 h-5 text-primary" />
          {language === "es" ? "Chatbot Asistente de Ventas" : "Sales Assistant Chatbot"}
          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full ml-auto">
            Demo
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea className="h-64 rounded-lg border bg-muted/30 p-3">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-background border rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={language === "es" ? "Escribe tu pregunta..." : "Type your question..."}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {language === "es"
            ? "💡 Demo: Las respuestas son simuladas. Conecta una API real para respuestas inteligentes."
            : "💡 Demo: Responses are simulated. Connect a real API for intelligent answers."}
        </p>
      </CardContent>
    </Card>
  );
};

export default ChatbotDemo;
