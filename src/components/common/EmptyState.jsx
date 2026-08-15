import React from 'react';
import { Music, Search, Heart } from 'lucide-react';
import { PrimaryButton } from '../ui/Button';

export function EmptyState({ 
  type = 'default',
  icon: CustomIcon, 
  title, 
  description, 
  actionText, 
  onAction 
}) {
  const getDefaultContent = () => {
    if (type === 'search') {
      return {
        icon: Search,
        title: title || 'Nothing found',
        description: description || 'Try searching for another song, artist, album, or playlist.'
      };
    }
    if (type === 'favorites') {
      return {
        icon: Heart,
        title: title || 'No saved frequencies yet',
        description: description || 'Your liked music will appear here as you listen.'
      };
    }
    return {
      icon: CustomIcon || Music,
      title: title || 'No music here yet',
      description: description || 'Explore curated tracks and add to your collection.'
    };
  };

  const content = getDefaultContent();
  const IconComponent = content.icon;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '56px 20px',
      gap: '14px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-primary)',
        marginBottom: '4px'
      }}>
        <IconComponent size={24} />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{content.title}</h3>
      <p style={{ maxWidth: '380px', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)' }}>{content.description}</p>
      {actionText && onAction && (
        <PrimaryButton onClick={onAction} style={{ marginTop: '6px' }}>
          {actionText}
        </PrimaryButton>
      )}
    </div>
  );
}
