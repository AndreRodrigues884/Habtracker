import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { theme } from "../styles/theme";
import { useThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { createHabit, getHabitEnums } from "../services/habitService";
import { CustomDropdown } from "../components/CustomDropdown";
import { DatePickerInput } from "../components/DatePickerInput";

export const CreateScreen = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { theme: t } = useThemeContext();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [trigger, setTrigger] = useState("");
  const [intention, setIntention] = useState("");

  // Options from backend
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [frequencies, setFrequencies] = useState<{ label: string; value: string }[]>([]);

  // Fetch enums from backend
  useEffect(() => {
    const fetchEnums = async () => {
      if (!user) return;
      try {
        const data = await getHabitEnums(user.token);
        setCategories(data.categories.map((c: string) => ({ label: c, value: c })));
        setFrequencies(data.frequencies.map((f: string) => ({ label: f, value: f })));
      } catch (err) {
        console.error("Erro ao buscar enums:", err);
        Alert.alert("Erro", "Não foi possível carregar as opções.");
      }
    };
    fetchEnums();
  }, [user]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!title.trim()) errors.push("Título");
    if (!category) errors.push("Categoria");
    if (!frequency) errors.push("Frequência");

    if (errors.length > 0) {
      Alert.alert(
        "Campos obrigatórios",
        `Preenche os seguintes campos: ${errors.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(null);
    setFrequency(null);
    setStartDate(new Date());
    setEndDate(new Date());
    setTrigger("");
    setIntention("");
  };

  const handleCreateHabit = async () => {
    if (!user) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category: category!,
        frequency: frequency!,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : undefined,
        trigger: trigger.trim() || undefined,
        intention: intention.trim() || undefined,
      };

      const response = await createHabit(payload, user.token);

      Alert.alert("Sucesso", response.message || "Hábito criado com sucesso!");
      resetForm();
    } catch (error: any) {
      console.error("Erro ao criar hábito:", error);
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Não foi possível criar o hábito."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.mainContainer, { backgroundColor: t.colors.background }]}
      behavior="position" enabled keyboardVerticalOffset={100}
    >
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleCreateHabit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "..." : "Create Habit"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: t.colors.dark_text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Habit title"
              placeholderTextColor={t.colors.gray}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: t.colors.dark_text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
              value={description}
              onChangeText={setDescription}
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
              options={categories}
              selectedValue={category}
              onSelect={setCategory}
              placeholder="Select category"
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomDropdown
              label="Frequency *"
              options={frequencies}
              selectedValue={frequency}
              onSelect={setFrequency}
              placeholder="Select frequency"
            />
          </View>

          <View style={styles.inputGroup}>
            <DatePickerInput
              label="Start Date *"
              date={startDate}
              onDateChange={(date) => setStartDate(date)}
              minimumDate={new Date()}
            />
          </View>

          <View style={styles.inputGroup}>
            <DatePickerInput
              label="End Date"
              date={endDate}
              onDateChange={(date) => setEndDate(date)}
              optional
              minimumDate={startDate}
              placeholder="End Date (optional)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: t.colors.dark_text }]}>Trigger</Text>
            <TextInput
              style={[styles.input, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
              placeholder="Ex: After Breakfast"
              placeholderTextColor={t.colors.gray}
              value={trigger}
              onChangeText={setTrigger}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: t.colors.dark_text }]}>Intention</Text>
            <TextInput
              style={[styles.input, { backgroundColor: t.colors.white, color: t.colors.dark_text, borderColor: t.colors.primary }]}
              placeholder="Ex: Stay healthy"
              placeholderTextColor={t.colors.gray}
              value={intention}
              onChangeText={setIntention}
              maxLength={100}
            />
          </View>
        </View>
      </ScrollView>
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