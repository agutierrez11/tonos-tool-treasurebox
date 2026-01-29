import { useState } from "react";
import { LucideIcon, ChevronDown } from "lucide-react";
import {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder, Video, Flame, Bot, Cog, DatabaseBackup
} from "lucide-react";
import { getToolsByCategory, type Category } from "@/data/tools";
import { useLanguage } from "@/contexts/LanguageContext";
import ToolCard from "./ToolCard";

const iconMap: Record<string, LucideIcon> = {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder, Video, Flame, Bot, Cog, DatabaseBackup
};

interface CategorySectionProps {
  category: Category;
  index: number;
}

const CategorySection = ({ category, index }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const categoryTools = getToolsByCategory(category.id);
  const IconComponent = iconMap[category.icon] || Folder;

  if (categoryTools.length === 0) return null;

  return (
    <section
      id={category.id}
      className="scroll-mt-16 sm:scroll-mt-20 md:scroll-mt-24 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Category Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-card/40 hover:bg-card/60 border border-border/30 hover:border-border/50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}
          >
            <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-foreground" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-sm sm:text-base font-semibold text-foreground">
              {category.name[language]}
            </h2>
            <p className="text-xs text-muted-foreground">
              {categoryTools.length} {language === "es" ? "herramientas" : "tools"}
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Tools Grid - Collapsible */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 overflow-hidden transition-all duration-300 ${
          isOpen ? "mt-4 max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {categoryTools.map((tool, toolIndex) => (
          <ToolCard key={tool.id} tool={tool} index={toolIndex} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
