import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";
import { useThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import FireIcon from '../assets/icons/fire.svg';
import { useUserProfile } from "../hooks/useUserProfile";


export const ProfileScreen = () => {
  const { theme: t } = useThemeContext();
  const { token, setUser } = useContext(AuthContext);

  const {
    profile,
    avatarUri,
    favoriteHabit,
    favoriteCurrentHabit,
    categoryStats,
    refreshing,
    onRefresh,
    pickImage,
  } = useUserProfile(token, setUser);

  if (!profile) return <ActivityIndicator size="large" color={t.colors.primary} />



  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <Header />
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ paddingBottom: 24 }}
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
        <View style={styles.picContainer}>
          <View style={styles.profilePicWrapper}>
            <TouchableOpacity onPress={pickImage}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholder}>
                  <Text>Add Picture</Text>
                </View>
              )}
            </TouchableOpacity>
            {profile?.xp !== undefined && (
              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>{profile.xp} XP</Text>
              </View>
            )}
          </View>
          {profile?.name ? (
            <Text style={styles.profileName}>{profile.name}</Text>
          ) : null}
        </View>
        {/* Habits in Progress Tab */}
        <View style={styles.mainContainer}>
          {profile && (
            <View style={styles.tabContainer}>
              <View style={styles.progressContainer}>
                <Text style={[styles.tabText, { color: t.colors.dark_text }]}>Completed Habits</Text>
                <Text style={styles.tabCount}>{profile.habitsCompletedCount}</Text>
              </View>
            </View>
          )}
          {profile && (
            <View style={styles.tabContainer}>
              <View style={styles.progressContainer}>
                <Text style={[styles.tabText, { color: t.colors.dark_text }]}>Habits in Progress</Text>
                <Text style={styles.tabCount}>{profile.associatedhabits.length}</Text>
              </View>
            </View>
          )}
          {/* Favorite habit by current streak */}
          {favoriteCurrentHabit && (
            <View style={styles.favHabitContainer}>
              <View style={styles.favHabit}>
                <Text style={[styles.tabText, { color: t.colors.dark_text }]}>Favorite habit</Text>
                <Text style={styles.tabCount} numberOfLines={2}>{favoriteCurrentHabit.title}</Text>
              </View>
            </View>
          )}
          {favoriteHabit && (
            <View style={styles.tabContainer}>
              <View style={styles.biggestStreakContainer}>
                <View>
                  <Text style={[styles.tabText, { color: t.colors.dark_text }]}>Biggest Streak</Text>
                </View>
                <View>
                  <View style={styles.streakContainer}>
                    <Text style={styles.tabCount}>{favoriteHabit.longestStreak}</Text>
                    <FireIcon width={16} height={16} />
                    <Text style={styles.tabCount} numberOfLines={2}>{favoriteHabit.title}</Text>
                  </View>
                </View>

              </View>
            </View>
          )}
        </View>


        {/* Category overview (horizontal bars) */}
        <View style={styles.chartSection}>
          <Text style={[styles.badgesTitle, { color: t.colors.white }]}>This Week by Category</Text>
          {categoryStats.length === 0 ? (
            <Text style={[{ fontSize: theme.typography.sizes.s, fontFamily: theme.typography.fontFamily.regular, color: t.colors.dark_text, opacity: 0.7 }]}>No habits yet</Text>
          ) : (
            categoryStats.map((row) => {
              const max = Math.max(...categoryStats.map(s => s.count)) || 1;
              const pct = Math.min(1, row.count / max);
              return (
                <View key={row.label} style={styles.chartRow}>
                  <Text style={[styles.chartLabel, { color: t.colors.white }]} numberOfLines={1}>
                    {row.label}
                  </Text>
                  <View style={[styles.chartBarBg, { backgroundColor: t.colors.white, borderColor: t.borderColor?.borderSecondColor || '#eee' }]}>
                    <View style={[styles.chartBarFill, { width: `${pct * 100}%`, backgroundColor: t.colors.primary }]} />
                  </View>
                  <Text style={[styles.chartValue, { color: t.colors.primary }]}>{row.count}</Text>
                </View>
              );
            })
          )}
        </View>

        <View>
          <Text style={[styles.badgesTitle, { color: t.colors.dark_text }]}>Badges</Text>
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
    gap: theme.gap.md,
    backgroundColor: theme.colors.background,
    ...theme.size.full_width,
  },
  picContainer: {
    ...theme.align["center"],
    ...theme.size.full_width,
    ...theme.padding.vertical.md,
  },
  profilePicWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderColor.borderThirdWidth,
    borderColor: theme.borderColor.borderThirdColor,
  },
  placeholder: {
    width: 130,
    height: 130,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(45,105,255,0.1)", // adicionei backgroundColor
    ...theme.align["center"],
  },
  profileName: {
    marginTop: 8,
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  xpBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    ...theme.align["center"],
    borderWidth: theme.borderColor.borderWidth,
    borderColor: theme.colors.white,
  },
  xpText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.s,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  mainContainer: {
    gap: theme.gap.md,
  },
  tabContainer: {
    ...theme.padding.horizontal.l,
    ...theme.size.full_width,
    ...theme.padding.vertical.xs,
    backgroundColor: theme.colors.white,
    borderWidth: theme.borderColor.borderSecondWidth,
    borderColor: theme.borderColor.borderColor,
    borderRadius: theme.borderRadius.md,
  },
  progressContainer: {
    ...theme.flex.row,
    ...theme.align["space-between"],
    ...theme.align["center"],

  },
  favoriteContainer: {
    ...theme.flex.row,
    ...theme.align["center-left"],
    gap: theme.gap.md,
    ...theme.align["center"],
  },
  tabText: {
    ...theme.size.full_width,
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.s,
    fontFamily: theme.typography.fontFamily.medium,
  },
  tabCount: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  streakContainer: {
    ...theme.flex.row,
    ...theme.align["center"],
    gap: theme.gap.xs,
    ...theme.align["space-between"],
  },
  badgesTitle: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
    ...theme.padding.vertical.sm,
  },
  chartSection: {
    marginTop: theme.gap.md,
    ...theme.padding.horizontal.md,
    ...theme.padding.vertical.xs,
    ...theme.size.full_width,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
  },
  chartRow: {
    ...theme.flex.row,
    ...theme.align["center"],
    gap: theme.gap.xs,
    ...theme.padding.vertical.xs,
  },
  chartLabel: {
    width: 90,
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  chartBarBg: {
    flex: 1,
    height: 10,
    borderRadius: theme.borderRadius.sm,
    borderWidth: theme.borderColor.borderSecondWidth,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  chartValue: {
    minWidth: 24,
    textAlign: 'right',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  favHabitContainer: {
    ...theme.padding.horizontal.md,
    ...theme.padding.vertical.xs,
    ...theme.size.full_width,
    backgroundColor: theme.colors.white,
    borderWidth: theme.borderColor.borderSecondWidth,
    borderColor: theme.borderColor.borderColor,
    borderRadius: theme.borderRadius.md,
  },
  favHabit: {
    ...theme.flex.row,
    ...theme.align["space-between"],
    ...theme.align["center"],
    ...theme.size.full_width,
    ...theme.padding.horizontal.xxl,
  },
  biggestStreakContainer: {
    ...theme.flex.row,
    ...theme.size.full_width,
    ...theme.align["space-between"],
    alignItems: 'center',
  },
});