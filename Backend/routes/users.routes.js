const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');
const auth = require('../middlewares/auth');
const { avatarUpload } = require('../utils/multerConfig');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimiter');

router.post('/refresh', usersController.refreshToken);
router.post('/register', registerLimiter, usersController.register);
router.post('/login', loginLimiter, usersController.login);
router.get('/habits', auth, usersController.getUserHabits);
router.post('/habits/:habitId/complete', auth, usersController.completeHabit);
router.get('/level', auth, usersController.getUserLevel);
router.get('/xp-achievements', auth, usersController.checkUserXpAchievements);
router.post('/avatar', auth, avatarUpload.single('avatar'), usersController.updateAvatar);
router.get('/profile', auth, usersController.getUserProfile);


module.exports = router;
