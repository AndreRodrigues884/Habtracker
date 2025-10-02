import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, RefreshControl } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Header } from "../components/Header";
import { theme } from "../styles/theme";
import { useThemeContext } from "../contexts/ThemeContext";
import { getUserProfile, uploadUserAvatar } from "../services/userService";
import { AuthContext } from "../contexts/AuthContext";
import { User } from "../types/User";
import { getUserHabits } from "../services/habitService";
import { Habit } from "../types/Habit";
import FireIcon from '../assets/icons/fire.svg';


export const ProfileScreen = () => {
  const { theme: t } = useThemeContext();

  const { token, user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState<User | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);
  const [favoriteHabit, setFavoriteHabit] = useState<Habit | null>(null);
  const [favoriteCurrentHabit, setFavoriteCurrentHabit] = useState<Habit | null>(null);
  const [refreshing, setRefreshing] = useState(false);



  const fetchData = useCallback(async () => {
    if (!token) return;
    const data = await getUserProfile(token);
    setProfile(data);
    setAvatarUri(data.avatar);
    const habits: Habit[] = await getUserHabits(token);
    if (!habits || habits.length === 0) {
      setFavoriteHabit(null);
      setFavoriteCurrentHabit(null);
    } else {
      const topLongest = habits.reduce((max, h) => (h.longestStreak > max.longestStreak ? h : max), habits[0]);
      const topCurrent = habits.reduce((max, h) => (h.currentStreak > max.currentStreak ? h : max), habits[0]);
      setFavoriteHabit(topLongest);
      setFavoriteCurrentHabit(topCurrent);
    }
  }, [token]);

  // Carrega dados do usuário ao montar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  // Escolher imagem
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permissão necessária", "Permita acesso às fotos");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (token) {
        const data = await uploadUserAvatar(token, uri);
        setAvatarUri(data.avatar);          // URL completa
        setProfile(prev => prev ? { ...prev, avatar: data.avatar } : prev);
        setUser(prev => prev ? { ...prev, avatar: data.avatar } : prev);
      }
    }
  };

  if (!profile) return <Text>Carregando...</Text>;



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
    ...theme.padding.vertical.md,
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