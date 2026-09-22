const Favorite = require('../models/Favorite');
const Playlist = require('../models/Playlist');
const ListeningHistory = require('../models/ListeningHistory');
const User = require('../models/User');

// @desc    Get user data
// @route   GET /api/userdata
// @access  Private
exports.getUserData = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id });
    const playlists = await Playlist.find({ userId: req.user._id });
    const history = await ListeningHistory.find({ userId: req.user._id }).sort('-playedAt').limit(50);
    const user = await User.findById(req.user._id).select('settings');

    res.json({
      favorites: favorites.map(f => f.songId),
      playlists: playlists.map(p => ({
        id: p._id.toString(),
        title: p.name,
        songs: p.songs,
      })),
      history: history,
      settings: user ? (user.settings || {}) : {},
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user data' });
  }
};

// @desc    Sync guest data after login
// @route   POST /api/userdata/sync
// @access  Private
exports.syncUserData = async (req, res) => {
  try {
    const { favorites = [], playlists = [], settings = {} } = req.body;
    
    // 1. Sync Favorites
    for (const songId of favorites) {
      const exists = await Favorite.findOne({ userId: req.user._id, songId });
      if (!exists) {
        await Favorite.create({ userId: req.user._id, songId });
      }
    }

    // 2. Sync Playlists
    // We try to match by name to avoid duplicates if they login again
    for (const pl of playlists) {
      if (pl.id === 'favorites') continue; // handeled natively
      
      const exists = await Playlist.findOne({ userId: req.user._id, name: pl.title });
      if (!exists) {
        await Playlist.create({
          userId: req.user._id,
          name: pl.title,
          songs: pl.songs || []
        });
      }
    }

    // 3. Update Settings if they are populated
    if (Object.keys(settings).length > 0) {
      await User.findByIdAndUpdate(req.user._id, { settings });
    }

    // Return the merged unified state
    await exports.getUserData(req, res);
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ message: 'Server error syncing user data' });
  }
};

// @desc    Toggle favorite
// @route   POST /api/userdata/favorites
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    const existing = await Favorite.findOne({ userId: req.user._id, songId });
    
    if (existing) {
      await existing.deleteOne();
      res.json({ message: 'Removed from favorites', added: false });
    } else {
      await Favorite.create({ userId: req.user._id, songId });
      res.json({ message: 'Added to favorites', added: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error toggling favorite' });
  }
};

// @desc    Create/Update playlist
// @route   POST /api/userdata/playlists
// @access  Private
exports.savePlaylist = async (req, res) => {
  try {
    const { id, title, songs } = req.body;
    if (!title && !id) {
      return res.status(400).json({ message: 'Playlist title is required' });
    }

    let playlist;
    if (id && id !== Date.now().toString()) {
      playlist = await Playlist.findOne({ _id: id, userId: req.user._id }).catch(() => null);
    }

    if (playlist) {
      playlist.name = title || playlist.name;
      if (songs) playlist.songs = songs;
      await playlist.save();
    } else {
      playlist = await Playlist.create({
        userId: req.user._id,
        name: title || 'Untitled Playlist',
        songs: songs || []
      });
    }

    res.json({
      id: playlist._id.toString(),
      title: playlist.name,
      songs: playlist.songs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error saving playlist' });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/userdata/playlists/:id
// @access  Private
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user._id }).catch(() => null);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or not owned by user' });
    }

    await playlist.deleteOne();
    res.json({ message: 'Playlist removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting playlist' });
  }
};

// @desc    Update settings
// @route   PUT /api/userdata/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Settings object is required' });
    }
    await User.findByIdAndUpdate(req.user._id, { settings });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating settings' });
  }
};

// @desc    Add to history
// @route   POST /api/userdata/history
// @access  Private
exports.addToHistory = async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }
    const history = await ListeningHistory.create({ userId: req.user._id, songId });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding to history' });
  }
};
