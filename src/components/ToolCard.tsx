import { ExternalLink, LucideIcon } from "lucide-react";
import {
  Mail, CheckCircle, Inbox, Shield, CheckSquare, Send, Target, TestTube, Rocket,
  Edit3, Sparkles, Wand2, ShoppingBag, GraduationCap, Copy, RefreshCw, FileSearch,
  Shuffle, Type, Hash, Mic, PenLine, TrendingUp, Layers, Server, Key, Brain, Wand,
  User, UserPlus, LineChart, Link
} from "lucide-react";
import type { Tool } from "@/data/tools";

const iconMap: Record<string, LucideIcon> = {
  Mail, CheckCircle, Inbox, Shield, CheckSquare, Send, Target, TestTube, Rocket,
  Edit3, Sparkles, Wand2, ShoppingBag, GraduationCap, Copy, RefreshCw, FileSearch,
  Shuffle, Type, Hash, Mic, PenLine, TrendingUp, Layers, Server, Key, Brain, Wand,
  User, UserPlus, LineChart, Link
};

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const IconComponent = iconMap[tool.icon] || Link;

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-full glass-effect rounded-xl p-5 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1 overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <IconComponent className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {tool.description}
          </p>

          {/* URL Preview */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground/70 font-mono truncate block">
              {new URL(tool.url).hostname}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ToolCard;
