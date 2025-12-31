import { categories } from "@/data/tools";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import SalesCalculator from "@/components/SalesCalculator";
import CallFunnelCalculator from "@/components/CallFunnelCalculator";
import EmailFunnelCalculator from "@/components/EmailFunnelCalculator";
import ProspectFunnelCalculator from "@/components/ProspectFunnelCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* SEO Meta */}
      <title>
        {language === "es" 
          ? "Herramientas Digitales | Colección Curada para Marketing y Productividad"
          : "Digital Tools | Curated Collection for Marketing and Productivity"
        }
      </title>
      
      <Header />
      
      {/* Sales Calculator */}
      <SalesCalculator />
      
      {/* Call Funnel Calculator */}
      <CallFunnelCalculator />
      
      {/* Email Funnel Calculator */}
      <EmailFunnelCalculator />
      
      {/* Prospect Funnel Calculator */}
      <ProspectFunnelCalculator />
      
      <CategoryNav />
      
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {categories.map((category, index) => (
            <CategorySection 
              key={category.id} 
              category={category} 
              index={index}
            />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
