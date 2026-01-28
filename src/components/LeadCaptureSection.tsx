import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeadCaptureSection = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const content = {
    es: {
      badge: "🚀 Recursos Exclusivos",
      title: "Potencia tu Productividad",
      subtitle: "Únete a nuestra comunidad y recibe herramientas, estrategias y recursos exclusivos directamente en tu correo.",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@email.com",
      messagePlaceholder: "¿Qué desafío de productividad quieres resolver? (opcional)",
      cta: "Quiero Acceso",
      sending: "Enviando...",
      successTitle: "¡Bienvenido!",
      successMessage: "Pronto recibirás recursos exclusivos en tu correo.",
      benefits: [
        "Acceso a herramientas premium",
        "Estrategias de ventas probadas",
        "Plantillas y recursos descargables"
      ]
    },
    en: {
      badge: "🚀 Exclusive Resources",
      title: "Boost Your Productivity",
      subtitle: "Join our community and receive exclusive tools, strategies, and resources directly in your inbox.",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@email.com",
      messagePlaceholder: "What productivity challenge do you want to solve? (optional)",
      cta: "Get Access",
      sending: "Sending...",
      successTitle: "Welcome!",
      successMessage: "You'll receive exclusive resources in your inbox soon.",
      benefits: [
        "Access to premium tools",
        "Proven sales strategies",
        "Downloadable templates and resources"
      ]
    }
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío para la vista previa
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    toast({
      title: t.successTitle,
      description: t.successMessage,
    });
    
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left column - Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {t.badge}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {t.title}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.subtitle}
            </p>
            
            <ul className="space-y-3">
              {t.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right column - Form */}
          <Card className="relative backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg" />
            
            <CardHeader className="relative text-center pb-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {language === "es" ? "Acceso Gratuito" : "Free Access"}
              </CardTitle>
              <CardDescription>
                {language === "es" 
                  ? "Sin spam, solo valor. Cancela cuando quieras."
                  : "No spam, just value. Unsubscribe anytime."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{t.successTitle}</h3>
                  <p className="text-muted-foreground">{t.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder={t.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-background/50 min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t.cta}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureSection;
