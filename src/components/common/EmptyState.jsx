import React from 'react';
import { Music } from 'lucide-react';
import { Button } from '../ui/Button';

export function EmptyState({ 
  icon: Icon = Music, 
  title = 'Nothing here yet', 
  description = 'Start exploring songs and curate your own audio experience.', 
  actionText, 
  onAction 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '64px 20px',
      gap: '16px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-primary)',
        marginBottom: '8px'
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ maxWidth: '400px', fontSize: '14px', lineHeight: '1.5', color: 'var(--text-muted)' }}>{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} style={{ marginTop: '8px' }}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
