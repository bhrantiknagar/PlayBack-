import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { AdminRoute } from './components/layout/AdminRoute';
import { Loader } from './components/common/Loader';

const Explore = lazy(() => import('./pages/Explore').then(m => ({ default: m.Explore })));
const Library = lazy(() => import('./pages/Library').then(m => ({ default: m.Library })));
const PlaylistView = lazy(() => import('./pages/PlaylistView').then(m => ({ default: m.PlaylistView })));
const AlbumView = lazy(() => import('./pages/AlbumView').then(m => ({ default: m.AlbumView })));
const ArtistView = lazy(() => import('./pages/ArtistView').then(m => ({ default: m.ArtistView })));
const Favorites = lazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

function PageFallback() {
  return (
    <div style={{ padding: '24px 0', width: '100%' }}>
      <Loader count={6} />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
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
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
