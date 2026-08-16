import { tracks } from './tracks';
import { albums } from './albums';

/**
 * Dynamically extract and normalize artist profiles from centralized tracks and albums data
 */
export function getArtists() {
  const artistMap = new Map();

  tracks.forEach(track => {
    const artistName = track.artist;
    const slug = artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const trackPlays = parseInt(String(track.plays || '0').replace(/,/g, ''), 10) || 0;

    if (!artistMap.has(artistName)) {
      artistMap.set(artistName, {
        id: slug,
        name: artistName,
        avatar: track.artwork || '/images/albums/album-01.jpg',
        genre: track.genre || 'Electronic',
        ambientColor: track.ambientColor || '#6366f1',
        tracks: [track],
        totalPlays: trackPlays,
        playsFormatted: track.plays || '1.2M'
      });
    } else {
      const item = artistMap.get(artistName);
      item.tracks.push(track);
      item.totalPlays += trackPlays;
    }
  });

  return Array.from(artistMap.values()).map(artist => {
    const artistAlbums = albums.filter(a => a.artist === artist.name);
    return {
      ...artist,
      albums: artistAlbums,
      albumCount: artistAlbums.length,
      trackCount: artist.tracks.length
    };
  });
}

/**
 * Find artist by ID or Name slug
 */
export function getArtistByIdOrName(idOrName) {
  const allArtists = getArtists();
  if (!idOrName) return allArtists[0];

  const decoded = decodeURIComponent(idOrName).toLowerCase().trim();
  const found = allArtists.find(a =>
    a.id === decoded ||
    a.name.toLowerCase() === decoded ||
    a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decoded
  );

  return found || allArtists[0];
}
