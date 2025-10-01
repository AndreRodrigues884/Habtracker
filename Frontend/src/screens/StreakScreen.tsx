import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";
import { useThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import { getUserHabits } from "../services/habitService";
import { Habit } from "../types/Habit";
import HealthIcon from "../assets/icons/health.svg";
import ProductivityIcon from "../assets/icons/productivity.svg";
import LearningIcon from "../assets/icons/learning.svg";
import CreativityIcon from "../assets/icons/creativity.svg";
import LifestyleIcon from "../assets/icons/lifestyle.svg";
import SocialIcon from "../assets/icons/social.svg";

const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"]; // Monday-first

function CategoryIcon({ category }: { category: Habit["category"] }) {
  switch (category) {
    case "health":
      return <HealthIcon width={20} height={20} />;
    case "productivity":
      return <ProductivityIcon width={20} height={20} />;
    case "learning":
      return <LearningIcon width={20} height={20} />;
    case "creativity":
      return <CreativityIcon width={20} height={20} />;
    case "lifestyle":
      return <LifestyleIcon width={20} height={20} />;
    case "social":
      return <SocialIcon width={20} height={20} />;
    default:
      return null;
  }
}

function getStartOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0..6, Sun=0
  const diffToMonday = (day + 6) % 7; // 0 for Monday, 6 for Sunday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

function computeCompletedWeekdays(habit: any): boolean[] {
  // If backend provides detailed days, prefer it:
  if (Array.isArray(habit.completedDaysThisWeek) && habit.completedDaysThisWeek.length === 7) {
    return habit.completedDaysThisWeek as boolean[];
  }

  // Fallback heuristic: mark only the lastCompletionDate if it's within this week
  const filled = new Array(7).fill(false) as boolean[];
  if (!habit.lastCompletionDate) return filled;
  const last = new Date(habit.lastCompletionDate);
  const start = getStartOfWeekMonday(new Date());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  if (last >= start && last < end) {
    // Map JS weekday (Sun=0..Sat=6) to Monday-first index 0..6
    const jsDay = last.getDay();
    const mondayFirstIndex = (jsDay + 6) % 7;
    filled[mondayFirstIndex] = true;
  }
  return filled;
}

export const StreakScreen = () => {
  const { token } = useContext(AuthContext);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { theme: t } = useThemeContext();

  const fetchHabits = useCallback(async () => {
    if (!token) return;
    try {
      const h = await getUserHabits(token);
      setHabits(h || []);
    } catch (e) {
      console.error("Erro ao buscar hábitos (streak):", e);
    }
  }, [token]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  }, [fetchHabits]);

  const renderItem = ({ item }: { item: Habit }) => {
    const weekDots = computeCompletedWeekdays(item);
    return (
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.iconWrap}>
            <CategoryIcon category={item.category} />
          </View>
          <View style={styles.titleWrap}>
            <Text style={styles.habitTitle}>{item.title}</Text>
            <Text style={styles.streakText}>Streak: {item.currentStreak}</Text>
          </View>
        </View>
        <View style={styles.right}>
          {weekdayLabels.map((label, idx) => (
            <View key={label + idx} style={[styles.dayBox, weekDots[idx] && styles.dayBoxFilled]}>
              <Text style={[styles.dayBoxText, weekDots[idx] && styles.dayBoxTextFilled]}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <Header />
      <Text style={[styles.title, { color: t.colors.dark_text }]}>Habits Streaks</Text>
      <FlatList
        data={habits}
        keyExtractor={(h) => h._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
    backgroundColor: theme.colors.background,
  },
   title: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  listContent: {
    gap: theme.gap.sm,
    paddingBottom: 20,
  },
  row: {
    ...theme.size.full_width,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.padding.horizontal.l,
    ...theme.padding.vertical.xs,
    ...theme.flex.row,
    ...theme.align["space-between"],
    ...theme.align["center"],
  },
  left: {
    ...theme.flex.row,
    ...theme.align["center"],
    gap: theme.gap.s,
    flexShrink: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    ...theme.align["center"],
  },
  titleWrap: {
    flexShrink: 1,
  },
  habitTitle: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.s,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  streakText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  right: {
    ...theme.flex.row,
    gap: theme.gap.xs,
  },
  dayBox: {
    minWidth: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: theme.colors.white,
    borderWidth: theme.borderColor.borderWidth,
    borderColor: theme.borderColor.borderSecondColor,
    ...theme.align["center"],
  },
  dayBoxFilled: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayBoxText: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  dayBoxTextFilled: {
    color: theme.colors.white,
  },
});