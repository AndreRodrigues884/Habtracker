import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView } from "react-native";
import { theme } from "../styles/theme";
import { useThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { CustomDropdown } from "../components/CustomDropdown";
import { DatePickerInput } from "../components/DatePickerInput";
import { useCreateHabitForm } from "../hooks/useCreateHabitForm";

export const CreateScreen = () => {
  const { user } = useContext(AuthContext);
  const { theme: t } = useThemeContext();
  const form = useCreateHabitForm(user);

  return (
    <KeyboardAvoidingView
      style={[styles.mainContainer, { backgroundColor: t.colors.background }]}
      behavior="padding" enabled keyboardVerticalOffset={100}
    >
      <Header />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, form.loading && styles.disabledButton]} onPress={form.handleCreateHabit} disabled={form.loading}>
              <Text style={styles.buttonText}>
                {form.loading ? "..." : "Create Habit"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.colors.dark_text }]}>Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
                value={form.title}
                onChangeText={form.setTitle}
                placeholder="Habit title"
                placeholderTextColor={t.colors.gray}
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.colors.dark_text }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
                value={form.description}
                onChangeText={form.setDescription}
                placeholder="Habit description"
                placeholderTextColor={t.colors.gray}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            <View style={styles.inputGroup}>
              <CustomDropdown
                label="Category *"
                options={form.categories}
                selectedValue={form.category}
                onSelect={form.setCategory}
                placeholder="Select category"
              />
            </View>

            <View style={styles.inputGroup}>
              <CustomDropdown
                label="Frequency *"
                options={form.frequencies}
                selectedValue={form.frequency}
                onSelect={form.setFrequency}
                placeholder="Select frequency"
              />
            </View>

            <View style={styles.inputGroup}>
              <DatePickerInput
                label="Start Date *"
                date={form.startDate}
                onDateChange={(date) => form.setStartDate(date)}
                minimumDate={new Date()}
              />
            </View>

            <View style={styles.inputGroup}>
              <DatePickerInput
                label="End Date"
                date={form.endDate}
                onDateChange={(date) => form.setEndDate(date)}
                optional
                minimumDate={form.startDate}
                placeholder="End Date (optional)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.colors.dark_text }]}>Trigger</Text>
              <TextInput
                style={[styles.input, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
                placeholder="Ex: After Breakfast"
                placeholderTextColor={t.colors.gray}
                value={form.trigger}
                onChangeText={form.setTrigger}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.colors.dark_text }]}>Intention</Text>
              <TextInput
                style={[styles.input, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
                placeholder="Ex: Stay healthy"
                placeholderTextColor={t.colors.gray}
                value={form.intention}
                onChangeText={form.setIntention}
                maxLength={100}
              />
            </View>
          </View>
        </ScrollView>
      </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    ...theme.padding.horizontal.xxl,
    paddingTop: theme.padding.vertical.xxl.paddingVertical,
    ...theme.align["top-left"],
    ...theme.flex.column,
    gap: theme.gap.lg,
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    ...theme.size.full_width,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.gap.xl,
  },
  formContainer: {
    ...theme.size.full_width,
    paddingTop: theme.gap.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.dark_text,
    marginBottom: theme.gap.lg,
    ...theme.typography.align.center,
  },
  inputGroup: {
    marginBottom: theme.gap.xs,
    ...theme.size.full_width,
    ...theme.padding.vertical.xs
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
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    paddingVertical: theme.gap.md,
    paddingTop: theme.gap.xl,
    ...theme.size.full_width,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    ...theme.padding.vertical.sm,
    ...theme.align.center,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  disabledButton: {
    opacity: 0.6,
  },
});