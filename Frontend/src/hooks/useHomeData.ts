// src/hooks/useHomeData.ts
import { useState, useEffect, useCallback } from "react";
import { getUserHabits } from "../services/habitService";
import { completeHabit } from "../services/userService";
import { useXpAchievements } from "./useXpAchievements";

export function useHomeData(user: any) {
    const [habits, setHabits] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const { fetchXpAchievements } = useXpAchievements();

    const fetchData = useCallback(async () => {
        if (!user) return;

        // Search for XP and achievements
        fetchXpAchievements();

        try {
            // Get User Habits
            const data = await getUserHabits(user.token);
            setHabits(data);
        } catch (err) {
            console.error("Error searching for habits:", err);
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


            // Atualiza XP e nível imediatamente no contexto
            if (response.newLevel != null) {
                setUser(prev => ({
                    ...prev,
                    currentXp: (prev.currentXp ?? 0) + response.xpGained,
                    level: response.newLevel,
                }));
            }

            // Update XP/Level
            await fetchXpAchievements();
        } catch (err: any) {
            console.error("Error completing habit:", err.response?.data || err.message);
        }
    }, [user, setUser, fetchXpAchievements]);

    return {
        habits,
        selectedDate,
        refreshing,
        onRefresh,
        handleDaySelect,
        handleComplete,
    };
}
function setUser(arg0: (prev: any) => any) {
    throw new Error("Function not implemented.");
}

