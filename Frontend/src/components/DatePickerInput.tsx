import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { theme } from "../styles/theme";
import { DatePickerInputProps } from "../types/Components";



export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  date,
  onDateChange,
  optional = false,
  minimumDate,
  maximumDate,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  const handleConfirm = (selectedDate: Date) => {
    setVisible(false);
    onDateChange(selectedDate);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDisplayValue = () => {
    if (date) {
      return formatDate(date);
    }
    return placeholder || "Selecionar data";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {!optional && "*"}
      </Text>

      <Pressable 
        style={[styles.button, date && styles.buttonSelected]} 
        onPress={() => setVisible(true)}
      >
        <Text style={[
          styles.buttonText,
          !date && styles.placeholderText
        ]}>
          {getDisplayValue()}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        date={date ?? new Date()}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale="pt_PT"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.gap.s,
    ...theme.size.full_width,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.dark_text,
    marginBottom: theme.gap.xs,
  },
  button: {
    ...theme.flex.row,
    ...theme.align['space-between'],
    borderWidth: theme.borderColor.borderWidth,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    ...theme.padding.horizontal.sm,
    ...theme.padding.vertical.sm,
    backgroundColor: theme.colors.white,
  },
  buttonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  buttonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.dark_text,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.gray,
    opacity: 0.7,
  },
  icon: {
    fontSize: theme.typography.sizes.sm,
    marginLeft: theme.gap.xs,
  },
});