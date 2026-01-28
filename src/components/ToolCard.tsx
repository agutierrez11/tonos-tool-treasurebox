import { useState } from "react";
import { LucideIcon, Gift, DollarSign } from "lucide-react";
import {
  Mail, MailCheck, MailOpen, MailSearch, Send, Flame, FolderCheck, Thermometer, ListChecks,
  ShieldCheck, CheckCircle, Wrench, Shuffle, RefreshCw, FileText, Lightbulb, Languages,
  Bot, Wand2, Ghost, GraduationCap, FileEdit, PenLine, FileDown, RotateCw, ScanSearch,
  Mic, Hash, Search, TrendingUp, Eye, Globe, Layers, Code, FileSearch, Linkedin, Heart,
  BarChart, Handshake, Target, RefreshCcw, PlayCircle, MessageSquare, Brain, BookOpen,
  Book, Users, UserSearch, Database, LineChart, Map, Phone, Rocket, Building2, Building,
  UserPlus, Compass, Cog, Truck, Headphones, MessageCircle, Zap, Sparkle, Package,
  User, Image, Video, Camera, Palette, Play, Presentation, School, Briefcase, Type, Link,
  Workflow, Chrome, Calendar, Sparkles, PieChart, Star, DatabaseBackup
} from "lucide-react";
import type { Tool, Pricing } from "@/data/tools";
import { useLanguage } from "@/contexts/LanguageContext";
import ToolDetailSheet from "./ToolDetailSheet";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Mail, MailCheck, MailOpen, MailSearch, Send, Flame, FolderCheck, Thermometer, ListChecks,
  ShieldCheck, CheckCircle, Wrench, Shuffle, RefreshCw, FileText, Lightbulb, Languages,
  Bot, Wand2, Ghost, GraduationCap, FileEdit, PenLine, FileDown, RotateCw, ScanSearch,
  Mic, Hash, Search, TrendingUp, Eye, Globe, Layers, Code, FileSearch, Linkedin, Heart,
  BarChart, Handshake, Target, RefreshCcw, PlayCircle, MessageSquare, Brain, BookOpen,
  Book, Users, UserSearch, Database, LineChart, Map, Phone, Rocket, Building2, Building,
  UserPlus, Compass, Cog, Truck, Headphones, MessageCircle, Zap, Sparkle, Package,
  User, Image, Video, Camera, Palette, Play, Presentation, School, Briefcase, Type, Link,
  Workflow, Chrome, Calendar, Sparkles, PieChart, Star, DatabaseBackup
};

const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Link;
};

const pricingColors: Record<Pricing, string> = {
  free: "bg-emerald-500",
  freemium: "bg-amber-500", 
  paid: "bg-rose-500",
};

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const IconComponent = getIcon(tool.icon);
  const { language } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsSheetOpen(true)}
        className="group block w-full text-left"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="relative h-full glass-effect rounded-lg sm:rounded-xl p-3.5 sm:p-5 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1 overflow-hidden">
          {/* Pricing dot indicator */}
          <div 
            className={cn(
              "absolute top-2 right-2 w-2.5 h-2.5 rounded-full",
              pricingColors[tool.pricing]
            )}
            title={tool.pricing}
          />
          
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
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {tool.description[language]}
            </p>
          </div>
        </div>
      </button>
      
      <ToolDetailSheet 
        tool={tool} 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
      />
    </>
  );
};

export default ToolCard;
