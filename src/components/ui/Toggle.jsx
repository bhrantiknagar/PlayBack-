import React from 'react';

/**
 * Accessible, CSS-based toggle switch that matches the PlayBack dark aesthetic.
 */
export function Toggle({ id, checked, onChange, disabled = false }) {
  return (
    <label
      htmlFor={id}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '42px',
        height: '24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
      {/* Track */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          background: checked ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)',
          border: checked ? '1px solid rgba(99, 102, 241, 0.6)' : '1px solid rgba(255,255,255,0.12)',
          transition: 'background 0.22s ease, border-color 0.22s ease',
          boxShadow: checked ? '0 0 10px rgba(99,102,241,0.3)' : 'none',
        }}
      />
      {/* Thumb */}
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#ffffff',
          transition: 'left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      />
    </label>
  );
}
