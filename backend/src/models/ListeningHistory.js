const mongoose = require('mongoose');

const listeningHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  songId: {
    type: String,
    required: true,
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for sorted history lookups per user
listeningHistorySchema.index({ userId: 1, playedAt: -1 });

module.exports = mongoose.model('ListeningHistory', listeningHistorySchema);
