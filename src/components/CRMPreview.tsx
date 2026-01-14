import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CRMPreview = () => {
  const { language } = useLanguage();

  const stats = [
    {
      icon: Users,
      value: "156",
      label: language === "es" ? "Leads Activos" : "Active Leads",
    },
    {
      icon: TrendingUp,
      value: "24.5%",
      label: language === "es" ? "Conversión" : "Conversion",
    },
    {
      icon: BarChart3,
      value: "$847K",
      label: language === "es" ? "Pipeline" : "Pipeline",
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left side - Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {language === "es" ? "CRM Dashboard" : "CRM Dashboard"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {language === "es" 
                        ? "Gestiona leads, pipeline y exporta a Excel" 
                        : "Manage leads, pipeline & export to Excel"
                      }
                    </p>
                  </div>
                </div>

                {/* Mini stats */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <stat.icon className="h-4 w-4 text-primary/70" />
                      <span className="font-semibold text-foreground">{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - CTA */}
              <Link to="/crm">
                <Button size="lg" className="gap-2 w-full lg:w-auto">
                  {language === "es" ? "Ir al CRM" : "Go to CRM"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CRMPreview;
