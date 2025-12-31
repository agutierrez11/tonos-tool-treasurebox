import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-effect hover:bg-secondary/80 transition-all duration-300 text-sm font-medium"
    >
      <Globe className="w-4 h-4 text-primary" />
      <span className="text-foreground uppercase">{language}</span>
    </button>
  );
};

export default LanguageToggle;
