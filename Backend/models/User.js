const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  avatar: {
    type: String,
    default: null,
  },

  level: {
    type: Number,
    default: 1,
  },

  xp: {
    type: Number,
    default: 0,
  },

  associatedhabits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit'
  }],

  achievementsUnlocked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
  }],

  habitsCompletedCount: {
    type: Number,
    default: 0, // total de conclusões (para achievements tipo "count")
  },

  lastLoginXpReward: {
    type: Date,
    default: null,
  },

  lastHabitCompletionDate: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Segurança
  refreshToken: {
    type: String,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockUntil: {
    type: Date,
    default: null
  },

  // Auditoria
  lastLogin: {
    type: Date,
    default: null
  },
});

UserSchema.index({ email: 1 });
UserSchema.index({ refreshToken: 1 });

module.exports = mongoose.model('User', UserSchema);
