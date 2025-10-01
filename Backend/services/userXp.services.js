const { checkAndUnlockAchievements } = require("./achievement.services");
const { updateLevel } = require("./level.service");

const grantDailyLoginXp = async (user) => {
  const today = new Date();

  if (user.lastLoginXpReward && user.lastLoginXpReward.toDateString() === today.toDateString()) {
    return { xpGranted: 0, newLevel: user.level, unlockedAchievements: [] };
  }

  user.xp += 10;  // XP do login
  user.lastLoginXpReward = today;

  const newLevel = updateLevel(user); // Atualiza nível se necessário

  // Verifica e desbloqueia achievements relacionados a XP
  const unlockedAchievements = await checkAndUnlockAchievements(user);

  await user.save();


  return { xpGranted: 10, newLevel, unlockedAchievements };
};

module.exports = {
  grantDailyLoginXp,
};
