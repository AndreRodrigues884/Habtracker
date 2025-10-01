const express = require('express');
const router = express.Router();
const habitsController = require('../controllers/habit.controllers');
const auth = require('../middlewares/auth');

router.post('/', auth, habitsController.createHabit);
router.delete('/:habitId', auth, habitsController.deleteHabit);
router.put('/:habitId', auth, habitsController.updateHabit);
router.get('/enums', auth, habitsController.getHabitEnums);


module.exports = router;
