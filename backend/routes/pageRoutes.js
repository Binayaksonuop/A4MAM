const express = require('express');
const router = express.Router();
const { getPageBySlug } = require('../controllers/pageController');

router.get('/:slug', getPageBySlug);

module.exports = router;
