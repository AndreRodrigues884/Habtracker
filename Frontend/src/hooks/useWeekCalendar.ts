// src/hooks/useWeekCalendar.ts
import { useState, useEffect, useCallback } from "react";
import { WeekDay } from "../types/Components";

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function useWeekCalendar(onDaySelect?: (date: Date) => void) {
    // Status that saves the days of the current week 
    const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
    // Status that saves the currently selected date
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Generates the 7 days (3 before, today and 3 after)
    const generateWeekAroundToday = useCallback(() => {
        const today = new Date();
        const days: WeekDay[] = [];

        for (let i = -3; i <= 3; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);

            const dayOfWeekIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
            days.push({
                label: daysOfWeek[dayOfWeekIndex],
                dateNumber: d.getDate(),
                fullDate: d,
            });
        }

        setWeekDays(days);
    }, []);

    const handleDayPress = useCallback(
        (day: WeekDay) => {
            setSelectedDate(day.fullDate); // update the status
            if (onDaySelect) onDaySelect(day.fullDate);
        },
        [onDaySelect]
    );

    // Executes when assembling the component
    useEffect(() => {
        generateWeekAroundToday(); // Generates the week
        const today = new Date();
        setSelectedDate(today); // Mark today as selected
        if (onDaySelect) onDaySelect(today);
    }, [generateWeekAroundToday, onDaySelect]);

    return {
        weekDays,
        selectedDate,
        handleDayPress,
    };
}
