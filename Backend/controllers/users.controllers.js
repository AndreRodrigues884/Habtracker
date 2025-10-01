const User = require('../models/User');
const Habit = require('../models/Habit');
const { CategoryConfig } = require('../enums/habit.enum');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { grantXpAndCheckLevelUp, checkAndUnlockAchievements } = require('../services/achievement.services');
const { updateHabitAndUserProgress, isHabitCompletedForPeriod } = require('../services/userProgress.services');
const { grantDailyLoginXp } = require('../services/userXp.services');
require('dotenv').config();


const refreshToken = async (req, res) => {
  const { refreshToken: providedRefreshToken } = req.body; 

  if (!providedRefreshToken) {
    return res.error('AUTH_TOKEN_MISSING');
  }

  try {
    const decoded = jwt.verify(providedRefreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.tokenType !== 'refresh') {
      return res.error('AUTH_TOKEN_INVALID');
    }

    const user = await User.findById(decoded.userId);
    
    // ✅ Usa bcrypt.compare para verificar o hash
    if (!user || !user.refreshToken) {
      return res.error('AUTH_TOKEN_INVALID');
    }

    const isValidRefresh = await bcrypt.compare(providedRefreshToken, user.refreshToken);
    if (!isValidRefresh) {
      return res.error('AUTH_TOKEN_INVALID');
    }

    // Gera access token
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

    if (!name || !email || !password) {
      return res.error('REGISTER_MISSING_FIELDS');
    }

    // Sanitização básica
    const nameTrimmed = name.trim();
    const emailLower = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return res.error('REGISTER_INVALID_EMAIL');
    }

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!pwdRegex.test(password)) {
      return res.error('REGISTER_INVALID_PASSWORD');
    }

    // Verifica duplicação - mesma mensagem para evitar enumeração
    const existingUser = await User.findOne({
      $or: [
        { email: emailLower },
        { name: nameTrimmed }
      ]
    });

    if (existingUser) {
      return res.error('REGISTER_DUPLICATE_EMAIL');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: nameTrimmed,
      email: emailLower,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Utilizador registado com sucesso!' });
  } catch (error) {
    console.error('Erro no registo:', error.message);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;



  if (!identifier || !password) {
    console.log('❌ Campos em falta');
    return res.error('LOGIN_MISSING_FIELDS');
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { name: identifier }
      ]
    }).select('+password +loginAttempts +isLocked +lockUntil +refreshToken');

    

    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehash');

    

    if (user && user.isLocked && user.lockUntil > Date.now()) {
     
      return res.error('LOGIN_ACCOUNT_LOCKED');
    }

    if (!user || !validPassword) {
     
      // ... resto do código
      return res.error('LOGIN_INVALID_CREDENTIALS');
    }

   

    user.loginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;

    // Verifica se JWT_SECRET existe
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET não definido!');
      return res.status(500).json({ message: 'Configuração inválida' });
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      console.error('❌ JWT_REFRESH_SECRET não definido!');
      return res.status(500).json({ message: 'Configuração inválida' });
    }

    const accessToken = jwt.sign(
      { userId: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN || '15m' }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id, type: user.type, tokenType: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

   

    const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
    user.refreshToken = hashedRefresh;
    user.lastLogin = new Date();
    
    await user.save();
  

    let xpGranted = 0, newLevel = user.level, unlockedAchievements = [];
    if (user.type === 'user') {
      try {
        ({ xpGranted, newLevel, unlockedAchievements } = await grantDailyLoginXp(user));
      } catch (err) {
        console.warn('⚠️ Falha ao dar XP diário:', err.message);
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
    console.error('💥 ERRO NO LOGIN:', {
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

    // Verifica apenas achievements do tipo XP
    const unlockedAchievements = await checkAndUnlockAchievements(user);

    // Filtra apenas achievements do tipo 'xp'
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
    const user = await User.findById(req.user.userId).populate('associatedhabits');

    if (!user) {
      return res.error('USER_NOT_FOUND');
    }

    const habitsWithMeta = user.associatedhabits.map(habit => ({
      ...habit.toObject(),
      categoryMeta: CategoryConfig[habit.category],
    }));

    return res.status(200).json({ habits: habitsWithMeta });
  } catch (err) {
    console.error(err);
    return res.error('USER_GET_HABITS_FAILED');
  }
};


const completeHabit = async (req, res) => {
  const { habitId } = req.params;
  const userId = req.user.userId;

  try {
    const habit = await Habit.findById(habitId);
    const user = await User.findById(userId);

    if (!habit || habit.userId.toString() !== userId) {
      return res.error('HABIT_NOT_FOUND');
    }

    const today = new Date();

    // Determina início da semana (domingo)
    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Reset semanal se necessário
    if (!habit.weekStartDate || new Date(habit.weekStartDate) < startOfWeek) {
      habit.weekStartDate = startOfWeek;
      habit.completedThisWeek = 0;
    }

    // Verifica se já foi completado no período da frequência
    if (isHabitCompletedForPeriod(habit, today)) {
      return res.error('HABIT_ALREADY_COMPLETED_FOR_PERIOD');
    }

    // Atualiza streaks e progresso
    updateHabitAndUserProgress(habit, user, today);

    // Atualiza completedThisWeek para frequências semanais múltiplas
    if (['twice_per_week', 'three_times_per_week', 'four_times_per_week', 'five_times_per_week'].includes(habit.frequency)) {
      habit.completedThisWeek += 1;

      // Marca como completo se atingiu limite da semana
      const frequencyMap = {
        twice_per_week: 2,
        three_times_per_week: 3,
        four_times_per_week: 4,
        five_times_per_week: 5
      };
      if (habit.completedThisWeek >= frequencyMap[habit.frequency]) {
        habit.isCompleted = true;
      }
    } else if (habit.frequency === 'daily' || habit.frequency === 'weekly' || habit.frequency === 'biweekly' || habit.frequency === 'weekends') {
      habit.isCompleted = true;
    }

    // Ganha XP
    const xpGain = 10;
    const { xpGranted, newLevel } = await grantXpAndCheckLevelUp(user, xpGain);

    // Conquistas
    const unlockedAchievements = await checkAndUnlockAchievements(user, habit);

    await habit.save();
    await user.save();

    return res.status(200).json({
      message: 'Hábito marcado como feito!',
      habit,
      xpGained: xpGranted,
      newLevel,
      unlockedAchievements,
    });

  } catch (error) {
    console.error(error);
    return res.error('HABIT_COMPLETION_FAILED');
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nenhuma imagem enviada' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Salva path relativo no banco
    user.avatar = `/${req.file.path.replace(/\\/g, '/')}`; // garante path correto no Windows
    await user.save();

    // Cria URL completa para frontend
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

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const profile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ? `${req.protocol}://${req.get('host')}${user.avatar}` : null, // URL completa
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
    return res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
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
