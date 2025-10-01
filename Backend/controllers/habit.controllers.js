const Habit = require('../models/Habit');
const User = require('../models/User');
const { FrequencyEnum, CategoryEnum, CategoryConfig } = require('../enums/habit.enum');

const createHabit = async (req, res) => {
  const {
    title,
    description = '',
    category,
    frequency,
    startDate = new Date(),
    intention = null,
    trigger = null,
  } = req.body;

  if (!title || !frequency || !category) {
    return res.error('HABIT_MISSING_FIELDS');
  }

  if (!FrequencyEnum.includes(frequency)) {
    return res.error('HABIT_INVALID_FREQUENCY');
  }

  if (!CategoryEnum.includes(category)) {
    return res.error('HABIT_INVALID_CATEGORY');
  }

  const habitExists = await Habit.findOne({ userId: req.user.userId, title });
  if (habitExists) {
    return res.error('HABIT_TITLE_ALREADY_EXISTS');
  }

  try {
    const habit = new Habit({
      userId: req.user.userId,
      title,
      description,
      category,
      frequency,
      startDate,
      intention,
      trigger,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await habit.save();

    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { associatedhabits: habit._id } }
    );

    // adiciona os metadados da categoria
    const habitWithMeta = {
      ...habit.toObject(),
      categoryMeta: CategoryConfig[habit.category],
    };

    return res.status(201).json({ message: 'Hábito criado com sucesso.', habit: habitWithMeta });
  } catch (error) {
    console.error(error);
    return res.error('HABIT_CREATION_FAILED');
  }
};

const deleteHabit = async (req, res) => {
  const { habitId } = req.params;

  try {
    const habit = await Habit.findById(habitId);

    if (!habit) {
      return res.error('HABIT_NOT_FOUND');
    }

    // Verifica se o hábito pertence ao utilizador autenticado
    if (habit.userId.toString() !== req.user.userId) {
      return res.error('USER_UNAUTHORIZED_ACTION');
    }

    await Habit.findByIdAndDelete(habitId);

    // Remove habitId de associatedhabits do user
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { associatedhabits: habitId }
    });

    return res.status(200).json({ message: 'Hábito eliminado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.error('HABIT_DELETE_FAILED');
  }
};

const updateHabit = async (req, res) => {
  const { habitId } = req.params;
  const updates = req.body;

  try {
    const habit = await Habit.findById(habitId);

    if (!habit) {
      return res.error('HABIT_NOT_FOUND');
    }

    if (habit.userId.toString() !== req.user.userId) {
      return res.error('USER_UNAUTHORIZED_ACTION');
    }

    // Atualiza campos permitidos
    Object.keys(updates).forEach(key => {
      habit[key] = updates[key];
    });

    habit.updatedAt = new Date();
    await habit.save();

    return res.status(200).json({ message: 'Hábito atualizado com sucesso.', habit });
  } catch (error) {
    console.error(error);
    return res.error('HABIT_UPDATE_FAILED');
  }
};

const getHabitEnums = (req, res) => {
  return res.json({
    categories: CategoryEnum,
    frequencies: FrequencyEnum
  });
};



module.exports = {
    createHabit,
    deleteHabit,
    updateHabit,
    getHabitEnums
};

