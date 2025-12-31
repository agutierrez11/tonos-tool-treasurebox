import { Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { tools, categories } from "@/data/tools";
import ToolSelector from "./ToolSelector";

const Header = () => {
  const { language } = useLanguage();

  return (
    <header className="relative pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-10 md:pb-12 px-4 overflow-hidden">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 right-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Title */}
        <h1 
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up"
        >
          <span className="text-foreground">
            {language === "es" ? "Herramientas" : "Digital Tools"}
          </span>
          <br />
          <span className="text-gradient-primary">
            {language === "es" ? "para Vendedores" : "for Sellers"}
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in px-2 mb-8 sm:mb-10 md:mb-12"
          style={{ animationDelay: '100ms' }}
        >
          {language === "es"
            ? "Potencia tu proceso de ventas con las mejores herramientas digitales"
            : "Power up your sales process with the best digital tools"
          }
        </p>

        {/* Tool Selector */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <ToolSelector />
        </div>

        {/* Stats */}
        <div 
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div className="text-center">
            <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary">{tools.length}+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "es" ? "Herramientas" : "Tools"}
            </div>
          </div>
          <div className="w-px h-8 sm:h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary">{categories.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "es" ? "Categorías" : "Categories"}
            </div>
          </div>
          <div className="w-px h-8 sm:h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {language === "es" ? "Gratuito" : "Free"}
            </div>
          </div>
        </div>

        {/* Decorative Icon */}
        <div className="absolute top-1/2 right-4 lg:right-12 -translate-y-1/2 hidden lg:block animate-float">
          <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow rotate-12">
            <Wrench className="w-8 lg:w-10 h-8 lg:h-10 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
