import { LucideIcon } from "lucide-react";
import {
  Mail, PenTool, BarChart3, Zap, FileText, Search, Image, Users, Folder
} from "lucide-react";
import { tools } from "@/data/tools";
import ToolCard from "./ToolCard";

const iconMap: Record<string, LucideIcon> = {
  Mail, PenTool, BarChart3, Zap, FileText, Search, Image, Users, Folder
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
  const categoryTools = tools.filter((tool) => tool.category === category.id);
  const IconComponent = iconMap[category.icon] || Folder;

  if (categoryTools.length === 0) return null;

  return (
    <section
      id={category.id}
      className="scroll-mt-24 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {category.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {categoryTools.length} herramienta{categoryTools.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryTools.map((tool, toolIndex) => (
          <ToolCard key={tool.id} tool={tool} index={toolIndex} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
