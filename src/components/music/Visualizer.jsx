import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export function Visualizer({ height = 28, width = 120, isFull = false }) {
  const { isPlaying, currentTrack, analyserNode } = usePlayer();
  const canvasRef = useRef(null);

  // Persistent animation and audio analysis state
  const stateRef = useRef({
    currentAmp: 0,
    smoothBass: 0,
    smoothMid: 0,
    smoothEnergy: 0,
    phase: 0,
    opacity: 1,
    freqData: null,
    timeData: null
  });

  // Track change subtle cross-fade
  useEffect(() => {
    stateRef.current.opacity = 0.2;
    const timeout = setTimeout(() => {
      stateRef.current.opacity = 1;
    }, 180);
    return () => clearTimeout(timeout);
  }, [currentTrack?.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = width;
      const displayHeight = height;

      // Handle HiDPI scaling
      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      let realAudioEnergy = 0;
      let bassEnergy = 0;
      let midEnergy = 0;
      let freqArray = null;
      let timeArray = null;

      // Extract real audio frequency and time-domain data from AnalyserNode
      if (analyserNode && isPlaying) {
        if (!stateRef.current.freqData || stateRef.current.freqData.length !== analyserNode.frequencyBinCount) {
          stateRef.current.freqData = new Uint8Array(analyserNode.frequencyBinCount);
        }
        if (!stateRef.current.timeData || stateRef.current.timeData.length !== analyserNode.fftSize) {
          stateRef.current.timeData = new Uint8Array(analyserNode.fftSize);
        }

        analyserNode.getByteFrequencyData(stateRef.current.freqData);
        analyserNode.getByteTimeDomainData(stateRef.current.timeData);

        freqArray = stateRef.current.freqData;
        timeArray = stateRef.current.timeData;

        // Sub-bass & Bass energy (bins 1 to 12)
        let bassSum = 0;
        const bassEnd = Math.min(12, freqArray.length);
        for (let i = 1; i < bassEnd; i++) {
          bassSum += freqArray[i];
        }
        bassEnergy = (bassSum / (bassEnd - 1 || 1)) / 255;

        // Mid energy (bins 13 to 48)
        let midSum = 0;
        const midEnd = Math.min(48, freqArray.length);
        for (let i = 13; i < midEnd; i++) {
          midSum += freqArray[i];
        }
        midEnergy = (midSum / (midEnd - 13 || 1)) / 255;

        // Overall active audio energy (weighted)
        let totalSum = 0;
        const audibleLimit = Math.min(64, freqArray.length);
        for (let i = 1; i < audibleLimit; i++) {
          totalSum += freqArray[i];
        }
        realAudioEnergy = (totalSum / (audibleLimit - 1 || 1)) / 255;
      }

      const state = stateRef.current;

      // Smooth audio analysis parameters
      state.smoothBass += (bassEnergy - state.smoothBass) * 0.16;
      state.smoothMid += (midEnergy - state.smoothMid) * 0.16;
      state.smoothEnergy += (realAudioEnergy - state.smoothEnergy) * 0.16;

      // Target amplitude: when playing and active audio present, scale gracefully; when paused/silent, decay smoothly
      const hasAudio = realAudioEnergy > 0.01;
      const targetAmp = (isPlaying && hasAudio)
        ? Math.min(1.0, 0.22 + state.smoothEnergy * 1.1 + state.smoothBass * 0.35)
        : (isPlaying ? 0.08 : 0);

      // Smooth amplitude transition
      state.currentAmp += (targetAmp - state.currentAmp) * (isPlaying ? 0.14 : 0.08);
      const amp = state.currentAmp;

      // Draw subtle, elegant audio wave
      ctx.globalAlpha = state.opacity;

      const trackColor = currentTrack?.ambientColor || '#6366f1';
      const gradient = ctx.createLinearGradient(0, 0, displayWidth, 0);
      gradient.addColorStop(0, `${trackColor}55`);
      gradient.addColorStop(0.2, trackColor);
      gradient.addColorStop(0.8, '#a5b4fc');
      gradient.addColorStop(1, `${trackColor}55`);

      const points = isFull ? 48 : 32;
      const sliceWidth = displayWidth / points;

      // When resting/silent and amplitude is virtually 0, draw still calm resting line
      if (amp < 0.005) {
        ctx.beginPath();
        ctx.lineWidth = isFull ? 1.5 : 1;
        ctx.strokeStyle = `${trackColor}44`;
        ctx.moveTo(0, displayHeight / 2);
        ctx.lineTo(displayWidth, displayHeight / 2);
        ctx.stroke();
      } else {
        // Render Under-Glow Layer for full visualizer
        if (isFull) {
          ctx.beginPath();
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.strokeStyle = `${trackColor}33`;

          for (let i = 0; i <= points; i++) {
            const x = i * sliceWidth;
            const norm = i / points;
            const envelope = Math.pow(Math.sin(norm * Math.PI), 1.15);

            let freqMod = 0;
            let timeMod = 0;
            if (freqArray && timeArray && isPlaying) {
              const binIdx = Math.min(Math.floor(norm * 44), freqArray.length - 1);
              freqMod = (freqArray[binIdx] / 255) * 0.5;
              const timeIdx = Math.min(Math.floor(norm * 128), timeArray.length - 1);
              timeMod = ((timeArray[timeIdx] - 128) / 128) * 0.4;
            }

            const w1 = Math.sin(state.phase + norm * Math.PI * 2.8 + timeMod) * (0.65 + freqMod);
            const w2 = Math.sin(state.phase * 1.45 + norm * Math.PI * 4.6) * (0.35 + state.smoothMid * 0.4);
            const totalWave = (w1 + w2) * envelope * amp * (displayHeight * 0.42);
            const y = displayHeight / 2 + totalWave;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              const prevX = (i - 1) * sliceWidth;
              const cpX = (prevX + x) / 2;
              ctx.quadraticCurveTo(cpX, y, x, y);
            }
          }
          ctx.stroke();
        }

        // Render Primary Crisp Wave
        ctx.beginPath();
        ctx.lineWidth = isFull ? 2 : 1.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = gradient;

        for (let i = 0; i <= points; i++) {
          const x = i * sliceWidth;
          const norm = i / points;
          // Pinned smooth envelope (0 at borders, 1 at center)
          const envelope = Math.pow(Math.sin(norm * Math.PI), 1.15);

          let freqMod = 0;
          let timeMod = 0;
          if (freqArray && timeArray && isPlaying) {
            const binIdx = Math.min(Math.floor(norm * 44), freqArray.length - 1);
            freqMod = (freqArray[binIdx] / 255) * 0.55;
            const timeIdx = Math.min(Math.floor(norm * 128), timeArray.length - 1);
            timeMod = ((timeArray[timeIdx] - 128) / 128) * 0.45;
          }

          // Harmonic wave formula modulated by real frequencies, time domain and bass
          const w1 = Math.sin(state.phase + norm * Math.PI * 2.8 + timeMod) * (0.65 + freqMod);
          const w2 = Math.sin(state.phase * 1.45 + norm * Math.PI * 4.6) * (0.35 + state.smoothMid * 0.45);
          const w3 = Math.cos(state.phase * 0.75 + norm * Math.PI * 1.6) * (0.15 + state.smoothBass * 0.35);

          const totalWave = (w1 + w2 + w3) * envelope * amp * (displayHeight * 0.40);
          const y = displayHeight / 2 + totalWave;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = (i - 1) * sliceWidth;
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(cpX, y, x, y);
          }
        }
        ctx.stroke();
      }

      ctx.restore();

      // Phase progression reacts dynamically to music tempo & energy
      const speed = isPlaying
        ? (0.02 + state.smoothEnergy * 0.035 + state.smoothBass * 0.025)
        : (0.004 * (state.currentAmp > 0.01 ? 1 : 0));
      state.phase += speed;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isFull, analyserNode, width, height, currentTrack?.ambientColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'block',
        transition: 'opacity 0.2s ease'
      }}
      aria-hidden="true"
    />
  );
}
