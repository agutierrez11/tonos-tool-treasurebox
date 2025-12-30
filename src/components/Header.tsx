import { Wrench, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="relative pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 right-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-effect mb-6 sm:mb-8 animate-fade-in">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            Colección curada de herramientas digitales
          </span>
        </div>

        {/* Title */}
        <h1 
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <span className="text-foreground">Herramientas</span>
          <br />
          <span className="text-gradient-primary">Digitales</span>
        </h1>

        {/* Subtitle */}
        <p 
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in px-2"
          style={{ animationDelay: '200ms' }}
        >
          Una colección organizada de las mejores herramientas para 
          <span className="text-primary"> marketing</span>,
          <span className="text-accent"> productividad</span> y
          <span className="text-primary"> automatización</span>
        </p>

        {/* Stats */}
        <div 
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div className="text-center">
            <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary">95+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Herramientas</div>
          </div>
          <div className="w-px h-8 sm:h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary">16</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Categorías</div>
          </div>
          <div className="w-px h-8 sm:h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Gratuito</div>
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
