import { useState } from "react";
import { LucideIcon } from "lucide-react";
import {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder
} from "lucide-react";
import { categories } from "@/data/tools";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder
};

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { language } = useLanguage();

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 py-2 sm:py-3 md:py-4 px-2 sm:px-4 glass-effect border-b border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Folder;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-glow" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                `}
              >
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">{category.name[language]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
