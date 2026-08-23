const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  artistId: { type: String, ref: 'Artist', required: true },
  albumId: { type: String, ref: 'Album', required: true },
  audio: { type: String, required: true },
  artwork: { type: String },
  duration: { type: Number, default: 0 },
  quality: { type: String },
  genre: { type: String },
  category: { type: String },
  energy: { type: String },
  ambientColor: { type: String },
  plays: { type: String },
  lyrics: [{
    time: Number,
    text: String
  }]
});

// To ensure frontend compatibility, we override toJSON to map _id to id
trackSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Track', trackSchema);
