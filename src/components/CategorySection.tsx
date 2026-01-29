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
      className="scroll-mt-14 animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Category Header - Compact clickable row */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-card hover:bg-muted/50 border border-border/40 hover:border-border transition-all duration-150 group"
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-md bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-sm text-foreground">
            {category.name[language]}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {categoryTools.length}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Tools Grid - Collapsible */}
      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2 pl-9 animate-fade-in">
          {categoryTools.map((tool, toolIndex) => (
            <ToolCard key={tool.id} tool={tool} index={toolIndex} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
