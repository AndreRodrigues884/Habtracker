import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";
import { AuthContext } from "../contexts/AuthContext";
import { getUserHabits } from "../services/habitService";
import { HabitList } from "../components/HabitList";
import { Habit } from "../types/Habit";
import { useThemeContext } from "../contexts/ThemeContext";
import { useHabitList } from "../hooks/useHabitList";

export const ListScreen = () => {
  const { user } = useContext(AuthContext);
  const { theme: t } = useThemeContext();

  const {
    habits,
    loading,
    refreshing,
    onRefresh,
    updateHabit,
    deleteHabit,
  } = useHabitList(user);

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
      <ActivityIndicator size="large" color={t.colors.primary} />
    </View>
  );

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
      <Text style={[styles.listTitle, { color: t.colors.dark_text }]}>Habit List</Text>
      {loading ? (
        renderLoadingState()
      ) : (
        <ScrollView
          style={styles.scrollView}
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
          {habits.length === 0
            ? renderEmptyState()
            : habits.map((habit) => (
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
                onHabitUpdated={updateHabit}
                onDeleted={deleteHabit}
              />
            ))}
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
    flexGrow: 1,
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
  listTitle: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});