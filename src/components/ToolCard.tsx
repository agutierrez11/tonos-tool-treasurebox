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
import ToolDetailDialog from "./ToolDetailDialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const IconComponent = getIcon(tool.icon);
  const { language } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="group block w-full text-left"
        style={{ animationDelay: `${index * 25}ms` }}
      >
        <div className="relative h-full bg-background rounded-md p-2 sm:p-2.5 transition-all duration-200 hover:shadow-sm hover:border-primary/30 border border-border/40 overflow-hidden">
          {/* Pricing dot indicator */}
          <div 
            className={cn(
              "absolute top-1.5 right-1.5 w-2 h-2 rounded-full",
              pricingColors[tool.pricing]
            )}
            title={tool.pricing}
          />
          
          <div className="relative z-10">
            {/* Compact Header */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="font-medium text-xs text-foreground group-hover:text-primary transition-colors truncate pr-4">
                {tool.name}
              </h3>
            </div>

            {/* Description - single line */}
            <p className="text-[10px] text-muted-foreground leading-tight line-clamp-1 pl-8">
              {tool.description[language]}
            </p>
          </div>
        </div>
      </button>
      
      <ToolDetailDialog 
        tool={tool} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
};

export default ToolCard;
