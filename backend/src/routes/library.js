const express = require('express');
const router = express.Router();
const { getTracks, getTrackById, getAlbums, getArtists } = require('../controllers/libraryController');

router.get('/tracks', getTracks);
router.get('/tracks/:id', getTrackById);
router.get('/albums', getAlbums);
router.get('/artists', getArtists);

module.exports = router;
