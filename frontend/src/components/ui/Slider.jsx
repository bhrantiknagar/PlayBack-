import React from 'react';

export function Slider({ value, min = 0, max = 100, step = 1, onChange, className = '' }) {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', height: '14px' }} className={className}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          background: `linear-gradient(to right, #6366f1 ${percentage}%, rgba(255, 255, 255, 0.15) ${percentage}%)`,
          height: '4px',
          borderRadius: '4px',
          outline: 'none',
          cursor: 'pointer',
          transition: 'height 0.15s ease'
        }}
      />
    </div>
  );
}
