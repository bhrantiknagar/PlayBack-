const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  coverUrl: { type: String },
  bio: { type: String },
});

module.exports = mongoose.model('Artist', artistSchema);
