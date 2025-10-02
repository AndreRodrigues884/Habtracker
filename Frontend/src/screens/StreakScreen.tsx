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
import FireIcon from '../assets/icons/fire.svg';

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
  const filled = new Array(7).fill(false);
  if (!habit.completionDates || habit.completionDates.length === 0) return filled;

  const startOfWeek = getStartOfWeekMonday(new Date());

  habit.completionDates.forEach((dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.floor((d.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7) {
      filled[diff] = true;
    }
  });

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
          <CategoryIcon category={item.category} />
          <View style={styles.titleWrap}>
            <Text style={styles.habitTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.streakContainer}>
              <FireIcon width={10} height={10} />
              <Text style={styles.streakText}>{item.currentStreak} days</Text>
            </View>
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
    ...theme.flex.column,
    gap: theme.gap.lg,
    backgroundColor: theme.colors.background,
    flex: 1,
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
    ...theme.padding.horizontal.md,
    ...theme.padding.vertical.xs,
    ...theme.flex.row,
    ...theme.align["space-between"],
    alignItems: 'center',
  },
  left: {
    ...theme.flex.row,
    alignItems: 'center',
    gap: theme.gap.s,
    flexShrink: 1,
  },
  titleWrap: {
    flexShrink: 1,
  },
  habitTitle: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.s,
    fontFamily: theme.typography.fontFamily.semibold,
    maxWidth: 120, // limita largura do título
  },
  streakText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  right: {
    ...theme.flex.row,
    gap: theme.gap.xs,
    flexWrap: 'wrap', // permite quebrar linha se não couber
  },
  dayBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
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
    fontSize: theme.typography.sizes.xs - 1,
    fontFamily: theme.typography.fontFamily.medium,
  },
  dayBoxTextFilled: {
    color: theme.colors.white,
  },
  streakContainer: {
    ...theme.flex.row,
    ...theme.align["center"],
    gap: theme.gap.xs,
    ...theme.size.hug,
  }
});