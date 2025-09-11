import React, { useEffect, useRef, useState } from 'react';
import { SkipForward } from 'lucide-react';
import { Button } from '../ui/button';
import introVideo from '../../assets/Video.mp4'; // Importa el video desde src/assets

interface VideoIntroProps {
  onVideoEnd: () => void;
}

export function VideoIntro({ onVideoEnd }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);

  // Mostrar botón de saltar después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Escuchar el final del video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', onVideoEnd);
      return () => video.removeEventListener('ended', onVideoEnd);
    }
  }, [onVideoEnd]);

  // Auto-advance después de 10 segundos si no hay video
  useEffect(() => {
    const autoTimer = setTimeout(() => onVideoEnd(), 10000);
    return () => clearTimeout(autoTimer);
  }, [onVideoEnd]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Video real */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <source src={introVideo} type="video/mp4" />
        Tu navegador no soporta el elemento video.
      </video>

      {/* Placeholder animado (si quieres que aparezca sobre el video) */}
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-8 max-w-4xl mx-auto p-8">
          <h1 className="text-6xl font-cinzel font-bold text-gradient-primary mb-4">
            ECO
          </h1>
          <p className="text-2xl text-foreground font-inter leading-relaxed">
            En las profundidades de México, donde las leyendas cobran vida...
          </p>
          <p className="text-xl text-muted-foreground font-inter leading-relaxed">
            Un artefacto ancestral guarda secretos que solo pueden ser revelados
            a través del análisis de datos perdidos en el tiempo.
          </p>
        </div>
      </div>

      {/* Botón de saltar */}
      {showSkip && (
        <div className="absolute top-8 right-8">
          <Button
            onClick={onVideoEnd}
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Saltar Intro
          </Button>
        </div>
      )}
    </div>
  );
}
