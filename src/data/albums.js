import { tracks } from './tracks';

export const albums = [
  {
    id: 'album-01',
    title: 'Echoes of Tomorrow',
    artist: 'Aetheria',
    artwork: '/images/albums/album-01.jpg',
    releaseYear: 2024,
    genre: 'Synthwave',
    description: 'A cinematic journey through futuristic soundscapes, atmospheric sub-bass, and analog synth warmth.',
    trackIds: ['track-01'],
    plays: '1,420,500',
    playCountNumber: 1420500,
    addedDate: '2024-03-15',
    ambientColor: '#6366f1'
  },
  {
    id: 'album-02',
    title: 'Retrograde Dreams',
    artist: 'Hyperion Drive',
    artwork: '/images/albums/album-02.jpg',
    releaseYear: 2024,
    genre: 'Retrowave',
    description: 'High-octane synth lines meet nostalgic neon dreams and driving rhythmic percussion.',
    trackIds: ['track-02'],
    plays: '984,120',
    playCountNumber: 984120,
    addedDate: '2024-04-02',
    ambientColor: '#a855f7'
  },
  {
    id: 'album-03',
    title: 'Cosmic Horizons',
    artist: 'Solaris Wave',
    artwork: '/images/albums/album-03.jpg',
    releaseYear: 2023,
    genre: 'Ambient Chill',
    description: 'Deep cosmic textures and weightless ambient frequencies engineered for focus and meditation.',
    trackIds: ['track-03'],
    plays: '2,110,400',
    playCountNumber: 2110400,
    addedDate: '2023-11-20',
    ambientColor: '#06b6d4'
  },
  {
    id: 'album-04',
    title: 'Frequency Shift',
    artist: 'Nova Kinetic',
    artwork: '/images/albums/album-04.jpg',
    releaseYear: 2024,
    genre: 'Deep House',
    description: 'Punchy club-ready basslines and rhythmic deep house grooves for high energy drive.',
    trackIds: ['track-04'],
    plays: '652,890',
    playCountNumber: 652890,
    addedDate: '2024-05-10',
    ambientColor: '#3b82f6'
  },
  {
    id: 'album-05',
    title: 'Dusk till Dawn',
    artist: 'Kroma & Luna',
    artwork: '/images/albums/album-05.jpg',
    releaseYear: 2023,
    genre: 'Lo-Fi Melodic',
    description: 'Cozy vinyl crackle, lush guitars, and mellow sunset melodies for late night unwinding.',
    trackIds: ['track-05'],
    plays: '3,450,000',
    playCountNumber: 3450000,
    addedDate: '2023-09-08',
    ambientColor: '#ec4899'
  },
  {
    id: 'album-06',
    title: 'Neural Network',
    artist: 'Vortex Protocol',
    artwork: '/images/albums/album-06.jpg',
    releaseYear: 2024,
    genre: 'Cyberpunk',
    description: 'Overclocked bass synthesizers and relentless digital energy for the connected generation.',
    trackIds: ['track-06'],
    plays: '815,400',
    playCountNumber: 815400,
    addedDate: '2024-06-01',
    ambientColor: '#f59e0b'
  }
];

/**
 * Helper to get tracks belonging to an album
 */
export function getAlbumTracks(album) {
  if (!album) return [];
  if (album.trackIds && album.trackIds.length > 0) {
    return tracks.filter(t => album.trackIds.includes(t.id));
  }
  return tracks.filter(t => t.album === album.title);
}
