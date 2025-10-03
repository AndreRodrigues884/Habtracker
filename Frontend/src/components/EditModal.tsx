import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";
import { theme } from "../styles/theme";
import { editUserHabit } from "../services/habitService";
import { CustomDropdown } from "./CustomDropdown";
import { DatePickerInput } from "./DatePickerInput";
import { HabitUpdate, CategoryType, FrequencyType } from "../types/Habit";
import { EditHabitModalProps } from "../types/Components";



const categories = [
  { value: 'health', label: 'Health' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'learning', label: 'Learning' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'social', label: 'Social' },
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Niweekly' },
  { value: 'twice_per_week', label: 'twice_per_week' },
  { value: 'three_times_per_week', label: 'three_times_per_week' },
  { value: 'four_times_per_week', label: 'four_times_per_week' },
  { value: 'five_times_per_week', label: 'five_times_per_week' },
  { value: 'weekends', label: 'Weekends' },
];

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  visible,
  onClose,
  habit,
  token,
  onHabitUpdated,
}) => {
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || '');
  const [category, setCategory] = useState<string>(habit.category);
  const [frequency, setFrequency] = useState<string>(habit.frequency);
  const [intention, setIntention] = useState(habit.intention || '');
  const [trigger, setTrigger] = useState(habit.trigger || '');
  const [endDate, setEndDate] = useState<Date | null>(
    habit.endDate ? new Date(habit.endDate) : null
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Habit title is required.");
      return;
    }

    if (!category) {
      Alert.alert("Error", "Category is required.");
      return;
    }

    if (!frequency) {
      Alert.alert("Error", "Frequency is mandatory.");
      return;
    }

    setLoading(true);
    try {
      const updates: HabitUpdate = {
        title: title.trim(),
        description: description.trim(),
        category: category as CategoryType,
        frequency: frequency as FrequencyType,
        intention: intention.trim() || undefined,
        trigger: trigger.trim() || undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      };

      await editUserHabit(token, habit.habitId, updates);
      
      onHabitUpdated(habit.habitId, updates);
      onClose();
      Alert.alert("Success", "Habit updated successfully!");
    } catch (error) {
      console.error("Error updating habit:", error);
      Alert.alert("Error", "Could not update habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(habit.title);
    setDescription(habit.description || '');
    setCategory(habit.category);
    setFrequency(habit.frequency);
    setIntention(habit.intention || '');
    setTrigger(habit.trigger || '');
    setEndDate(habit.endDate ? new Date(habit.endDate) : null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Habit</Text>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView 
          style={styles.form} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Habit title"
              placeholderTextColor={styles.placeholder.color}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Habit description (optional)"
              placeholderTextColor={styles.placeholder.color}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <CustomDropdown
            label="Category *"
            options={categories}
            selectedValue={category}
            onSelect={setCategory}
            placeholder="Select category"
          />

          <CustomDropdown
            label="Frequency *"
            options={frequencies}
            selectedValue={frequency}
            onSelect={setFrequency}
            placeholder="Select frequency"
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Intention</Text>
            <TextInput
              style={styles.input}
              value={intention}
              onChangeText={setIntention}
              placeholder="Why do you want to build this habit?"
              placeholderTextColor={styles.placeholder.color}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trigger</Text>
            <TextInput
              style={styles.input}
              value={trigger}
              onChangeText={setTrigger}
              placeholder="What will remind you to do this habit?"
              placeholderTextColor={styles.placeholder.color}
              maxLength={100}
            />
          </View>

          <DatePickerInput
            label="End Date"
            date={endDate}
            onDateChange={(date) => setEndDate(date)}
            optional
            minimumDate={new Date()}
            placeholder="End Date (opcional)"
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          
          <Pressable
            style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Update'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    ...theme.flex.row,
    ...theme.align['space-between'],
    ...theme.padding.horizontal.l,
    paddingVertical: theme.gap.md,
    borderBottomWidth: theme.borderColor.borderWidth,
    borderBottomColor: theme.colors.gray,
    paddingTop: 60, // Para iOS status bar
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.dark_text,
  },
  closeButton: {
    padding: theme.gap.xs,
  },
  closeButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.dark_text,
    fontFamily: theme.typography.fontFamily.medium,
  },
  form: {
    flex: 1,
  },
  formContent: {
    ...theme.padding.horizontal.l,
    paddingTop: theme.gap.lg,
    paddingBottom: theme.gap.xl,
  },
  inputGroup: {
    marginBottom: theme.gap.md,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.dark_text,
    marginBottom: theme.gap.xs,
  },
  input: {
    borderWidth: theme.borderColor.borderWidth,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    ...theme.padding.horizontal.sm,
    ...theme.padding.vertical.sm,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    backgroundColor: theme.colors.white,
    color: theme.colors.dark_text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  placeholder: {
    color: theme.colors.gray,
  },
  buttonContainer: {
    ...theme.flex.row,
    ...theme.padding.horizontal.l,
    paddingVertical: theme.gap.md,
    gap: theme.gap.s,
    borderTopWidth: theme.borderColor.borderWidth,
    borderTopColor: theme.colors.gray,
    backgroundColor: theme.colors.white,
  },
  button: {
    flex: 1,
    paddingVertical: theme.gap.s,
    borderRadius: theme.borderRadius.md,
    ...theme.align.center,
  },
  cancelButton: {
    backgroundColor: theme.colors.white,
    borderWidth: theme.borderColor.borderWidth,
    borderColor: theme.colors.gray,
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.dark_text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
});