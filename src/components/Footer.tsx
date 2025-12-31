import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 sm:py-10 md:py-12 px-4 border-t border-border/50 mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto text-center">
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
