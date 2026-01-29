import { categories } from "@/data/tools";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import SalesCalculator from "@/components/SalesCalculator";
import CallFunnelCalculator from "@/components/CallFunnelCalculator";
import EmailFunnelCalculator from "@/components/EmailFunnelCalculator";
import ProspectFunnelCalculator from "@/components/ProspectFunnelCalculator";
import AIAgentsSection from "@/components/AIAgentsSection";
import TimeBlockingStrategy from "@/components/TimeBlockingStrategy";
import NoCounter from "@/components/NoCounter";
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
      
      {/* NO → YES Counter */}
      <NoCounter />
      
      {/* Sales Calculators - Collapsible */}
      <SalesCalculator />
      <CallFunnelCalculator />
      <EmailFunnelCalculator />
      <ProspectFunnelCalculator />
      
      {/* Time Blocking Strategy */}
      <TimeBlockingStrategy />
      
      {/* AI Agents Section */}
      <AIAgentsSection />
      
      {/* Tool Categories Navigation */}
      <CategoryNav />
      
      {/* Tool Categories - Main Content - Compact spacing */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
        <div className="space-y-2">
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
