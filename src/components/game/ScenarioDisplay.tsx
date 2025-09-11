import React from 'react';
import { Eye, BookOpen } from 'lucide-react';
import { Level, Challenge } from '../../data/gameData';
import casaBrujasImg from '../../assets/casa-brujas.jpg';
import xtabayForestImg from '../../assets/xtabay-forest.jpg';
import islaMunecasImg from '../../assets/isla-munecas.jpg';

interface ScenarioDisplayProps {
  level: Level;
  challenge: Challenge;
}

export function ScenarioDisplay({ level, challenge }: ScenarioDisplayProps) {
  // Obtener imagen del escenario basada en el nivel
  const getScenarioImage = (levelId: number) => {
    const scenarios = {
      1: casaBrujasImg,
      2: xtabayForestImg,
      3: islaMunecasImg
    };
    return scenarios[levelId as keyof typeof scenarios];
  };

  return (
    <div className="mystery-card overflow-hidden">
      {/* Imagen del Escenario */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={getScenarioImage(level.id)}
          alt={level.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
        
        {/* Título superpuesto */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl font-cinzel font-bold text-gradient-primary mb-2">
            {level.name}
          </h1>
          <p className="text-lg text-foreground/90 font-inter">
            {level.description}
          </p>
        </div>
        
        {/* Efectos de partículas flotantes */}
        <div className="floating-particles">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Información del Reto Actual */}
      <div className="p-6 space-y-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
            <Eye className="w-6 h-6 text-secondary" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-cinzel font-semibold text-secondary">
              {challenge.title}
            </h2>
            <p className="text-muted-foreground font-inter leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>
        
        {/* Indicador de dificultad */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tabla objetivo:</span>
            <code className="text-sm font-mono bg-primary/10 text-primary px-2 py-1 rounded">
              {challenge.table}
            </code>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            challenge.difficulty === 'easy' 
              ? 'bg-secondary/20 text-secondary' 
              : challenge.difficulty === 'medium'
              ? 'bg-accent/20 text-accent'
              : 'bg-destructive/20 text-destructive'
          }`}>
            {challenge.difficulty === 'easy' ? 'Fácil' : 
             challenge.difficulty === 'medium' ? 'Medio' : 'Difícil'}
          </div>
        </div>
      </div>
    </div>
  );
}