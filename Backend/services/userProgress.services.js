
const updateHabitAndUserProgress = (habit, user, today = new Date()) => {
  const last = habit.lastCompletionDate ? new Date(habit.lastCompletionDate) : null;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (last) {
    const lastDay = last.toDateString();
    const yesterdayDay = yesterday.toDateString();

    if (lastDay === yesterdayDay) {
      // Se completou ontem, aumenta streak
      habit.currentStreak += 1;
    } else if (lastDay === today.toDateString()) {
      // Se completou hoje, não muda streak
      habit.currentStreak = habit.currentStreak;
    } else {
      // Se não completou ontem nem hoje, reseta streak
      habit.currentStreak = 1;
    }
  } else {
    habit.currentStreak = 1; // Primeiro dia de streak
  }

  habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
  habit.completedCount += 1;
  habit.lastCompletionDate = today;

  user.habitsCompletedCount += 1;
  user.lastHabitCompletionDate = today;

  return { lastCompletionDate: last };
};


function isHabitCompletedForPeriod(habit, today) {
  if (!habit.lastCompletionDate) return false;

  const last = new Date(habit.lastCompletionDate);
  switch (habit.frequency) {
    case 'daily':
      return last.toDateString() === today.toDateString();
    case 'weekly':
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return last >= startOfWeek;
    case 'biweekly':
      const startOfBiWeek = new Date(today);
      startOfBiWeek.setDate(today.getDate() - (today.getDay() + 7) % 14); // duas semanas
      return last >= startOfBiWeek;
    case 'twice_per_week':
    case 'three_times_per_week':
    case 'four_times_per_week':
    case 'five_times_per_week':
      return habit.completedThisWeek >= parseInt(habit.frequency); // usa completedThisWeek
    case 'weekends':
      return last.toDateString() === today.toDateString() && (today.getDay() === 0 || today.getDay() === 6);
    default:
      return false;
  }
}


module.exports = { updateHabitAndUserProgress, isHabitCompletedForPeriod };