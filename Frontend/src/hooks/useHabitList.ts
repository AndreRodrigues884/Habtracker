import { useState, useEffect, useCallback } from "react";
import { getUserHabits } from "../services/habitService";

export function useHabitList(user: any) {
    const [habits, setHabits] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHabits = useCallback(async (showLoading = true) => {
        if (!user?.token) return;
        try {
            if (showLoading) setLoading(true);
            //Get User Habits
            const data = await getUserHabits(user.token);
            setHabits(data || []);
        } catch (err) {
            console.error("Error fetching habits:", err);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        if (user?.token) fetchHabits();
    }, [user?.token, fetchHabits]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchHabits(false);
        setRefreshing(false);
    }, [fetchHabits]);

    const updateHabit = useCallback((habitId: string, updatedData: any) => {
        setHabits(prev => prev.map(h => h._id === habitId ? { ...h, ...updatedData, updatedAt: new Date() } : h));
    }, []);

    const deleteHabit = useCallback((habitId: string) => {
        setHabits(prev => prev.filter(h => h._id !== habitId));
    }, []);

    return {
        habits,
        loading,
        refreshing,
        onRefresh,
        updateHabit,
        deleteHabit,
    };
}
