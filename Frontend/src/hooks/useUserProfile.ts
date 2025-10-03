import { useState, useEffect, useCallback } from "react";
import { getUserProfile, uploadUserAvatar } from "../services/userService";
import { getUserHabits } from "../services/habitService";
import { User } from "../types/User";
import { Habit } from "../types/Habit";

export function useUserProfile(token: string | null, setUser: (u: any) => void) {
  const [profile, setProfile] = useState<User | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [favoriteHabit, setFavoriteHabit] = useState<Habit | null>(null);
  const [favoriteCurrentHabit, setFavoriteCurrentHabit] = useState<Habit | null>(null);
  const [categoryStats, setCategoryStats] = useState<{ label: string; count: number }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;

    const data = await getUserProfile(token);
    setProfile(data);
    setAvatarUri(data.avatar);

    //Get User Habits
    const habits: Habit[] = await getUserHabits(token);
    if (!habits || habits.length === 0) {
      setFavoriteHabit(null);
      setFavoriteCurrentHabit(null);
      setCategoryStats([]);
      return;
    }

    const topLongest = habits.reduce((max, h) => (h.longestStreak > max.longestStreak ? h : max), habits[0]);
    const topCurrent = habits.reduce((max, h) => (h.currentStreak > max.currentStreak ? h : max), habits[0]);
    setFavoriteHabit(topLongest);
    setFavoriteCurrentHabit(topCurrent);

    const counts: Record<string, number> = {};
    for (const h of habits) {
      const weekArr = (h as any).completedDaysThisWeek as boolean[] | undefined;
      const completedThisWeek = Array.isArray(weekArr) ? weekArr.reduce((sum, v) => sum + (v ? 1 : 0), 0) : 0;
      counts[h.category] = (counts[h.category] || 0) + completedThisWeek;
    }
    const stats = Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .filter(row => row.count > 0)
      .sort((a, b) => b.count - a.count);
    setCategoryStats(stats);
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const pickImage = useCallback(async () => {
    if (!token) return null;
    const ImagePicker = await import('expo-image-picker');
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return null;
    const uri = result.assets[0].uri;
    const data = await uploadUserAvatar(token, uri);
    setAvatarUri(data.avatar);
    setProfile((prev: User | null) => prev ? { ...prev, avatar: data.avatar } : prev);
    setUser((prev: User | null) => prev ? { ...prev, avatar: data.avatar } : prev);
    return data.avatar;
  }, [token, setUser]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return {
    profile,
    avatarUri,
    favoriteHabit,
    favoriteCurrentHabit,
    categoryStats,
    refreshing,
    onRefresh,
    pickImage,
  };
}
