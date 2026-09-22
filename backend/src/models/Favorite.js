const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  songId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for fast lookup and duplicate prevention
favoriteSchema.index({ userId: 1, songId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
