import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Library } from './pages/Library';
import { PlaylistView } from './pages/PlaylistView';
import { AlbumView } from './pages/AlbumView';
import { ArtistView } from './pages/ArtistView';
import { Favorites } from './pages/Favorites';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="library" element={<Library />} />
        <Route path="album/:id" element={<AlbumView />} />
        <Route path="artist/:id" element={<ArtistView />} />
        <Route path="playlist/:id" element={<PlaylistView />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
