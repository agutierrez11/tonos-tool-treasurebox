import { Heart, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import authorPhoto from "@/assets/author-profile.png";

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="py-8 sm:py-10 md:py-12 px-4 border-t border-border/50 mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Author Section */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <a 
            href="https://www.linkedin.com/in/agjbusiness/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <img 
              src={authorPhoto} 
              alt="AGJ Business" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform ring-2 ring-primary/20"
            />
          </a>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span className="text-sm sm:text-base font-medium">
              {language === "es" 
                ? "Hecho con el Corazón, de vendedor a vendedor" 
                : "Made with Heart, from salesperson to salesperson"}
            </span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          </div>
          <a 
            href="https://www.linkedin.com/in/agjbusiness/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            @agjbusiness
          </a>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-3 text-sm text-muted-foreground">
            <a 
              href="mailto:antoniogtzjimenez@gmail.com" 
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              antoniogtzjimenez@gmail.com
            </a>
            <a 
              href="tel:+528331aborNumber" 
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              +52 833 000 0000
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
          <span>{t.footer.madeWith}</span>
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500 animate-pulse" />
          <span>{t.footer.forProductivity}</span>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground/70 px-4">
          {t.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
