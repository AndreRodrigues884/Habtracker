const Habit = require('../models/Habit');
const User = require('../models/User');
const { FrequencyEnum, CategoryEnum, CategoryConfig } = require('../enums/habit.enum');

const createHabit = async (req, res) => {
  const { title, description = '', category, frequency, startDate = new Date(), intention = null, trigger = null} = req.body;

  // Verify required habit fields
  if (!title || !frequency || !category) {
    return res.error('HABIT_MISSING_FIELDS');
  }

  // Verify habit frequency
  if (!FrequencyEnum.includes(frequency)) {
    return res.error('HABIT_INVALID_FREQUENCY');
  }

  // Verify habit category
  if (!CategoryEnum.includes(category)) {
    return res.error('HABIT_INVALID_CATEGORY');
  }

  // Verify habit exists
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

    //Update User & push Habit to associatedhabits
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { associatedhabits: habit._id } }
    );

    // Add category meta
    const habitWithMeta = {
      ...habit.toObject(),
      categoryMeta: CategoryConfig[habit.category],
    };

    return res.status(201).json({ message: 'Habit successfully created.', habit: habitWithMeta });
  } catch (error) {
    console.error(error);
    return res.error('HABIT_CREATION_FAILED');
  }
};

const deleteHabit = async (req, res) => {

  //Search id habit in params
  const { habitId } = req.params;

  try {

    //Search Habit id
    const habit = await Habit.findById(habitId);

    //Verifiy habit exists
    if (!habit) {
      return res.error('HABIT_NOT_FOUND');
    }

    // Verify if habit belong to user authenticated
    if (habit.userId.toString() !== req.user.userId) {
      return res.error('USER_UNAUTHORIZED_ACTION');
    }

    await Habit.findByIdAndDelete(habitId);

    // Delete habit from associatedhabits user
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { associatedhabits: habitId }
    });

    return res.status(200).json({ message: 'Habit successfully eliminated.' });
  } catch (error) {
    console.error(error);
    return res.error('HABIT_DELETE_FAILED');
  }
};

const updateHabit = async (req, res) => {
  const { habitId } = req.params;
  const updates = req.body;

  try {

    //Search habit id
    const habit = await Habit.findById(habitId);

    //Verify habit exists
    if (!habit) {
      return res.error('HABIT_NOT_FOUND');
    }

    // Verify if habit belong to user authenticated
    if (habit.userId.toString() !== req.user.userId) {
      return res.error('USER_UNAUTHORIZED_ACTION');
    }

    // Updates allowed fields
    Object.keys(updates).forEach(key => {
      habit[key] = updates[key];
    });

    //Update new date
    habit.updatedAt = new Date();
    await habit.save();

    return res.status(200).json({ message: 'Habit successfully updated.', habit });
  } catch (error) {
    console.error(error);
    return res.error('HABIT_UPDATE_FAILED');
  }
};

const getHabitEnums = (req, res) => {

  //Return enums
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

