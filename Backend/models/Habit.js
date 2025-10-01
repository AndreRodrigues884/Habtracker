const mongoose = require('mongoose');
const { FrequencyEnum, CategoryEnum } = require('../enums/habit.enum');

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: CategoryEnum,
    required: true,
  },
  frequency: {
    type: String,
    enum: FrequencyEnum,
    required: true,
  },

  startDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endDate: {
    type: Date,
    default: null, // usado para hábitos com fim definido
  },
  intention: {
    type: String,
    default: null,
  },

  trigger: {
    type: String,
    default: null,
  },

  currentStreak: {
    type: Number,
    default: 0,
  },

  longestStreak: {
    type: Number,
    default: 0,
  },

  isCompleted: {
    type: Boolean,
    default: false, // será true quando atingir o objetivo (se aplicável)
  },
  lastCompletionDate: {
    type: Date,
    default: null,
  },
  completedThisWeek: {
    type: Number,
    default: 0,
  },

  completedCount: {
    type: Number,
    default: 0,
  },
  weekStartDate: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Habit', HabitSchema);
