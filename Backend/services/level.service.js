// Função central: atualiza o nível de acordo com o XP
const updateLevel = (user) => {
  const xpPerLevel = 100;

  // Calcula o nível baseado no XP total
  const newLevel = Math.floor(user.xp / xpPerLevel) + 1;

  // Atualiza se mudou
  if (newLevel > user.level) {
    user.level = newLevel;
  }

  return user.level;
};

module.exports = { updateLevel };
