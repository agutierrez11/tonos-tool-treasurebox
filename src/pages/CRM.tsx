import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CRMDashboard from "@/components/CRMDashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const CRM = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <title>
        {language === "es" 
          ? "CRM Dashboard | Gestión de Leads y Pipeline"
          : "CRM Dashboard | Lead & Pipeline Management"
        }
      </title>
      
      <Header />
      
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {language === "es" ? "Volver al inicio" : "Back to home"}
          </Button>
        </Link>
      </div>
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        <CRMDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default CRM;
