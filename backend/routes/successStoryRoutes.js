const express = require('express');
const router = express.Router();
const { getStories, getStoryBySlug } = require('../controllers/successStoryController');

router.get('/', getStories);
router.get('/:slug', getStoryBySlug);

module.exports = router;
