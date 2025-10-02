import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { theme } from "../styles/theme";
import { useThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { useXpAchievements } from "../hooks/useXpAchievements";
import WeekCalendar from "../components/Weekday";
import { UserXPHeader } from "../components/UserXPHeader";
import { HabitCard } from "../components/HabitCard";
import { getUserHabits } from "../services/habitService";
import { completeHabit } from "../services/userService";
import { isHabitCompletedForPeriod } from "../utils/habitUtils";

export const HomeScreen = () => {
  const { theme: t } = useThemeContext();
  const { fetchXpAchievements } = useXpAchievements();
  const [habits, setHabits] = useState<any[]>([]);
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    // Buscar XP e conquistas
    fetchXpAchievements();
    // Buscar hábitos
    try {
      const data = await getUserHabits(user.token);
      setHabits(data);
    } catch (err) {
      console.error("Erro ao buscar hábitos:", err);
    }
  }, [user, fetchXpAchievements]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);


  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleComplete = async (habitId: string) => {
    if (!user) return;

    try {
      const response = await completeHabit(user.token, habitId);
      const updatedHabit = response.habit;

      setHabits(prev =>
        prev.map(h => (h._id === habitId ? updatedHabit : h))
      );
    } catch (error: any) {
      console.error("Erro ao completar hábito:", error.response?.data || error.message);
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <Header></Header>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ paddingTop: theme.gap.lg, flexGrow: 1, width: '100%' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[t.colors.primary]}
            tintColor={t.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressBar}>
          {user && (
            <UserXPHeader
              name={user.name}
              currentXp={user.currentXp ?? 0}
              level={user.level ?? 1}
            />
          )}
        </View>
        <WeekCalendar onDaySelect={handleDaySelect} />
        <Text style={[styles.title, { color: t.colors.dark_text }]}>Daily Habits</Text>
        <View style={styles.habitContainer}>
          {habits.map((habit) => {
            const isCompleted = isHabitCompletedForPeriod(habit, selectedDate);
            const isToday = selectedDate.toDateString() === new Date().toDateString();
            return (
              <HabitCard
                key={habit._id}
                category={habit.category || "no image"}
                title={habit.title}
                currentStreak={habit.currentStreak || 0}
                isCompleted={isCompleted || !isToday}
                onComplete={isCompleted || !isToday ? undefined : () => handleComplete(habit._id)}
                style={{ opacity: isCompleted ? 0.4 : 1 }}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.padding.horizontal.xxl,
    paddingTop: theme.padding.vertical.xxl.paddingVertical,
    ...theme.align["top-left"],
    ...theme.size.full,
    ...theme.flex.column,
    gap: theme.gap.lg,
    backgroundColor: theme.colors.background,
    ...theme.size.full_width,
  },
  xpText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.dark_text,
  },
  progressBar: {
    ...theme.align["center"],
    ...theme.size.full_width,
  },
  title: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
    paddingBottom: theme.gap.md
  },
  habitContainer: {
    ...theme.size.full_width,
    gap: theme.gap.md,
  },
});
