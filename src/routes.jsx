import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Library } from './pages/Library';
import { PlaylistView } from './pages/PlaylistView';
import { Favorites } from './pages/Favorites';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="library" element={<Library />} />
        <Route path="playlist/:id" element={<PlaylistView />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
