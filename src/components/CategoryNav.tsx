import { useState } from "react";
import { LucideIcon } from "lucide-react";
import {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder, Video, Flame, Bot, Cog, DatabaseBackup
} from "lucide-react";
import { categories } from "@/data/tools";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder, Video, Flame, Bot, Cog, DatabaseBackup
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
    <nav className="sticky top-0 z-50 py-2 sm:py-2.5 px-2 sm:px-4 glass-effect border-b border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide -mx-2 px-2">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Folder;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`
                  flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0 text-xs sm:text-sm
                  ${isActive 
                    ? "bg-primary/90 text-primary-foreground shadow-sm" 
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }
                `}
              >
                <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="font-medium">{category.name[language]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
