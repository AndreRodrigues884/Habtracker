const User = require('../models/User');
const Habit = require('../models/Habit');
const fs = require('fs');
const path = require('path');
const { CategoryConfig } = require('../enums/habit.enum');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { grantXpAndCheckLevelUp, checkAndUnlockAchievements } = require('../services/achievement.services');
const { updateHabitAndUserProgress, isHabitCompletedForPeriod } = require('../services/userProgress.services');
const { grantDailyLoginXp } = require('../services/userXp.services');
require('dotenv').config();


const refreshToken = async (req, res) => {
  const { refreshToken: providedRefreshToken } = req.body;

  //Verify token exists
  if (!providedRefreshToken) {
    return res.error('AUTH_TOKEN_MISSING');
  }

  try {

    //Verifies the received JWT token (refresh token) using the refresh secret key
    const decoded = jwt.verify(providedRefreshToken, process.env.JWT_REFRESH_SECRET);

    // Checks if the decoded token type is really "refresh"
    if (decoded.tokenType !== 'refresh') {
      return res.error('AUTH_TOKEN_INVALID');
    }

    const user = await User.findById(decoded.userId);

    // Verify if user exist OR not have a refresh token
    if (!user || !user.refreshToken) {
      return res.error('AUTH_TOKEN_INVALID');
    }


    const isValidRefresh = await bcrypt.compare(providedRefreshToken, user.refreshToken);
    if (!isValidRefresh) {
      return res.error('AUTH_TOKEN_INVALID');
    }

    // Generate access token
    const newAccessToken = jwt.sign(
      { userId: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN || '15m' }
    );

    return res.status(200).json({
      token: newAccessToken,
    });
  } catch (err) {
    return res.error('AUTH_TOKEN_INVALID');
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Verify fields
    if (!name || !email || !password) {
      return res.error('REGISTER_MISSING_FIELDS');
    }

    // Basic sanitation
    const nameTrimmed = name.trim();
    const emailLower = email.toLowerCase().trim();

    //Email rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return res.error('REGISTER_INVALID_EMAIL');
    }

    //Password rules
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!pwdRegex.test(password)) {
      return res.error('REGISTER_INVALID_PASSWORD');
    }

    // Verify existing User
    const existingUser = await User.findOne({
      $or: [
        { email: emailLower },
        { name: nameTrimmed }
      ]
    });

    if (existingUser) {
      return res.error('REGISTER_DUPLICATE_EMAIL');
    }

    //Generates a "salt" to strengthen the password hash
    const salt = await bcrypt.genSalt(10);

    //Encrypted password
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create User
    const newUser = new User({
      name: nameTrimmed,
      email: emailLower,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Erro no registo:', error.message);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  //Verify fields
  if (!identifier || !password) {
    console.log('Missing fields');
    return res.error('LOGIN_MISSING_FIELDS');
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { name: identifier }
      ]
    }).select('+password +loginAttempts +isLocked +lockUntil +refreshToken');



    //Validate & compare password
    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehash');

    // Check if the account is blocked
    if (user && user.isLocked && user.lockUntil > Date.now()) {
      return res.error('LOGIN_ACCOUNT_LOCKED');
    }

    //Verify Credentials
    if (!user || !validPassword) {
      return res.error('LOGIN_INVALID_CREDENTIALS');
    }

    user.loginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;

    // Verifica se JWT_SECRET existe
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not defined!');
      return res.status(500).json({ message: 'Configuração inválida' });
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      console.error('❌ JWT_REFRESH_SECRET not defined!');
      return res.status(500).json({ message: 'Configuração inválida' });
    }


    //Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN || '15m' }
    );

    //Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id, type: user.type, tokenType: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );



    //Encrypted refresh token
    //Updates the last login date
    const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
    user.refreshToken = hashedRefresh;
    user.lastLogin = new Date();

    await user.save();


    let xpGranted = 0, newLevel = user.level, unlockedAchievements = [];
    // Verify user type "user"
    if (user.type === 'user') {
      try {
        // Try to apply the daily login reward
        ({ xpGranted, newLevel, unlockedAchievements } = await grantDailyLoginXp(user));
      } catch (err) {
        console.warn('Daily XP failed to give:', err.message);
      }
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      token: accessToken,
      refreshToken: newRefreshToken,
      xpGrantedToday: xpGranted,
      currentXp: user.xp,
      level: newLevel,
      unlockedAchievements
    });

  } catch (err) {
    console.error('LOGIN ERROR:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};




const getUserLevel = async (req, res) => {
  try {
    
    const userId = req.user.userId;

    //Get level and xp from user
    const user = await User.findById(userId).select('level xp');

    if (!user) {
      return res.error('USER_NOT_FOUND');
    }

    return res.status(200).json({ level: user.level, xp: user.xp });
  } catch (err) {
    console.error(err);
    return res.error('USER_LEVEL_FAILED');
  }
};

const checkUserXpAchievements = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) return res.error('USER_NOT_FOUND');

    // Create unlockedAchievements to check achievements
    const unlockedAchievements = await checkAndUnlockAchievements(user);

    // Filter achievements from xp
    const xpAchievements = unlockedAchievements.filter(a => a.type === 'xp');

    return res.status(200).json({
      level: user.level,
      xp: user.xp,
      unlockedAchievements: xpAchievements
    });
  } catch (err) {
    console.error(err);
    return res.error('USER_XP_ACHIEVEMENTS_FAILED');
  }
};

const getUserHabits = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "associatedhabits",
        select: "title category frequency currentStreak longestStreak isCompleted lastCompletionDate completedThisWeek completedCount weekStartDate completionDates createdAt updatedAt",
        options: { lean: true }
      })
      .lean();

    if (!user) {
      return res.error("USER_NOT_FOUND");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // End week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const habitsWithMeta = user.associatedhabits.map((habit) => {
      const completedDaysThisWeek = new Array(7).fill(false);

      (habit.completionDates || []).forEach((date) => {
        const d = new Date(date);
        if (d >= startOfWeek && d < endOfWeek) {
          const jsDay = d.getDay(); 
          completedDaysThisWeek[jsDay] = true;
        }
      });

      return {
        ...habit,
        categoryMeta: CategoryConfig[habit.category],
        completedDaysThisWeek,
      };
    });

    return res.status(200).json({ habits: habitsWithMeta });
  } catch (err) {
    console.error(err);
    return res.error("USER_GET_HABITS_FAILED");
  }
};


const completeHabit = async (req, res) => {
  const { habitId } = req.params;
  const userId = req.user.userId;

  try {
    const habit = await Habit.findById(habitId);
    const user = await User.findById(userId);

    if (!habit || habit.userId.toString() !== userId) {
      return res.error("HABIT_NOT_FOUND");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start weeek
    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Reste week
    if (!habit.weekStartDate || new Date(habit.weekStartDate) < startOfWeek) {
      habit.weekStartDate = startOfWeek;
      habit.completedThisWeek = 0;
      habit.completionDates = [];
    }

    // Has it been completed today?
    const alreadyCompletedToday = habit.completionDates?.some(
      (d) => new Date(d).toDateString() === today.toDateString()
    );

    if (alreadyCompletedToday) {
      return res.error("HABIT_ALREADY_COMPLETED_TODAY");
    }

    // Mark the day as complete
    habit.completionDates.push(today);
    habit.completedThisWeek += 1;
    

    // Update streaks and progress
    updateHabitAndUserProgress(habit, user, today);

    // Rules for multiple weekly frequencies
    if (
      [
        "twice_per_week",
        "three_times_per_week",
        "four_times_per_week",
        "five_times_per_week",
      ].includes(habit.frequency)
    ) {
      const frequencyMap = {
        twice_per_week: 2,
        three_times_per_week: 3,
        four_times_per_week: 4,
        five_times_per_week: 5,
      };
      if (habit.completedThisWeek >= frequencyMap[habit.frequency]) {
        habit.isCompleted = true;
      }
    } else if (
      ["daily", "weekly", "biweekly", "weekends"].includes(habit.frequency)
    ) {
      habit.isCompleted = true;
    }

    // Earn XP
    const xpGain = 10;
    const { xpGranted, newLevel } = await grantXpAndCheckLevelUp(user, xpGain);

    // Check achievements
    const unlockedAchievements = await checkAndUnlockAchievements(user, habit);

    await habit.save();
    await user.save();

    return res.status(200).json({
      message: "Habit marked as done!",
      habit,
      xpGained: xpGranted,
      newLevel,
      unlockedAchievements,
    });
  } catch (error) {
    console.error(error);
    return res.error("HABIT_COMPLETION_FAILED");
  }
};


const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No images sent' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove old avatar from disk if it exists
    if (user.avatar) {
      try {
        // user.avatar like '/uploads/avatars/xxx.jpg' → get relative path
        const relativeFromRoot = user.avatar.startsWith('/') ? user.avatar.slice(1) : user.avatar;
        if (relativeFromRoot.startsWith('uploads/avatars')) {
          const absoluteOldPath = path.join(__dirname, '..', relativeFromRoot);
          if (fs.existsSync(absoluteOldPath)) {
            fs.unlinkSync(absoluteOldPath);
          }
        }
      } catch (e) {
        console.warn('Failed to remove previous avatar:', e.message);
      }
    }

    // Save new relative path to database
    user.avatar = `/${req.file.path.replace(/\\/g, '/')}`;
    await user.save();

    // Create full URL for frontend
    const avatarUrl = `${req.protocol}://${req.get('host')}${user.avatar}`;

    return res.status(200).json({ avatar: avatarUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar avatar' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) return res.status(404).json({ message: 'User not found' });


    //Gte profile fields
    const profile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ? `${req.protocol}://${req.get('host')}${user.avatar}` : null,
      level: user.level,
      xp: user.xp,
      associatedhabits: user.associatedhabits.map(h => h._id),
      achievementsUnlocked: user.achievementsUnlocked.map(a => a._id),
      habitsCompletedCount: user.habitsCompletedCount,
      lastLoginXpReward: user.lastLoginXpReward,
      lastHabitCompletionDate: user.lastHabitCompletionDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json(profile);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    return res.status(500).json({ message: 'Error fetching user profile' });
  }
};





module.exports = {
  login,
  register,
  getUserHabits,
  completeHabit,
  refreshToken,
  getUserLevel,
  checkUserXpAchievements,
  updateAvatar,
  getUserProfile
};
