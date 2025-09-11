import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/use-toast';
import { GameHeader } from './GameHeader';
import { Sidebar } from './Sidebar';
import { ScenarioDisplay } from './ScenarioDisplay';
import { SQLConsole } from './SQLConsole';
import { gameLevels, difficultySettings } from '../../data/gameData';

interface GameMainProps {
  onGameComplete: (stats: { totalTime: number; hintsUsed: number; difficulty: string }) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function GameMain({ onGameComplete, difficulty }: GameMainProps) {
  const { toast } = useToast();
  
  // Estado del juego
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(difficultySettings[difficulty].timeLimit);

  // Obtener nivel y reto actuales
  const currentLevel = gameLevels[currentLevelIndex];
  const currentChallenge = currentLevel.challenges[currentChallengeIndex];

  // Manejar fin de tiempo
  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    toast({
      title: "¡Tiempo agotado!",
      description: "Has perdido el juego. Puedes intentarlo de nuevo.",
      variant: "destructive"
    });
    
    // Reiniciar después de mostrar el mensaje
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, [toast]);

  // Manejar uso de pista
  const handleUseHint = (hintIndex: number) => {
    if (!usedHints.includes(hintIndex)) {
      setUsedHints([...usedHints, hintIndex]);
      setTotalHintsUsed(prev => prev + 1);
      
      toast({
        title: "Pista revelada",
        description: "Pista añadida al panel lateral.",
        variant: "default"
      });
    }
  };

  // Manejar éxito de consulta SQL
  const handleQuerySuccess = () => {
    toast({
      title: "¡Consulta correcta!",
      description: "Has resuelto este reto. Avanzando al siguiente...",
      variant: "default"
    });

    // Avanzar al siguiente reto o nivel
    setTimeout(() => {
      if (currentChallengeIndex < currentLevel.challenges.length - 1) {
        // Siguiente reto en el mismo nivel
        setCurrentChallengeIndex(prev => prev + 1);
        setUsedHints([]); // Limpiar pistas para el nuevo reto
        // Resetear temporizador para el nuevo reto
        setTimeLeft(difficultySettings[difficulty].timeLimit);
      } else if (currentLevelIndex < gameLevels.length - 1) {
        // Siguiente nivel
        setCurrentLevelIndex(prev => prev + 1);
        setCurrentChallengeIndex(0);
        setUsedHints([]); // Limpiar pistas para el nuevo nivel
        // Resetear temporizador para el nuevo nivel
        setTimeLeft(difficultySettings[difficulty].timeLimit);
        
        toast({
          title: `¡Nivel ${currentLevelIndex + 1} completado!`,
          description: `Entrando al ${gameLevels[currentLevelIndex + 1].name}...`,
          variant: "default"
        });
      } else {
        // Juego completado
        const totalTime = Date.now() - startTime;
        onGameComplete({
          totalTime,
          hintsUsed: totalHintsUsed,
          difficulty
        });
      }
    }, 2000);
  };

  // Manejar error de consulta SQL
  const handleQueryError = (error: string) => {
    toast({
      title: "Error en la consulta",
      description: error,
      variant: "destructive"
    });
  };

  return (
    <div className="game-container min-h-screen">
      {/* Header del juego */}
      <GameHeader 
        currentLevel={currentLevelIndex + 1}
        totalLevels={gameLevels.length}
        scenarioName={currentLevel.name}
      />

      <div className="flex gap-6 flex-1">
        {/* Contenido principal */}
        <main className="flex-1 space-y-6">
          {/* Display del escenario */}
          <ScenarioDisplay 
            level={currentLevel}
            challenge={currentChallenge}
          />

          {/* Consola SQL */}
          <SQLConsole
            expectedQuery={currentChallenge.expectedQuery}
            tableName={currentChallenge.table}
            onQuerySuccess={handleQuerySuccess}
            onQueryError={handleQueryError}
          />
        </main>

        {/* Sidebar */}
        <Sidebar
          currentLevel={currentLevel}
          currentChallenge={currentChallenge}
          challengeIndex={currentChallengeIndex}
          timeLeft={timeLeft}
          onTimeUp={handleTimeUp}
          isTimerActive={isTimerActive}
          usedHints={usedHints}
          onUseHint={handleUseHint}
          difficulty={difficulty}
        />
      </div>

      {/* Efectos ambientales */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${10 + Math.random() * 6}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}