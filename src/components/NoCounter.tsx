import { useState, useEffect } from "react";
import { Minus, Plus, RotateCcw, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const NoCounter = () => {
  const { language } = useLanguage();
  const [noCount, setNoCount] = useState(() => {
    const saved = localStorage.getItem('noCounter');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [yesCount, setYesCount] = useState(() => {
    const saved = localStorage.getItem('yesCounter');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('noCounter', noCount.toString());
  }, [noCount]);

  useEffect(() => {
    localStorage.setItem('yesCounter', yesCount.toString());
  }, [yesCount]);

  const incrementNo = () => setNoCount(prev => prev + 1);
  const decrementNo = () => setNoCount(prev => Math.max(0, prev - 1));
  const incrementYes = () => {
    setYesCount(prev => prev + 1);
    setNoCount(0); // Reset NO counter when you get a YES
  };
  const resetAll = () => {
    setNoCount(0);
    setYesCount(0);
  };

  const ratio = yesCount > 0 ? Math.round(noCount / yesCount) : noCount;

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-4">
      <Card className="bg-gradient-to-br from-orange-500/10 via-background to-red-500/10 border-orange-500/30 shadow-lg shadow-orange-500/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Title & Description */}
            <div className="flex items-center gap-3 text-center lg:text-left">
              <div className="p-2 sm:p-3 rounded-xl bg-orange-500/20">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-foreground">
                  {language === "es" ? "Contador de NO → SÍ" : "NO → YES Counter"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {language === "es" 
                    ? "Cada NO te acerca al próximo SÍ" 
                    : "Every NO brings you closer to the next YES"}
                </p>
              </div>
            </div>

            {/* Counters */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* NO Counter */}
              <div className="flex items-center gap-2 bg-red-500/10 rounded-xl p-2 sm:p-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decrementNo}
                  className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 hover:bg-red-500/20"
                >
                  <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div className="text-center min-w-[60px] sm:min-w-[80px]">
                  <div className="text-2xl sm:text-4xl font-bold text-red-500">{noCount}</div>
                  <div className="text-xs text-red-400 font-medium">NO</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={incrementNo}
                  className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 hover:bg-red-500/20"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              {/* Arrow */}
              <div className="text-2xl sm:text-3xl text-muted-foreground">→</div>

              {/* YES Button */}
              <Button 
                onClick={incrementYes}
                className="h-16 sm:h-20 px-4 sm:px-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/25"
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl flex items-center gap-2">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span>{yesCount}</span>
                  </div>
                  <div className="text-xs font-medium opacity-90">
                    {language === "es" ? "¡SÍ!" : "YES!"}
                  </div>
                </div>
              </Button>

              {/* Stats */}
              <div className="hidden sm:flex flex-col items-center bg-secondary/50 rounded-xl p-3 min-w-[80px]">
                <div className="text-lg font-bold text-foreground">
                  {ratio > 0 ? `${ratio}:1` : "0:0"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === "es" ? "Ratio NO/SÍ" : "NO/YES Ratio"}
                </div>
              </div>

              {/* Reset */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={resetAll}
                className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground hover:text-foreground"
                title={language === "es" ? "Reiniciar todo" : "Reset all"}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Motivational Message */}
          {noCount > 0 && (
            <div className="mt-3 sm:mt-4 text-center text-sm text-muted-foreground animate-fade-in">
              {noCount < 5 && (language === "es" ? "¡Sigue adelante! Cada NO es un paso más cerca." : "Keep going! Every NO is one step closer.")}
              {noCount >= 5 && noCount < 10 && (language === "es" ? "🔥 ¡Estás en racha! El SÍ está cerca." : "🔥 You're on a streak! YES is close.")}
              {noCount >= 10 && noCount < 20 && (language === "es" ? "💪 ¡Increíble persistencia! Los mejores vendedores no se rinden." : "💪 Incredible persistence! Top sellers never give up.")}
              {noCount >= 20 && (language === "es" ? "🏆 ¡Leyenda! Tu próximo SÍ será épico." : "🏆 Legend! Your next YES will be epic.")}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default NoCounter;
