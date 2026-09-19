import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Plus, Edit, Trash2, Search, Music2, Disc, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchTracks, fetchAlbums, fetchArtists } from '../api/library';
import * as adminApi from '../api/admin';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('tracks');
  const [items, setItems] = useState({ tracks: [], albums: [], artists: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tracksData, albumsData, artistsData] = await Promise.all([
        fetchTracks(),
        fetchAlbums(),
        fetchArtists()
      ]);
      setItems({ tracks: tracksData, albums: albumsData, artists: artistsData });
    } catch (err) {
      console.error('Error loading library data:', err);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'tracks') {
        if (editingItem) await adminApi.updateTrack(token, editingItem.id, formData);
        else await adminApi.createTrack(token, formData);
      } else if (activeTab === 'albums') {
        if (editingItem) await adminApi.updateAlbum(token, editingItem.id, formData);
        else await adminApi.createAlbum(token, formData);
      } else if (activeTab === 'artists') {
        if (editingItem) await adminApi.updateArtist(token, editingItem.id, formData);
        else await adminApi.createArtist(token, formData);
      }
      
      handleCloseModal();
      loadData(); // Refresh data
    } catch (err) {
      alert('Error saving data: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;
    
    try {
      if (activeTab === 'tracks') await adminApi.deleteTrack(token, id);
      else if (activeTab === 'albums') await adminApi.deleteAlbum(token, id);
      else if (activeTab === 'artists') await adminApi.deleteArtist(token, id);
      
      loadData();
    } catch (err) {
      alert('Error deleting data: ' + err.message);
    }
  };

  const renderTable = () => {
    const currentItems = items[activeTab];

    return (
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-primary)' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px' }}>Title/Name</th>
              {activeTab === 'tracks' && <th style={{ padding: '16px' }}>Artist</th>}
              {activeTab === 'tracks' && <th style={{ padding: '16px' }}>Album</th>}
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{item.title || item.name}</td>
                {activeTab === 'tracks' && <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.artist}</td>}
                {activeTab === 'tracks' && <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.album}</td>}
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => handleOpenModal(item)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeTab === 'tracks' && (
          <>
            <div>
              <label style={labelStyle}>Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} style={inputStyle} required />
            </div>
            {/* The artistId and albumId need to be objectIds in backend, but our mock data used strings. For simplicity in this admin panel, we accept strings and the backend handles them, but ideally we select from a list. To keep it simple per requirements, we will just use string inputs for artistId and albumId or just let them type the ID. */}
            <div>
              <label style={labelStyle}>Artist ID (Starts with artist-)</label>
              <input type="text" name="artistId" value={formData.artistId || ''} onChange={handleChange} style={inputStyle} required placeholder="e.g. artist-nova-kinetic" />
            </div>
            <div>
              <label style={labelStyle}>Album ID (Starts with album-)</label>
              <input type="text" name="albumId" value={formData.albumId || ''} onChange={handleChange} style={inputStyle} required placeholder="e.g. album-frequency-shift" />
            </div>
            <div>
              <label style={labelStyle}>Audio File URL/Path</label>
              <input type="text" name="audio" value={formData.audio || ''} onChange={handleChange} style={inputStyle} required placeholder="/music/track.mp3" />
            </div>
            <div>
              <label style={labelStyle}>Artwork URL</label>
              <input type="text" name="artwork" value={formData.artwork || ''} onChange={handleChange} style={inputStyle} placeholder="/images/albums/cover.jpg" />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Category</label>
                <input type="text" name="category" value={formData.category || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Quality</label>
                <input type="text" name="quality" value={formData.quality || ''} onChange={handleChange} style={inputStyle} placeholder="Hi-Res" />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'albums' && (
          <>
            <div>
              <label style={labelStyle}>Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Artist ID</label>
              <input type="text" name="artistId" value={formData.artistId || ''} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Cover URL</label>
              <input type="text" name="coverUrl" value={formData.coverUrl || ''} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Release Year</label>
                <input type="number" name="releaseYear" value={formData.releaseYear || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Genre</label>
                <input type="text" name="genre" value={formData.genre || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'artists' && (
          <>
            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Cover URL</label>
              <input type="text" name="coverUrl" value={formData.coverUrl || ''} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea name="bio" value={formData.bio || ''} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <SecondaryButton type="button" onClick={handleCloseModal}>Cancel</SecondaryButton>
          <PrimaryButton type="submit">{editingItem ? 'Save Changes' : 'Create'}</PrimaryButton>
        </div>
      </form>
    );
  };

  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' };
  const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '13.5px' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Manage your music library metadata</p>
          </div>
        </div>
        <PrimaryButton icon={Plus} onClick={() => handleOpenModal()}>
          Add {activeTab.slice(0, -1)}
        </PrimaryButton>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {['tracks', 'albums', 'artists'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === tab ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === tab ? '#a5b4fc' : 'var(--text-secondary)',
              border: activeTab === tab ? '1px solid var(--accent-primary)' : '1px solid transparent',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderTable()}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}>
        {renderForm()}
      </Modal>
    </div>
  );
}
