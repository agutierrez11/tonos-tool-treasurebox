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
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        <CRMDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default CRM;
