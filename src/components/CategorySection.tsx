import { useState } from "react";
import { LucideIcon, ChevronDown } from "lucide-react";
import {
  Mail, PenTool, BarChart3, Zap, FileText, Search, Image, Users, Folder,
  Flame, Shield, Target, Presentation, Video, BookOpen, Building2, FileSpreadsheet
} from "lucide-react";
import { tools } from "@/data/tools";
import ToolCard from "./ToolCard";

const iconMap: Record<string, LucideIcon> = {
  Mail, PenTool, BarChart3, Zap, FileText, Search, Image, Users, Folder,
  Flame, Shield, Target, Presentation, Video, BookOpen, Building2, FileSpreadsheet
};

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  index: number;
}

const CategorySection = ({ category, index }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const categoryTools = tools.filter((tool) => tool.category === category.id);
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
        className="w-full flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border transition-all duration-300 group"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform`}
          >
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
              {category.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {categoryTools.length} herramienta{categoryTools.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
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
