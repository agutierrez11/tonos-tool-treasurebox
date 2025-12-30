import { useState } from "react";
import { LucideIcon } from "lucide-react";
import {
  Mail, PenTool, BarChart3, Zap, FileText, Search, Image, Users, Folder,
  Flame, Shield, Target, Presentation
} from "lucide-react";
import { categories } from "@/data/tools";

const iconMap: Record<string, LucideIcon> = {
  Mail, PenTool, BarChart3, Zap, FileText, Search, Image, Users, Folder,
  Flame, Shield, Target, Presentation
};

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 py-4 px-4 glass-effect border-b border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Folder;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-glow" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                `}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
