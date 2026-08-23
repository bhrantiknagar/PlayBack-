const Track = require('../models/Track');
const Album = require('../models/Album');
const Artist = require('../models/Artist');

// @desc    Get all tracks
// @route   GET /api/library/tracks
// @access  Public
exports.getTracks = async (req, res) => {
  try {
    const tracks = await Track.find({}).populate('artistId', 'name').populate('albumId', 'title');
    
    // We want to map it to match the old frontend format exactly
    const formatted = tracks.map(t => ({
      id: t._id,
      title: t.title,
      artist: t.artistId ? t.artistId.name : 'Unknown Artist',
      album: t.albumId ? t.albumId.title : 'Unknown Album',
      audio: t.audio,
      artwork: t.artwork,
      duration: t.duration,
      quality: t.quality,
      genre: t.genre,
      category: t.category,
      energy: t.energy,
      ambientColor: t.ambientColor,
      plays: t.plays,
      lyrics: t.lyrics
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tracks' });
  }
};

// @desc    Get single track
// @route   GET /api/library/tracks/:id
// @access  Public
exports.getTrackById = async (req, res) => {
  try {
    const t = await Track.findById(req.params.id).populate('artistId', 'name').populate('albumId', 'title');
    if (!t) return res.status(404).json({ message: 'Track not found' });
    
    const formatted = {
      id: t._id,
      title: t.title,
      artist: t.artistId ? t.artistId.name : 'Unknown Artist',
      album: t.albumId ? t.albumId.title : 'Unknown Album',
      audio: t.audio,
      artwork: t.artwork,
      duration: t.duration,
      quality: t.quality,
      genre: t.genre,
      category: t.category,
      energy: t.energy,
      ambientColor: t.ambientColor,
      plays: t.plays,
      lyrics: t.lyrics
    };
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching track' });
  }
};

// @desc    Get all albums
// @route   GET /api/library/albums
// @access  Public
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({}).populate('artistId', 'name');
    res.json(albums.map(a => ({
      id: a._id,
      title: a.title,
      artist: a.artistId ? a.artistId.name : 'Unknown Artist',
      coverUrl: a.coverUrl,
      releaseYear: a.releaseYear,
      genre: a.genre
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching albums' });
  }
};

// @desc    Get all artists
// @route   GET /api/library/artists
// @access  Public
exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.find({});
    res.json(artists.map(a => ({
      id: a._id,
      name: a.name,
      coverUrl: a.coverUrl,
      bio: a.bio
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching artists' });
  }
};
