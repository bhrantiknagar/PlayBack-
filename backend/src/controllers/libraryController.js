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

// @desc    Get single album
// @route   GET /api/library/albums/:id
// @access  Public
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artistId', 'name');
    if (!album) return res.status(404).json({ message: 'Album not found' });
    
    const tracks = await Track.find({ albumId: req.params.id }).populate('artistId', 'name').populate('albumId', 'title');
    
    const formattedTracks = tracks.map(t => ({
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
    
    res.json({
      id: album._id,
      title: album.title,
      artist: album.artistId ? album.artistId.name : 'Unknown Artist',
      coverUrl: album.coverUrl,
      artwork: album.coverUrl, // For backward compatibility
      releaseYear: album.releaseYear,
      genre: album.genre,
      tracks: formattedTracks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching album' });
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

// @desc    Get single artist
// @route   GET /api/library/artists/:id
// @access  Public
exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    
    const albums = await Album.find({ artistId: req.params.id }).populate('artistId', 'name');
    const tracks = await Track.find({ artistId: req.params.id }).populate('artistId', 'name').populate('albumId', 'title');
    
    const formattedAlbums = albums.map(a => ({
      id: a._id,
      title: a.title,
      artist: a.artistId ? a.artistId.name : 'Unknown Artist',
      coverUrl: a.coverUrl,
      artwork: a.coverUrl, // For backward compatibility
      releaseYear: a.releaseYear,
      genre: a.genre
    }));

    const formattedTracks = tracks.map(t => ({
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
    
    res.json({
      id: artist._id,
      name: artist.name,
      coverUrl: artist.coverUrl,
      avatar: artist.coverUrl, // For backward compatibility
      bio: artist.bio,
      albums: formattedAlbums,
      tracks: formattedTracks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching artist' });
  }
};

// ==========================================
// ADMIN CRUD OPERATIONS
// ==========================================

const generateId = (prefix, name) => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${prefix}-${cleanName}-${Date.now().toString().slice(-4)}`;
};

// @desc    Create Track
// @route   POST /api/library/tracks
// @access  Private/Admin
exports.createTrack = async (req, res) => {
  try {
    const newTrack = await Track.create({
      _id: generateId('track', req.body.title),
      ...req.body
    });
    res.status(201).json(newTrack);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating track' });
  }
};

// @desc    Update Track
// @route   PUT /api/library/tracks/:id
// @access  Private/Admin
exports.updateTrack = async (req, res) => {
  try {
    const updatedTrack = await Track.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrack) return res.status(404).json({ message: 'Track not found' });
    res.json(updatedTrack);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating track' });
  }
};

// @desc    Delete Track
// @route   DELETE /api/library/tracks/:id
// @access  Private/Admin
exports.deleteTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    await track.deleteOne();
    res.json({ message: 'Track removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting track' });
  }
};

// @desc    Create Album
// @route   POST /api/library/albums
// @access  Private/Admin
exports.createAlbum = async (req, res) => {
  try {
    const newAlbum = await Album.create({
      _id: generateId('album', req.body.title),
      ...req.body
    });
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating album' });
  }
};

// @desc    Update Album
// @route   PUT /api/library/albums/:id
// @access  Private/Admin
exports.updateAlbum = async (req, res) => {
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAlbum) return res.status(404).json({ message: 'Album not found' });
    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating album' });
  }
};

// @desc    Delete Album
// @route   DELETE /api/library/albums/:id
// @access  Private/Admin
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    await album.deleteOne();
    res.json({ message: 'Album removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting album' });
  }
};

// @desc    Create Artist
// @route   POST /api/library/artists
// @access  Private/Admin
exports.createArtist = async (req, res) => {
  try {
    const newArtist = await Artist.create({
      _id: generateId('artist', req.body.name),
      ...req.body
    });
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating artist' });
  }
};

// @desc    Update Artist
// @route   PUT /api/library/artists/:id
// @access  Private/Admin
exports.updateArtist = async (req, res) => {
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedArtist) return res.status(404).json({ message: 'Artist not found' });
    res.json(updatedArtist);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating artist' });
  }
};

// @desc    Delete Artist
// @route   DELETE /api/library/artists/:id
// @access  Private/Admin
exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    await artist.deleteOne();
    res.json({ message: 'Artist removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting artist' });
  }
};
