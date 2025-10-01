const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controllers');
const auth = require('../middlewares/auth');

router.get('/', auth, achievementController.getAchievements);
router.get('/:type', auth, achievementController.getAchievementByType);

module.exports = router;
