const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Track = require('./models/Track');
const Album = require('./models/Album');
const Artist = require('./models/Artist');

dotenv.config();

// Harcoded frontend tracks
const tracks = [
  {
    id: 'track-01',
    title: 'Midnight Resonance',
    artist: 'Aetheria',
    album: 'Echoes of Tomorrow',
    audio: '/music/track-01.mp3',
    artwork: '/images/albums/album-01.jpg',
    duration: 0,
    quality: 'Hi-Res',
    genre: 'Synthwave',
    category: 'Drive',
    energy: 'Drive',
    ambientColor: '#6366f1',
    plays: '1,420,500',
    lyrics: [
      { time: 10, text: 'Neon lights reflecting on wet asphalt' },
      { time: 28, text: 'Frequencies colliding in the dark' },
      { time: 48, text: 'We ride through the digital horizon' },
      { time: 72, text: 'Where tomorrow meets the timeless spark' }
    ]
  },
  {
    id: 'track-02',
    title: 'Neon Skyline',
    artist: 'Hyperion Drive',
    album: 'Retrograde Dreams',
    audio: '/music/track-02.mp3',
    artwork: '/images/albums/album-02.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Retrowave',
    category: 'Euphoria',
    energy: 'Euphoria',
    ambientColor: '#a855f7',
    plays: '984,120',
    lyrics: [
      { time: 15, text: 'Skyscrapers touching violet clouds' },
      { time: 35, text: 'Analog warmth in a synthetic world' },
      { time: 60, text: 'Chasing the ghost in the machine' }
    ]
  },
  {
    id: 'track-03',
    title: 'Astral Drift',
    artist: 'Solaris Wave',
    album: 'Cosmic Horizons',
    audio: '/music/track-03.mp3',
    artwork: '/images/albums/album-03.jpg',
    duration: 0,
    quality: 'Hi-Res',
    genre: 'Ambient Chill',
    category: 'Focus',
    energy: 'Focus',
    ambientColor: '#06b6d4',
    plays: '2,110,400',
    lyrics: [
      { time: 12, text: 'Weightless among the stellar dust' },
      { time: 30, text: 'Time stands still in deep resonance' },
      { time: 54, text: 'Breathe in the calm of the cosmos' }
    ]
  },
  {
    id: 'track-04',
    title: 'Quantum Bloom',
    artist: 'Nova Kinetic',
    album: 'Frequency Shift',
    audio: '/music/track-04.mp3',
    artwork: '/images/albums/album-04.jpg',
    duration: 0,
    quality: 'High Quality',
    genre: 'Deep House',
    category: 'Drive',
    energy: 'Drive',
    ambientColor: '#3b82f6',
    plays: '652,890',
    lyrics: [
      { time: 14, text: 'Pulsing rhythm from the core' },
      { time: 38, text: 'Sub-bass waves breaking on the shore' }
    ]
  },
  {
    id: 'track-05',
    title: 'Velvet Horizon',
    artist: 'Kroma & Luna',
    album: 'Dusk till Dawn',
    audio: '/music/track-05.mp3',
    artwork: '/images/albums/album-05.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Lo-Fi Melodic',
    category: 'Chill',
    energy: 'Chill',
    ambientColor: '#ec4899',
    plays: '3,450,000',
    lyrics: [
      { time: 18, text: 'Raindrops tapping on the windowsill' },
      { time: 42, text: 'Tape hiss and golden hour light' }
    ]
  },
  {
    id: 'track-06',
    title: 'Cybernetic Heart',
    artist: 'Vortex Protocol',
    album: 'Neural Network',
    audio: '/music/track-06.mp3',
    artwork: '/images/albums/album-06.jpg',
    duration: 0,
    quality: 'Standard',
    genre: 'Cyberpunk',
    category: 'Late Night',
    energy: 'Late Night',
    ambientColor: '#f59e0b',
    plays: '815,400',
    lyrics: [
      { time: 20, text: 'Overclocked circuits beating fast' },
      { time: 45, text: 'Electric pulse, living in the code' }
    ]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/playback');
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await Track.deleteMany({});
    await Album.deleteMany({});
    await Artist.deleteMany({});
    console.log('Cleared existing library data');

    // Extract unique artists
    const artistNames = [...new Set(tracks.map(t => t.artist))];
    const artistDocs = artistNames.map(name => ({
      _id: `artist-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name,
      coverUrl: '/images/artists/default.jpg'
    }));
    await Artist.insertMany(artistDocs);
    console.log('Artists seeded');

    // Extract unique albums
    const albumNames = [...new Set(tracks.map(t => t.album))];
    const albumDocs = albumNames.map(name => {
      const track = tracks.find(t => t.album === name);
      const artistId = `artist-${track.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      return {
        _id: `album-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: name,
        artistId,
        coverUrl: track.artwork,
        releaseYear: 2024,
        genre: track.genre
      };
    });
    await Album.insertMany(albumDocs);
    console.log('Albums seeded');

    // Map tracks
    const trackDocs = tracks.map(t => {
      const artistId = `artist-${t.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const albumId = `album-${t.album.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      return {
        _id: t.id,
        title: t.title,
        artistId,
        albumId,
        audio: t.audio,
        artwork: t.artwork,
        duration: t.duration,
        quality: t.quality,
        genre: t.genre,
        category: t.category,
        energy: t.energy,
        ambientColor: t.ambientColor,
        plays: t.plays,
        lyrics: t.lyrics || []
      };
    });

    await Track.insertMany(trackDocs);
    console.log('Tracks seeded');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
