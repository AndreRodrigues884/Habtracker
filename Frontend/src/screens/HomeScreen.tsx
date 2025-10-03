import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
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


  const handleDaySelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleComplete = useCallback(async (habitId: string) => {
    if (!user) return;

    try {
      const response = await completeHabit(user.token, habitId);
      const updatedHabit = response.habit;

      setHabits(prev => prev.map(h => (h._id === habitId ? updatedHabit : h)));

      // Atualiza XP/Nível imediatamente após completar
      await fetchXpAchievements();
    } catch (error: any) {
      console.error("Erro ao completar hábito:", error.response?.data || error.message);
    }
  }, [user, fetchXpAchievements]);

  const renderHabitItem = useCallback(({ item }: { item: any }) => {
    const isCompleted = isHabitCompletedForPeriod(item, selectedDate);
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    return (
      <HabitCard
        category={item.category || "no image"}
        title={item.title}
        currentStreak={item.currentStreak}
        isCompleted={isCompleted || !isToday}
        onComplete={isCompleted || !isToday ? undefined : () => handleComplete(item._id)}
        style={{ opacity: isCompleted ? 0.4 : 1 }}
      />
    );
  }, [handleComplete, selectedDate]);

  const keyExtractor = useCallback((item: any) => item._id, []);


  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <Header />
      <FlatList
        data={habits}
        keyExtractor={keyExtractor}
        renderItem={renderHabitItem}
        ListHeaderComponent={
          <View style={{ width: '100%', paddingTop: theme.gap.lg }}>
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
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: theme.gap.s }} />}
        contentContainerStyle={styles.habitContainer}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
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
