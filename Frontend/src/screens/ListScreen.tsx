import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";
import { AuthContext } from "../contexts/AuthContext";
import { getUserHabits } from "../services/habitService";
import { HabitList } from "../components/HabitList";
import { Habit } from "../types/Habit";
import { useThemeContext } from "../contexts/ThemeContext";

export const ListScreen = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { theme: t } = useThemeContext();

  // Carregar hábitos do utilizador
  const fetchHabits = useCallback(async (showLoading = true) => {
    if (!user?.token) return;

    try {
      if (showLoading) setLoading(true);
      const data = await getUserHabits(user.token);
      setHabits(data || []);
    } catch (err) {
      console.error("Error searching for habits:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user?.token]); // Só depende do token

  // Carregar na primeira vez - apenas quando o token existir
  useEffect(() => {
    if (user?.token) {
      fetchHabits();
    }
  }, [user?.token, fetchHabits]);

  // Função para refresh (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHabits(false);
    setRefreshing(false);
  };

  // Função para atualizar um hábito na lista local após edição
  const handleHabitUpdated = (habitId: string, updatedData: any) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit._id === habitId 
          ? { ...habit, ...updatedData, updatedAt: new Date() } 
          : habit
      )
    );
  };

  // Function to remove a habit from the local list after deletion
  const handleHabitDeleted = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.filter(habit => habit._id !== habitId)
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        You don't have any habits yet.
      </Text>
      <Text style={styles.emptySubtext}>
        Create your first habit to start tracking your progress!
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading habits...</Text>
    </View>
  );

  // Se não há user, não mostrar nada ou mostrar loading
  if (!user) {
    return (
      <View style={styles.container}>
        <Header />
        {renderLoadingState()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <Header />
      <Text style={[styles.title, { color: t.colors.dark_text }]}>Daily Habits</Text>
      
      {loading ? (
        renderLoadingState()
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[t.colors.primary]}
              tintColor={t.colors.primary}
            />
          }
        >
          {habits.length === 0 ? (
            renderEmptyState()
          ) : (
            
            <View style={styles.habitContainer}>
              {habits.map((habit) => (
                <HabitList
                  key={habit._id}
                  habitId={habit._id}
                  category={habit.category}
                  title={habit.title}
                  description={habit.description}
                  frequency={habit.frequency}
                  intention={habit.intention}
                  trigger={habit.trigger}
                  currentStreak={habit.currentStreak}
                  isCompleted={habit.isCompleted}
                  onDeleted={handleHabitDeleted}
                  onHabitUpdated={handleHabitUpdated}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
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
  scrollView: {
    flex: 1,
    ...theme.size.full_width,
  },
  scrollContent: {
    paddingTop: theme.gap.md,
    flexGrow: 1,
     ...theme.size.full_width,
  },
  habitContainer: {
    ...theme.flex.column,
    gap: theme.gap.s,
     ...theme.size.full_width,
  },
  loadingContainer: {
    flex: 1,
    ...theme.align.center,
    paddingTop: theme.gap.xl,
  },
  loadingText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.dark_text,
  },
  emptyContainer: {
    flex: 1,
    ...theme.align.center,
    paddingTop: theme.gap.xl,
    ...theme.padding.horizontal.l,
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.dark_text,
    ...theme.typography.align.center,
    marginBottom: theme.gap.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.s,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.dark_text,
    ...theme.typography.align.center,
    opacity: 0.7,
    lineHeight: 20,
  },
  title: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});