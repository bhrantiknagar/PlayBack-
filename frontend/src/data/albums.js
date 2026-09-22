import { tracks } from './tracks';

export const albums = [
  {
    id: 'album-siente-dance',
    title: 'Siente Dance',
    artist: 'Various Artists',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790022291/playback/plb3zrqvflwdr7lmv5ln.jpg',
    releaseYear: 2024,
    genre: 'Dance / Electronic',
    description: 'Energetic Latin dance and electronic beats.',
    trackIds: ['track-01'],
    plays: '1,240,500',
    playCountNumber: 1240500,
    addedDate: '2024-03-15',
    ambientColor: '#e11d48'
  },
  {
    id: 'album-fearless-pt-ii',
    title: 'Fearless Pt. II',
    artist: 'TULE',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790022684/playback/gifbx0vuhdurshk6z3sw.jpg',
    releaseYear: 2024,
    genre: 'Electronic / Trap',
    description: 'Iconic melodic trap track with powerful basslines.',
    trackIds: ['track-02'],
    plays: '2,890,100',
    playCountNumber: 2890100,
    addedDate: '2024-04-02',
    ambientColor: '#4f46e5'
  },
  {
    id: 'album-funk-sereno',
    title: 'Funk Sereno',
    artist: 'Various Artists',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790022902/playback/lhu5jxmtiunrftmefznd.jpg',
    releaseYear: 2024,
    genre: 'Phonk / Funk',
    description: 'Smooth Brazilian phonk and sereno drift phonk rhythms.',
    trackIds: ['track-03'],
    plays: '1,840,200',
    playCountNumber: 1840200,
    addedDate: '2024-04-10',
    ambientColor: '#9333ea'
  },
  {
    id: 'album-funk-universo',
    title: 'Funk Universo',
    artist: 'Various Artists',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023250/playback/vidvqixcx31shnmatc4z.jpg',
    releaseYear: 2024,
    genre: 'Phonk / Funk',
    description: 'Cosmic phonk waves and cosmic drift beats.',
    trackIds: ['track-04'],
    plays: '2,150,000',
    playCountNumber: 2150000,
    addedDate: '2024-05-01',
    ambientColor: '#0284c7'
  },
  {
    id: 'album-glory',
    title: 'Glory',
    artist: 'Ogryzek',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023426/playback/nhh1i7nods7rdnsqrh9u.jpg',
    releaseYear: 2024,
    genre: 'Slowed & Reverb',
    description: 'Atmospheric slowed and reverbed phonk vibes.',
    trackIds: ['track-05'],
    plays: '3,410,800',
    playCountNumber: 3410800,
    addedDate: '2024-05-15',
    ambientColor: '#d97706'
  },
  {
    id: 'album-heroes-tonight',
    title: 'Heroes Tonight',
    artist: 'Janji feat. Johnning',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023612/playback/b2oaiqccxumtgkflhk12.jpg',
    releaseYear: 2024,
    genre: 'Progressive House',
    description: 'Legendary melodic progressive house anthem.',
    trackIds: ['track-06'],
    plays: '5,120,400',
    playCountNumber: 5120400,
    addedDate: '2024-06-01',
    ambientColor: '#10b981'
  },
  {
    id: 'album-invincible',
    title: 'Invincible',
    artist: 'DEAF KEV',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023758/playback/h0wqxtvzbfgil4kisvur.jpg',
    releaseYear: 2024,
    genre: 'Dubstep / Electro',
    description: 'High energy electro house classic.',
    trackIds: ['track-07'],
    plays: '4,890,000',
    playCountNumber: 4890000,
    addedDate: '2024-06-10',
    ambientColor: '#06b6d4'
  },
  {
    id: 'album-let-me-love-you',
    title: 'Let Me Love You',
    artist: 'DJ Snake / Justin Bieber',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790023921/playback/nfm4sz8df1zq0qtdivoj.jpg',
    releaseYear: 2024,
    genre: 'Slowed & Reverb',
    description: 'Super slowed melodic pop remix.',
    trackIds: ['track-08'],
    plays: '6,210,000',
    playCountNumber: 6210000,
    addedDate: '2024-07-01',
    ambientColor: '#ec4899'
  },
  {
    id: 'album-on-and-on',
    title: 'On & On',
    artist: 'Cartoon feat. Daniel Levi',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790024059/playback/csdaokbmm5mq4w14vpnu.jpg',
    releaseYear: 2024,
    genre: 'Electronic / Pop',
    description: 'Worldwide hit electronic pop anthem.',
    trackIds: ['track-09'],
    plays: '7,450,000',
    playCountNumber: 7450000,
    addedDate: '2024-07-15',
    ambientColor: '#8b5cf6'
  },
  {
    id: 'album-sky-high',
    title: 'Sky High',
    artist: 'Elektronomia',
    artwork: 'https://res.cloudinary.com/dcmuyht9n/image/upload/v1790024059/playback/csdaokbmm5mq4w14vpnu.jpg',
    releaseYear: 2024,
    genre: 'Melodic Electro',
    description: 'Uplifting melodic electronic masterpiece.',
    trackIds: ['track-10'],
    plays: '5,800,000',
    playCountNumber: 5800000,
    addedDate: '2024-08-01',
    ambientColor: '#3b82f6'
  }
];

export function getAlbumTracks(album) {
  if (!album) return [];
  if (album.trackIds && album.trackIds.length > 0) {
    return tracks.filter(t => album.trackIds.includes(t.id));
  }
  return tracks.filter(t => t.album === album.title);
}
