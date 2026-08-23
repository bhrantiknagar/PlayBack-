const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getUserData,
  syncUserData,
  toggleFavorite,
  savePlaylist,
  deletePlaylist,
  updateSettings,
  addToHistory
} = require('../controllers/userDataController');

const router = express.Router();

router.route('/')
  .get(protect, getUserData);

router.post('/sync', protect, syncUserData);

router.post('/favorites', protect, toggleFavorite);

router.route('/playlists')
  .post(protect, savePlaylist);

router.route('/playlists/:id')
  .delete(protect, deletePlaylist);

router.put('/settings', protect, updateSettings);

router.post('/history', protect, addToHistory);

module.exports = router;
