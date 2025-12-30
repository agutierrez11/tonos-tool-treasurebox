import { categories } from "@/data/tools";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* SEO Meta */}
      <title>Herramientas Digitales | Colección Curada para Marketing y Productividad</title>
      
      <Header />
      <CategoryNav />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-16">
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
