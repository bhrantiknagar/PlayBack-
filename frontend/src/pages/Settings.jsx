import React from 'react';
import { Settings2, Volume2, Palette, RefreshCw } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Toggle } from '../components/ui/Toggle';

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <Icon size={18} style={{ color: '#a5b4fc' }} />
        <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap',
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', lineHeight: '1.5' }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Settings() {
  const { settings, updateSetting, resetSettings } = useSettings();

  const qualityOptions = ['Standard', 'High', 'Lossless'];

  return (
    <div style={{ padding: '32px 24px 120px', maxWidth: '720px', margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Settings
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Manage your PlayBack preferences. All settings are saved automatically.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Playback ── */}
        <Section icon={Settings2} title="Playback">
          <SettingRow
            label="Autoplay"
            description="Automatically start playing when you open PlayBack."
          >
            <Toggle
              id="setting-autoplay"
              checked={settings.autoplay}
              onChange={(v) => updateSetting('autoplay', v)}
            />
          </SettingRow>

          <SettingRow
            label="Remember playback position"
            description="Resume tracks from where you left off across sessions."
          >
            <Toggle
              id="setting-rememberPosition"
              checked={settings.rememberPosition}
              onChange={(v) => updateSetting('rememberPosition', v)}
            />
          </SettingRow>

          <SettingRow
            label="Confirm before clearing queue"
            description="Show a confirmation dialog before clearing the play queue."
          >
            <Toggle
              id="setting-confirmClearQueue"
              checked={settings.confirmClearQueue}
              onChange={(v) => updateSetting('confirmClearQueue', v)}
            />
          </SettingRow>
        </Section>

        {/* ── Audio ── */}
        <Section icon={Volume2} title="Audio">
          <SettingRow
            label="Default volume"
            description={`Sets the initial volume level on startup. Current: ${settings.defaultVolume}%`}
          >
            <input
              id="setting-defaultVolume"
              type="range"
              min={0}
              max={100}
              step={1}
              value={settings.defaultVolume}
              onChange={(e) => updateSetting('defaultVolume', Number(e.target.value))}
              style={{
                width: '140px',
                accentColor: '#6366f1',
                cursor: 'pointer',
              }}
            />
          </SettingRow>

          <SettingRow
            label="Audio quality preference"
            description="Preferred streaming quality. Hi-Res and Lossless require compatible sources."
          >
            <select
              id="setting-audioQuality"
              value={settings.audioQuality}
              onChange={(e) => updateSetting('audioQuality', e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                padding: '7px 12px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {qualityOptions.map((q) => (
                <option key={q} value={q} style={{ background: '#0e121a' }}>
                  {q}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow
            label="Crossfade"
            description="Smoothly blend between tracks. (UI only — audio engine integration coming soon.)"
          >
            <Toggle
              id="setting-crossfade"
              checked={settings.crossfade}
              onChange={(v) => updateSetting('crossfade', v)}
            />
          </SettingRow>
        </Section>

        {/* ── Appearance ── */}
        <Section icon={Palette} title="Appearance">
          <SettingRow
            label="Compact player"
            description="Use a smaller mini-player bar at the bottom. Saves vertical space."
          >
            <Toggle
              id="setting-compactPlayer"
              checked={settings.compactPlayer}
              onChange={(v) => updateSetting('compactPlayer', v)}
            />
          </SettingRow>

          <SettingRow
            label="Reduced motion"
            description="Disable animations and transitions across the interface."
          >
            <Toggle
              id="setting-reducedMotion"
              checked={settings.reducedMotion}
              onChange={(v) => updateSetting('reducedMotion', v)}
            />
          </SettingRow>
        </Section>

        {/* Reset */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <button
            onClick={resetSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <RefreshCw size={14} />
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
