const Achievements = require('../models/Achievements');

const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievements.find();

    return res.status(200).json({ achievements });
  } catch (err) {
    console.error(err);
    return res.error('FETCH_ACHIEVEMENTS_FAILED');
  }
};

const getAchievementByType = async (req, res) => {
  try {
    const { type } = req.params;

    const allowedTypes = ['xp', 'streak', 'count'];
    if (!allowedTypes.includes(type)) {
      return res.error('ACHIEVEMENT_INVALID_TYPE');
    }

    const achievements = await Achievements.find({ type }).sort({ threshold: 1 });

    res.status(200).json({ achievements });
  } catch (err) {
    console.error(err);
    return res.error('FETCH_ACHIEVEMENTS_FAILED');
  }
};

module.exports = {
  getAchievements,
  getAchievementByType,
};