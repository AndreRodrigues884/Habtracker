import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { WeekCalendarProps, WeekDay } from "../types/Components";

// helpers para datas
const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const WeekCalendar: React.FC<WeekCalendarProps> = ({ onDaySelect }) => {
    const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
    generateWeekAroundToday();
    const today = new Date();
    setSelectedDate(today);
    if (onDaySelect) onDaySelect(today);
  }, []);

    const generateWeekAroundToday = () => {
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
  };

    const handleDayPress = (day: WeekDay) => {
    setSelectedDate(day.fullDate);
    if (onDaySelect) onDaySelect(day.fullDate);
  };

    return (
    <View style={styles.container}>
      {weekDays.map((day) => {
        const isSelected =
          selectedDate &&
          day.fullDate.toDateString() === selectedDate.toDateString();

        return (
          <Pressable
            key={day.fullDate.toDateString()}
            style={[styles.dayContainer, isSelected && styles.daySelected]}
            onPress={() => handleDayPress(day)}
          >
            <Text style={[styles.dayLabel, isSelected && styles.textSelected]}>
              {day.label}
            </Text>
            <Text style={[styles.dayNumber, isSelected && styles.textSelected]}>
              {day.dateNumber}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        ...theme.flex.row,
        ...theme.align["space-between"],
        ...theme.align["center"],
        ...theme.size.full_width,
        gap: theme.gap.sm,
    },
    dayContainer: {
        ...theme.size.hug,
        ...theme.flex.column,
        gap: theme.gap.xs,
        ...theme.align["top-center"],
        ...theme.padding.horizontal.xs,
        ...theme.padding.vertical.xs,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.sm,
    },
    daySelected: {
        backgroundColor: theme.colors.primary
    },
    dayLabel: {
        fontFamily: theme.typography.fontFamily.semibold,
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.dark_text,
    },
    dayNumber: {
        fontSize: theme.typography.sizes.xs,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.dark_text,
    },
    textSelected: {
        color: theme.colors.white,
    },
});

export default WeekCalendar;
