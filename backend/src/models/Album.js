const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  artistId: { type: String, ref: 'Artist', required: true },
  coverUrl: { type: String },
  releaseYear: { type: Number },
  genre: { type: String }
});

// Indexes for query performance
albumSchema.index({ artistId: 1 });

module.exports = mongoose.model('Album', albumSchema);
