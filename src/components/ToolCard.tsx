import { ExternalLink, LucideIcon } from "lucide-react";
import {
  Mail, CheckCircle, Inbox, Shield, CheckSquare, Send, Target, TestTube, Rocket,
  Edit3, Sparkles, Wand2, ShoppingBag, GraduationCap, Copy, RefreshCw, FileSearch,
  Shuffle, Type, Hash, Mic, PenLine, TrendingUp, Layers, Server, Key, Brain, Wand,
  User, UserPlus, LineChart, Link, Search, Flame, ThermometerSun, Zap, MessageSquare,
  BookOpen, ScanSearch, Languages, RotateCw, Calculator, Wrench, ShoppingCart, GitCompare,
  MessageCircle, Paintbrush, Database, AtSign, Phone, MapPin, Bot, Moon, Settings,
  Linkedin, Combine, Users, Layout, Presentation, FileText, AlertTriangle
} from "lucide-react";
import type { Tool } from "@/data/tools";

const iconMap: Record<string, LucideIcon> = {
  Mail, CheckCircle, Inbox, Shield, CheckSquare, Send, Target, TestTube, Rocket,
  Edit3, Sparkles, Wand2, ShoppingBag, GraduationCap, Copy, RefreshCw, FileSearch,
  Shuffle, Type, Hash, Mic, PenLine, TrendingUp, Layers, Server, Key, Brain, Wand,
  User, UserPlus, LineChart, Link, Search, Flame, ThermometerSun, Zap, MessageSquare,
  BookOpen, ScanSearch, Languages, RotateCw, Calculator, Wrench, ShoppingCart, GitCompare,
  MessageCircle, Paintbrush, Database, AtSign, Phone, MapPin, Bot, Moon, Settings,
  Linkedin, Combine, Users, Layout, Presentation, FileText, AlertTriangle
};

// Fallback for icons not in lucide
const getIcon = (iconName: string): LucideIcon => {
  if (iconName === "Atom") return Sparkles;
  return iconMap[iconName] || Link;
};

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const IconComponent = getIcon(tool.icon);

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-full glass-effect rounded-lg sm:rounded-xl p-3.5 sm:p-5 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1 overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate">
                {tool.name}
              </h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ml-2" />
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
            {tool.description}
          </p>

          {/* URL Preview */}
          <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-border/50">
            <span className="text-[10px] sm:text-xs text-muted-foreground/70 font-mono truncate block">
              {new URL(tool.url).hostname}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ToolCard;
