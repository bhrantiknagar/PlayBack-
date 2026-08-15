import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export function Visualizer({ height = 36, width, isFull = false }) {
  const { isPlaying, visualizerMode } = usePlayer();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (visualizerMode === 'wave') {
        // Sinusoidal Cyber Waveform
        ctx.beginPath();
        ctx.lineWidth = isFull ? 3 : 2;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#6366f1');
        grad.addColorStop(1, '#ec4899');
        ctx.strokeStyle = grad;

        const sliceWidth = w / 40;
        let x = 0;

        for (let i = 0; i <= 40; i++) {
          const amplitude = isPlaying ? Math.sin(phase + i * 0.3) * (h * 0.38) : Math.sin(i * 0.2) * 2;
          const y = h / 2 + amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();

      } else if (visualizerMode === 'particles') {
        // Cosmic Particle Field
        const count = isFull ? 28 : 12;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + phase * 0.5;
          const radius = (isPlaying ? Math.sin(phase * 1.5 + i) * 0.25 + 0.5 : 0.3) * (h * 0.45);
          const px = w / 2 + Math.cos(angle) * radius * (w / h);
          const py = h / 2 + Math.sin(angle) * radius;

          ctx.beginPath();
          ctx.arc(px, py, isFull ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#6366f1' : '#ec4899';
          ctx.shadowBlur = isPlaying ? 10 : 0;
          ctx.shadowColor = '#6366f1';
          ctx.fill();
        }

      } else {
        // Multi-frequency Spectrum Bars (Default / Bars)
        const barCount = isFull ? 32 : 14;
        const barWidth = Math.max(2, (w - (barCount - 1) * 3) / barCount);

        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 3);
          const wave = Math.sin(phase + i * 0.45) * Math.cos(phase * 0.8 + i * 0.2);
          const barH = isPlaying 
            ? Math.max(4, ((wave + 1) / 2) * (h * 0.88)) 
            : 3;
          const y = h - barH;

          const barGrad = ctx.createLinearGradient(0, y, 0, h);
          barGrad.addColorStop(0, '#ec4899');
          barGrad.addColorStop(0.5, '#a855f7');
          barGrad.addColorStop(1, '#6366f1');

          ctx.fillStyle = barGrad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barH, [2, 2, 0, 0]);
          ctx.fill();
        }
      }

      phase += isPlaying ? 0.08 : 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, visualizerMode, isFull]);

  return (
    <canvas
      ref={canvasRef}
      width={width || (isFull ? 380 : 110)}
      height={height}
      style={{
        display: 'block',
        borderRadius: '6px'
      }}
    />
  );
}
