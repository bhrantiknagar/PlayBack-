const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Track = require('./models/Track');
const Album = require('./models/Album');
const Artist = require('./models/Artist');
const connectDB = require('./config/db');

dotenv.config();

// Production Cloudinary Music Tracks
const tracks = [
  {
    id: 'track-01',
    title: 'Siente Dance',
    artist: 'Various Artists',
    album: 'Siente Dance',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790022285/playback/sxzgpwnlxfdvvz9olyck.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790022291/playback/plb3zrqvflwdr7lmv5ln.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Dance / Electronic',
    category: 'Drive',
    energy: 'Drive',
    ambientColor: '#e11d48',
    plays: '1,240,500',
    lyrics: []
  },
  {
    id: 'track-02',
    title: 'Fearless Pt. II',
    artist: 'TULE',
    album: 'Fearless Pt. II',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790022677/playback/puubo2zq1pz4srlo098x.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790022684/playback/gifbx0vuhdurshk6z3sw.jpg',
    duration: 0,
    quality: 'Hi-Res',
    genre: 'Electronic / Trap',
    category: 'Euphoria',
    energy: 'Euphoria',
    ambientColor: '#4f46e5',
    plays: '2,890,100',
    lyrics: []
  },
  {
    id: 'track-03',
    title: 'Funk Sereno',
    artist: 'Various Artists',
    album: 'Funk Sereno',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790022895/playback/hfyk9bkkw3aoxiuauy8p.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790022902/playback/lhu5jxmtiunrftmefznd.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Phonk / Funk',
    category: 'Drive',
    energy: 'Drive',
    ambientColor: '#9333ea',
    plays: '1,840,200',
    lyrics: []
  },
  {
    id: 'track-04',
    title: 'Funk Universo',
    artist: 'Various Artists',
    album: 'Funk Universo',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790023244/playback/ax8qqm4clwery8jxvwzl.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023250/playback/vidvqixcx31shnmatc4z.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Phonk / Funk',
    category: 'Drive',
    energy: 'Drive',
    ambientColor: '#0284c7',
    plays: '2,150,000',
    lyrics: []
  },
  {
    id: 'track-05',
    title: 'Glory (Super Slowed)',
    artist: 'Ogryzek',
    album: 'Glory',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790023416/playback/m00rgyczt5y4aowrga8d.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023426/playback/nhh1i7nods7rdnsqrh9u.jpg',
    duration: 0,
    quality: 'Hi-Res',
    genre: 'Slowed & Reverb',
    category: 'Chill',
    energy: 'Chill',
    ambientColor: '#d97706',
    plays: '3,410,800',
    lyrics: []
  },
  {
    id: 'track-06',
    title: 'Heroes Tonight',
    artist: 'Janji feat. Johnning',
    album: 'Heroes Tonight',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790023601/playback/zmnqm0tfn0tvzzouulzi.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023612/playback/b2oaiqccxumtgkflhk12.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Progressive House',
    category: 'Euphoria',
    energy: 'Euphoria',
    ambientColor: '#10b981',
    plays: '5,120,400',
    lyrics: []
  },
  {
    id: 'track-07',
    title: 'Invincible',
    artist: 'DEAF KEV',
    album: 'Invincible',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790023744/playback/kqxr5blrjc1wiz4cufno.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023758/playback/h0wqxtvzbfgil4kisvur.jpg',
    duration: 0,
    quality: 'Hi-Res',
    genre: 'Dubstep / Electro',
    category: 'Drive',
    energy: 'Drive',
    ambientColor: '#06b6d4',
    plays: '4,890,000',
    lyrics: []
  },
  {
    id: 'track-08',
    title: 'Let Me Love You (Super Slowed)',
    artist: 'DJ Snake / Justin Bieber',
    album: 'Let Me Love You',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790023913/playback/na9urdaxu30b4lrzjceb.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023921/playback/nfm4sz8df1zq0qtdivoj.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Slowed & Reverb',
    category: 'Chill',
    energy: 'Chill',
    ambientColor: '#ec4899',
    plays: '6,210,000',
    lyrics: []
  },
  {
    id: 'track-09',
    title: 'On & On',
    artist: 'Cartoon feat. Daniel Levi',
    album: 'On & On',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790024052/playback/mtozejcfst4waaoot8do.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790024059/playback/csdaokbmm5mq4w14vpnu.jpg',
    duration: 0,
    quality: 'Hi-Res',
    genre: 'Electronic / Pop',
    category: 'Euphoria',
    energy: 'Euphoria',
    ambientColor: '#8b5cf6',
    plays: '7,450,000',
    lyrics: []
  },
  {
    id: 'track-10',
    title: 'Sky High',
    artist: 'Elektronomia',
    album: 'Sky High',
    audio: 'https://res.cloudinary.com/dcmuyht9n/video/upload/v1790024178/playback/xsc1y2qaxfohhy5oafme.mp3',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790024059/playback/csdaokbmm5mq4w14vpnu.jpg',
    duration: 0,
    quality: 'Lossless',
    genre: 'Melodic Electro',
    category: 'Euphoria',
    energy: 'Euphoria',
    ambientColor: '#3b82f6',
    plays: '5,800,000',
    lyrics: []
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await Track.deleteMany({});
    await Album.deleteMany({});
    await Artist.deleteMany({});
    console.log('Cleared existing library data');

    // Extract unique artists
    const artistNames = [...new Set(tracks.map(t => t.artist))];
    const artistDocs = artistNames.map(name => {
      const artistTrack = tracks.find(t => t.artist === name);
      return {
        _id: `artist-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name,
        coverUrl: artistTrack ? artistTrack.artwork : '/images/artists/default.jpg'
      };
    });
    await Artist.insertMany(artistDocs);
    console.log(`Seeded ${artistDocs.length} Artists`);

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
    console.log(`Seeded ${albumDocs.length} Albums`);

    // Map tracks
    const trackDocs = tracks.map(t => {
      const artistId = `artist-${t.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const albumId = `album-${t.album.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      return {
        _id: t.id,
        title: t.title,
        artistId,
        albumId,
        artist: t.artist,
        album: t.album,
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
    console.log(`Seeded ${trackDocs.length} Tracks with Cloudinary URLs`);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
