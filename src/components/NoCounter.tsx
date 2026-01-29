import { useState, useEffect } from "react";
import { Minus, Plus, RotateCcw, Target, Trophy, Sparkles } from "lucide-react";
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

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
    setNoCount(0);
    
    // Trigger celebration
    setShowCelebration(true);
    
    // Generate random sparkles
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setSparkles(newSparkles);
    
    // Clear celebration after animation
    setTimeout(() => {
      setShowCelebration(false);
      setSparkles([]);
    }, 2000);
  };
  
  const resetAll = () => {
    setNoCount(0);
    setYesCount(0);
  };

  const ratio = yesCount > 0 ? Math.round(noCount / yesCount) : noCount;

  const getMotivationalMessage = () => {
    const messages = language === "es" ? {
      0: "",
      10: "🔥 ¡10 NO! Estás calentando motores. El SÍ está cerca.",
      20: "💪 ¡20 NO! Tu persistencia es admirable. ¡No te rindas!",
      30: "🚀 ¡30 NO! Estás en modo bestia. El próximo podría ser el bueno.",
      40: "⭐ ¡40 NO! Solo los valientes llegan hasta aquí. ¡Sigue adelante!",
      50: "🏆 ¡50 NO! Leyenda en construcción. Tu SÍ será épico.",
      60: "💎 ¡60 NO! Diamante bajo presión. Cada NO te hace más fuerte.",
      70: "🦁 ¡70 NO! Corazón de león. Los grandes vendedores no conocen la rendición.",
      80: "👑 ¡80 NO! Eres royalty de las ventas. El universo te debe un SÍ gigante.",
      90: "🌟 ¡90 NO! Eres una máquina imparable. Tu próximo SÍ cambiará todo.",
      100: "🎯 ¡100 NO! ¡INCREÍBLE! Eres el rey/reina de la persistencia. ¡EL SÍ VIENE EN CAMINO!",
    } : {
      0: "",
      10: "🔥 10 NO! You're warming up. YES is close.",
      20: "💪 20 NO! Your persistence is admirable. Don't give up!",
      30: "🚀 30 NO! Beast mode activated. The next one could be it.",
      40: "⭐ 40 NO! Only the brave get this far. Keep going!",
      50: "🏆 50 NO! Legend in the making. Your YES will be epic.",
      60: "💎 60 NO! Diamond under pressure. Every NO makes you stronger.",
      70: "🦁 70 NO! Heart of a lion. Great sellers never surrender.",
      80: "👑 80 NO! You're sales royalty. The universe owes you a huge YES.",
      90: "🌟 90 NO! You're an unstoppable machine. Your next YES will change everything.",
      100: "🎯 100 NO! INCREDIBLE! You're the king/queen of persistence. YES IS COMING!",
    };

    // Find the appropriate message bracket
    const bracket = Math.min(Math.floor(noCount / 10) * 10, 100);
    return messages[bracket as keyof typeof messages] || "";
  };

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-3 relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Sparkles */}
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="absolute animate-ping"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
              }}
            >
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
          ))}
          
          {/* Central celebration text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl sm:text-8xl font-bold text-green-500 animate-bounce drop-shadow-2xl">
              {language === "es" ? "¡SÍ!" : "YES!"}
            </div>
          </div>
          
          {/* Confetti-like particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
                animation: `fall ${1 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-br from-orange-500/5 via-background to-red-500/5 border-orange-500/20 shadow-md">
        <CardContent className="p-3 sm:p-4">
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
                className="h-16 sm:h-20 px-4 sm:px-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/25 transition-transform hover:scale-105 active:scale-95"
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

          {/* Motivational Message - changes every 10 NOs */}
          {noCount >= 10 && (
            <div className="mt-3 sm:mt-4 text-center text-sm sm:text-base font-medium text-orange-500 animate-fade-in">
              {getMotivationalMessage()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default NoCounter;
