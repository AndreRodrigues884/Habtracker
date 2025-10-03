const { checkAndUnlockAchievements } = require("./achievement.services");
const { updateLevel } = require("./level.service");

const grantDailyLoginXp = async (user) => {
  const today = new Date();

  // Check last login reward
  if (user.lastLoginXpReward && user.lastLoginXpReward.toDateString() === today.toDateString()) {
    return { xpGranted: 0, newLevel: user.level, unlockedAchievements: [] };
  }

  user.xp += 10;  // login XP
  user.lastLoginXpReward = today;

  const newLevel = updateLevel(user); // Check level

  // Check and unlock XP-related achievements
  const unlockedAchievements = await checkAndUnlockAchievements(user);

  await user.save();

  return { xpGranted: 10, newLevel, unlockedAchievements };
};

module.exports = {
  grantDailyLoginXp,
};
