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
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
 
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
    setAudioFile(null);
    setImageFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'audio') setAudioFile(e.target.files[0]);
      if (type === 'image') setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let finalFormData = { ...formData };

      // Upload Audio if selected
      if (audioFile) {
        const audioRes = await adminApi.uploadFile(token, audioFile, setUploadProgress);
        finalFormData.audio = audioRes.url;
      }

      // Upload Image if selected
      if (imageFile) {
        const imageRes = await adminApi.uploadFile(token, imageFile, setUploadProgress);
        if (activeTab === 'tracks') finalFormData.artwork = imageRes.url;
        else finalFormData.coverUrl = imageRes.url;
      }

      if (activeTab === 'tracks') {
        if (editingItem) await adminApi.updateTrack(token, editingItem.id, finalFormData);
        else await adminApi.createTrack(token, finalFormData);
      } else if (activeTab === 'albums') {
        if (editingItem) await adminApi.updateAlbum(token, editingItem.id, finalFormData);
        else await adminApi.createAlbum(token, finalFormData);
      } else if (activeTab === 'artists') {
        if (editingItem) await adminApi.updateArtist(token, editingItem.id, finalFormData);
        else await adminApi.createArtist(token, finalFormData);
      }
      
      setIsUploading(false);
      handleCloseModal();
      loadData(); // Refresh data
    } catch (err) {
      setIsUploading(false);
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
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} style={inputStyle} required placeholder="e.g. Midnight Resonance" />
            </div>
            <div>
              <label style={labelStyle}>Artist Name</label>
              <input type="text" name="artist" value={formData.artist || ''} onChange={handleChange} style={inputStyle} required placeholder="e.g. Aetheria" />
            </div>
            <div>
              <label style={labelStyle}>Album Name</label>
              <input type="text" name="album" value={formData.album || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Echoes of Tomorrow (or Single)" />
            </div>
            <div>
              <label style={labelStyle}>Audio File (MP3/WAV/FLAC)</label>
              <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} style={inputStyle} />
              {formData.audio && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Current: {formData.audio.substring(0, 40)}...</div>}
            </div>
            <div>
              <label style={labelStyle}>Artwork Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} style={inputStyle} />
              {formData.artwork && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Current: {formData.artwork.substring(0, 40)}...</div>}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Genre / Category</label>
                <input type="text" name="genre" value={formData.genre || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Synthwave" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Audio Quality</label>
                <input type="text" name="quality" value={formData.quality || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Hi-Res, Lossless" />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'albums' && (
          <>
            <div>
              <label style={labelStyle}>Album Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Artist Name</label>
              <input type="text" name="artist" value={formData.artist || ''} onChange={handleChange} style={inputStyle} required placeholder="e.g. Aetheria" />
            </div>
            <div>
              <label style={labelStyle}>Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} style={inputStyle} />
              {formData.coverUrl && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Current: {formData.coverUrl.substring(0, 40)}...</div>}
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
              <label style={labelStyle}>Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} style={inputStyle} />
              {formData.coverUrl && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Current: {formData.coverUrl.substring(0, 40)}...</div>}
            </div>
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea name="bio" value={formData.bio || ''} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
            </div>
          </>
        )}

        {isUploading && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.2s ease' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <SecondaryButton type="button" onClick={handleCloseModal} disabled={isUploading}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={isUploading}>{isUploading ? 'Saving...' : (editingItem ? 'Save Changes' : 'Create')}</PrimaryButton>
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
