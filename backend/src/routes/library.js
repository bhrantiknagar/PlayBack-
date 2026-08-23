const express = require('express');
const router = express.Router();
const {
  getTracks, getTrackById, getAlbums, getArtists,
  createTrack, updateTrack, deleteTrack,
  createAlbum, updateAlbum, deleteAlbum,
  createArtist, updateArtist, deleteArtist
} = require('../controllers/libraryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/tracks', getTracks);
router.get('/tracks/:id', getTrackById);
router.get('/albums', getAlbums);
router.get('/artists', getArtists);

router.post('/tracks', protect, admin, createTrack);
router.put('/tracks/:id', protect, admin, updateTrack);
router.delete('/tracks/:id', protect, admin, deleteTrack);

router.post('/albums', protect, admin, createAlbum);
router.put('/albums/:id', protect, admin, updateAlbum);
router.delete('/albums/:id', protect, admin, deleteAlbum);

router.post('/artists', protect, admin, createArtist);
router.put('/artists/:id', protect, admin, updateArtist);
router.delete('/artists/:id', protect, admin, deleteArtist);

module.exports = router;
