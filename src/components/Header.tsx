import { Wrench, Heart, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { tools, categories } from "@/data/tools";
import ToolSelector from "./ToolSelector";
import authorPhoto from "@/assets/author-profile.png";

const Header = () => {
  const { language } = useLanguage();

  return (
    <header className="relative pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 px-4 overflow-hidden">
      {/* Language Toggle */}
      <div className="absolute top-3 right-3 z-50">
        <LanguageToggle />
      </div>

      {/* Background decorations - lighter for light theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Author Section - Compact */}
        <div className="flex flex-col items-center gap-2 mb-4 sm:mb-6 animate-fade-in">
          <a 
            href="https://www.linkedin.com/in/agjbusiness/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full opacity-40 group-hover:opacity-70 blur-sm transition-all duration-300" />
            <img 
              src={authorPhoto} 
              alt="AGJ Business" 
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm group-hover:scale-105 transition-all duration-300 ring-2 ring-background"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#0077B5] rounded-full flex items-center justify-center shadow-sm">
              <Linkedin className="w-3 h-3 text-white" />
            </div>
          </a>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span className="text-xs sm:text-sm font-medium">
              {language === "es" 
                ? "De vendedor a vendedor" 
                : "From salesperson to salesperson"}
            </span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>

        {/* Title - Compact */}
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 animate-fade-in-up">
          <span className="text-foreground">
            {language === "es" ? "Herramientas " : "Digital Tools "}
          </span>
          <span className="text-gradient-primary">
            {language === "es" ? "para Vendedores" : "for Sellers"}
          </span>
        </h1>

        {/* Subtitle - Compact */}
        <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed animate-fade-in px-2 mb-5">
          {language === "es"
            ? "Potencia tu proceso de ventas con las mejores herramientas digitales"
            : "Power up your sales process with the best digital tools"
          }
        </p>

        {/* Tool Selector */}
        <div className="animate-fade-in">
          <ToolSelector />
        </div>

        {/* Stats - Compact inline */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 animate-fade-in">
          <div className="text-center">
            <div className="font-display text-xl sm:text-2xl font-bold text-primary">{tools.length}+</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {language === "es" ? "Herramientas" : "Tools"}
            </div>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-center">
            <div className="font-display text-xl sm:text-2xl font-bold text-primary">{categories.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {language === "es" ? "Categorías" : "Categories"}
            </div>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-center">
            <div className="font-display text-xl sm:text-2xl font-bold text-primary">100%</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {language === "es" ? "Gratuito" : "Free"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
