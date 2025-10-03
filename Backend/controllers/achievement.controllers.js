const Achievements = require('../models/Achievements');

const getAchievements = async (req, res) => {
  try {

    // Create a variable to search for achievements
    const achievements = await Achievements.find(); 

    // Collect achievements
    return res.status(200).json({ achievements });
  } catch (err) {
    console.error(err);
    return res.error('FETCH_ACHIEVEMENTS_FAILED');
  }
};

const getAchievementByType = async (req, res) => {
  try {

    const { type } = req.params;


    // Create a variable to achievements types
    const allowedTypes = ['xp', 'streak', 'count'];
    
    // Verify if variable include type in params
    if (!allowedTypes.includes(type)) {
      return res.error('ACHIEVEMENT_INVALID_TYPE');
    }

    // Create a variable to search for achievements by type
    const achievements = await Achievements.find({ type }).sort({ threshold: 1 });

    // Collect achievements by type
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