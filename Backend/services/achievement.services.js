const Achievement = require('../models/Achievements');
const { updateLevel } = require("./level.service")

const grantXpAndCheckLevelUp = async (user, xpAmount) => {
  user.xp += xpAmount;

  const newLevel = updateLevel(user);

  await user.save();

  return { xpGranted: xpAmount, newLevel };
};


const checkAndUnlockAchievements = async (user, habit = null) => {
  const allAchievements = await Achievement.find();
  const alreadyUnlockedIds = user.achievementsUnlocked.map(a => a.toString());
  const newlyUnlocked = [];

  // Verifica cada achievement
  for (const achievement of allAchievements) {
    if (alreadyUnlockedIds.includes(achievement._id.toString())) continue;

    let qualifies = false;

    switch (achievement.type) {
      case 'xp':
        if (user.xp >= achievement.threshold) qualifies = true;
        break;
      case 'count':
        if (user.habitsCompletedCount >= achievement.threshold) qualifies = true;
        break;
      case 'streak':
        if (habit && habit.currentStreak >= achievement.threshold) qualifies = true;
        break;
    }

    if (qualifies) {
      user.achievementsUnlocked.push(achievement._id);

      let xpReward = 0;

      // Só aplica XP se o achievement tiver rewardXp definido
      if (achievement.rewardXp && achievement.rewardXp > 0) {
        xpReward = achievement.rewardXp;
        await grantXpAndCheckLevelUp(user, xpReward);
      }

      newlyUnlocked.push({ ...achievement.toObject(), xpReward });
    }
  }
  return newlyUnlocked;
}


module.exports = { checkAndUnlockAchievements, grantXpAndCheckLevelUp };

/* 1. calculateLevelFromXpThreshold(threshold)
O que faz:
Calcula o nível do usuário baseado em um valor de XP (threshold).
Exemplo: para cada 100 XP, sobe 1 nível.

2. grantXpAndCheckLevelUp(user, xpAmount)
O que faz:
Adiciona a quantidade de XP recebida (xpAmount) ao XP atual do usuário.
Depois, verifica se o novo total de XP permite subir de nível e atualiza o nível, se for o caso.
Salva as alterações no banco.
Retorna a quantidade de XP concedida e o novo nível do usuário.

3. checkAndUnlockAchievements(user, habit = null)
O que faz:
Verifica todos os achievements cadastrados para descobrir quais o usuário ainda não desbloqueou.
Para cada achievement, verifica se o usuário (ou o hábito, no caso de achievements do tipo "streak") cumpre os requisitos (XP, streak, count).
Se o usuário qualificar para um achievement, adiciona-o à lista de achievements desbloqueados e concede a recompensa de XP usando a função grantXpAndCheckLevelUp.
Retorna uma lista dos achievements que foram desbloqueados nessa verificação. */