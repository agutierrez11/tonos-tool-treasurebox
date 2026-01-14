import { Link } from "react-router-dom";
import { BarChart3, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const LeadsPreview = () => {
  const { language } = useLanguage();

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
      <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {language === "es" ? "Dashboard de Leads" : "Leads Dashboard"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "es" 
                    ? "Monitorea y gestiona tus leads por canal" 
                    : "Monitor and manage your leads by channel"}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Link to="/leads" className="flex-1 sm:flex-none">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  {language === "es" ? "Abrir" : "Open"}
                </Button>
              </Link>
              <a 
                href="/leads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button size="sm" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {language === "es" ? "Nueva ventana" : "New window"}
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default LeadsPreview;
