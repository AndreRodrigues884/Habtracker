// updates the level according to XP
const updateLevel = (user) => {
  const xpPerLevel = 100;

  //Calculates level based on total XP
  const newLevel = Math.floor(user.xp / xpPerLevel) + 1;

  // Update if changed
  if (newLevel > user.level) {
    user.level = newLevel;
  }

  return user.level;
};

module.exports = { updateLevel };
