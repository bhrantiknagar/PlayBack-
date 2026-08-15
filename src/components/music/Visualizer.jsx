import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export function Visualizer({ height = 28, width = 120, isFull = false }) {
  const { isPlaying, currentTrack } = usePlayer();
  const canvasRef = useRef(null);

  // Animated amplitude target for smooth settling when paused
  const animState = useRef({
    currentAmp: 0.1,
    phase: 0,
    opacity: 1
  });

  // Track change subtle fade trigger
  useEffect(() => {
    animState.current.opacity = 0.2;
    const timeout = setTimeout(() => {
      animState.current.opacity = 1;
    }, 150);
    return () => clearTimeout(timeout);
  }, [currentTrack?.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const targetAmp = isPlaying ? 1 : 0.06;
      // Smooth interpolation for gentle settling
      animState.current.currentAmp += (targetAmp - animState.current.currentAmp) * 0.05;
      const amp = animState.current.currentAmp;

      // Clean, solid audio waveform
      ctx.save();
      ctx.globalAlpha = animState.current.opacity;
      ctx.beginPath();
      ctx.lineWidth = isFull ? 2 : 1.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#6366f1';

      const points = 32;
      const sliceWidth = w / points;

      for (let i = 0; i <= points; i++) {
        const x = i * sliceWidth;
        const norm = i / points;
        // Envelope so edges stay pinned to baseline
        const envelope = Math.sin(norm * Math.PI);
        
        // Multi-frequency gentle undulating wave
        const wave1 = Math.sin(animState.current.phase + norm * Math.PI * 2.5);
        const wave2 = Math.sin(animState.current.phase * 1.3 + norm * Math.PI * 4) * 0.35;
        const totalWave = (wave1 + wave2) * envelope * amp * (h * 0.38);

        const y = h / 2 + totalWave;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Smooth bezier curve through points
          const prevX = (i - 1) * sliceWidth;
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(cpX, y, x, y);
        }
      }

      ctx.stroke();
      ctx.restore();

      // Slow down phase increment when paused
      animState.current.phase += isPlaying ? 0.035 : 0.004;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isFull]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
        transition: 'opacity 0.3s ease'
      }}
      aria-hidden="true"
    />
  );
}
