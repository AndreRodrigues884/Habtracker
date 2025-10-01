const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controllers');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


/* router.post('/create-admin', adminController.createAdmin);  */
router.get('/users', auth, isAdmin, adminController.getUsers);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);
router.get('/habits', auth, isAdmin, adminController.getHabits);
router.post('/achievement', auth, isAdmin, adminController.createAchievement);
router.delete('/achievement/:id', auth, isAdmin, adminController.deleteAchievement);
router.put('/achievement/:id', auth, isAdmin, adminController.updateAchievement);


module.exports = router;