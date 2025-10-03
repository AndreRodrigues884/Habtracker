// src/hooks/useCreateHabitForm.ts
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { createHabit, getHabitEnums } from "../services/habitService";

export function useCreateHabitForm(user: any) {
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [trigger, setTrigger] = useState("");
  const [intention, setIntention] = useState("");
  const [loading, setLoading] = useState(false);

  // Backend options
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [frequencies, setFrequencies] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchEnums = async () => {
      if (!user) return;
      try {
        const data = await getHabitEnums(user.token);
        setCategories(data.categories.map((c: string) => ({ label: c, value: c })));
        setFrequencies(data.frequencies.map((f: string) => ({ label: f, value: f })));
      } catch (err) {
        console.error("Error fetching enums:", err);
        Alert.alert("Error", "Unable to load options.");
      }
    };
    fetchEnums();
  }, [user]);

  const validateForm = () => {
    const errors: string[] = [];
    if (!title.trim()) errors.push("Title");
    if (!category) errors.push("Category");
    if (!frequency) errors.push("Frequency");

    if (errors.length > 0) {
      Alert.alert("Required fields", `Fill in the following fields: ${errors.join(", ")}`);
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
      Alert.alert("Sucess", response.message || "Habit successfully created!");
      resetForm();
    } catch (error: any) {
      console.error("Habit-creating error:", error);
      Alert.alert("Error", error?.response?.data?.message || "Couldn't create the habit.");
    } finally {
      setLoading(false);
    }
  };

  return {
    title, setTitle,
    description, setDescription,
    category, setCategory,
    frequency, setFrequency,
    startDate, setStartDate,
    endDate, setEndDate,
    trigger, setTrigger,
    intention, setIntention,
    loading,
    categories,
    frequencies,
    handleCreateHabit
  };
}
