import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Check } from 'lucide-react';

export function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await updateProfile({ name: newName });
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {/* Header Area */}
        <div style={{
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-md)'
          }}>
            {getInitials(user.name)}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{user.name}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '32px' }}>
          {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '4px' }}>{error}</div>}
          {successMsg && <div style={{ color: '#10b981', marginBottom: '16px', fontSize: '14px', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '4px' }}>{successMsg}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Display Name Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Display Name
              </label>
              {isEditing ? (
                <form onSubmit={handleSave} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isLoading ? 'Saving...' : <><Check size={16} /> Save</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setNewName(user.name);
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '16px' }}>{user.name}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Email Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> Email Address
              </label>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                {user.email}
              </div>
            </div>

            {/* Join Date Section */}
            {user.createdAt && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} /> Member Since
                </label>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                  {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background var(--transition-fast)'
              }}
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
