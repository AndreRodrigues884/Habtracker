import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { WeekCalendarProps, WeekDay } from "../types/Components";
import { useWeekCalendar } from "../hooks/useWeekCalendar";

const WeekCalendar: React.FC<WeekCalendarProps> = ({ onDaySelect }) => {
  const { weekDays, selectedDate, handleDayPress } = useWeekCalendar(onDaySelect);

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
    ...theme.padding.vertical.md,
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
