const User = require('../models/User');
const Habit = require('../models/Habit');
const Achievements = require('../models/Achievements');
const { AchievementNameEnum } = require('../enums/achievement.enum');
require('dotenv').config();

/* const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      type: 'admin' // define como administrador
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin criado com sucesso!',
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        type: newAdmin.type,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar admin.' });
  }
}; */

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.error('GET_USERS_FAILED');
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
     return res.error('USER_NOT_FOUND');
    }

    return res.status(200).json({ message: 'Utilizador apagado com sucesso' });
  } catch (error) {
    console.error(error);
     return res.error('USER_DELETE_FAILED');
  }
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    return res.status(200).json({ habits });
  } catch (error) {
    console.error(error);
    return res.error('GET_HABITS_FAILED');
  }
};

const createAchievement = async (req, res) => {
  try {
    const { name, type, threshold, rewardXp, icon } = req.body;

    if (!name || !type || !threshold) {
       return res.error('ACHIEVEMENT_MISSING_FIELDS');
    }

    const allowedTypes = ['xp', 'streak', 'count'];
    if (!allowedTypes.includes(type)) {
      return res.error('ACHIEVEMENT_INVALID_TYPE');
    }

    const existing = await Achievements.findOne({ name });
    if (existing) {
       return res.error('ACHIEVEMENT_ALREADY_EXISTS');
    }

    if (!AchievementNameEnum[type].includes(name)) {
       return res.error('ACHIEVEMENT_INVALID_NAME_FOR_TYPE');
    }

    const achievement = new Achievements({
      name,
      type,
      threshold,
      rewardXp,
      icon
    });

    await achievement.save();

    return res.status(201).json({ message: 'Conquista criada com sucesso!', achievement });

  } catch (err) {
    console.error(err);
     return res.error('ACHIEVEMENT_CREATION_FAILED');
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Achievements.findByIdAndDelete(id);

    if (!deleted) {
      return res.error('ACHIEVEMENT_NOT_FOUND');
    }

    return res.status(200).json({ message: 'Conquista apagada com sucesso.' });

  } catch (err) {
    console.error(err);
    return res.error('ACHIEVEMENT_DELETE_FAILED');
  }
};

const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, threshold, rewardXp, icon } = req.body;

    const allowedTypes = ['xp', 'streak', 'count'];

    if (type && !allowedTypes.includes(type)) {
      return res.error('ACHIEVEMENT_INVALID_TYPE');
    }

    if (type && name && !AchievementNameEnum[type]?.includes(name)) {
      return res.error('ACHIEVEMENT_INVALID_NAME_FOR_TYPE');
    }

    const updated = await Achievements.findByIdAndUpdate(
      id,
      { name, type, threshold, rewardXp, icon },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.error('ACHIEVEMENT_NOT_FOUND');
    }

    return res.status(200).json({ message: 'Conquista atualizada com sucesso!', achievement: updated });

  } catch (err) {
    console.error(err);
    return res.error('ACHIEVEMENT_UPDATE_FAILED');
  }
};





module.exports = {
  /* createAdmin, */
  getUsers,
  getHabits,
  createAchievement,
  deleteUser,
  deleteAchievement,
  updateAchievement
};