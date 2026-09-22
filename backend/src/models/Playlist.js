const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    // Assuming a future Song model, though currently we rely on local paths
    // So this could also just be strings if they are local paths. 
    // Using string for now to match local IDs until a true DB model exists for songs.
    type: String, 
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for user playlist lookups
playlistSchema.index({ userId: 1 });

module.exports = mongoose.model('Playlist', playlistSchema);
