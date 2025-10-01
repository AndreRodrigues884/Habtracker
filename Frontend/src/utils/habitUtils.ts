// Verifica se o hábito já foi completado no próprio dia
export function isHabitCompletedForDay(habit: any, date: Date): boolean {
  if (!habit.lastCompletionDate) return false;
  const last = new Date(habit.lastCompletionDate);
  return last.toDateString() === date.toDateString();
}

// Verifica se o hábito está completado de acordo com a frequência
export function isHabitCompletedForPeriod(habit: any, date: Date): boolean {
  // Bloqueia no mesmo dia
  if (isHabitCompletedForDay(habit, date)) return true;

  const last = habit.lastCompletionDate ? new Date(habit.lastCompletionDate) : null;

  switch (habit.frequency) {
    case "daily":
      return false; // já bloqueado pelo dia

    case "weekly": {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      return !!(last && last >= startOfWeek);
    }

    case "biweekly": {
      const startOfBiWeek = new Date(date);
      startOfBiWeek.setDate(date.getDate() - ((date.getDay() + 7) % 14));
      return !!(last && last >= startOfBiWeek);
    }

    case "twice_per_week":
    case "three_times_per_week":
    case "four_times_per_week":
    case "five_times_per_week":
      return !!(habit.completedThisWeek >= parseInt(habit.frequency));

    case "weekends":
      return !!(last && last >= date && (date.getDay() === 0 || date.getDay() === 6));

    default:
      return false;
  }
}
