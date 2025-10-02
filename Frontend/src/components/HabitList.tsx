import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { theme } from "../styles/theme";
import { HabitListProps } from "../types/Habit";
import HealthIcon from '../assets/icons/health.svg';
import ProductivityIcon from '../assets/icons/productivity.svg';
import LearningIcon from '../assets/icons/learning.svg';
import LifestyleIcon from '../assets/icons/lifestyle.svg';
import SocialIcon from '../assets/icons/social.svg';
import CreativityIcon from '../assets/icons/creativity.svg';
import FireIcon from '../assets/icons/fire.svg';
import DeleteIcon from '../assets/icons/delete.svg';
import EditIcon from '../assets/icons/edit.svg';
import { deleteUserHabit } from "../services/habitService";
import { AuthContext } from "../contexts/AuthContext";
import { EditHabitModal } from "../components/EditModal";

const CategoryIcons: Record<string, any> = {
  health: HealthIcon,
  productivity: ProductivityIcon,
  learning: LearningIcon,
  creativity: CreativityIcon,
  lifestyle: LifestyleIcon,
  social: SocialIcon,
};

export const HabitList: React.FC<HabitListProps> = ({
  habitId,
  category,
  title,
  currentStreak,
  description = '',
  frequency = 'daily',
  intention = '',
  trigger = '',
  onDeleted,
  onHabitUpdated,
}) => {
  const Icon = CategoryIcons[category];
  const { user } = React.useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    Alert.alert(
      "Confirmar Exclusão",
      "Tens a certeza de que queres eliminar este hábito?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              await deleteUserHabit(user.token, habitId);
              if (onDeleted) onDeleted(habitId);
            } catch (err) {
              console.error("Erro ao deletar hábito:", err);
              Alert.alert("Erro", "Não foi possível eliminar o hábito.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleHabitUpdated = (habitId: string, updatedData: any) => {
    if (onHabitUpdated) {
      onHabitUpdated(habitId, updatedData);
    }
  };

  const habitData = {
    habitId,
    title,
    description,
    category,
    frequency,
    intention,
    trigger,
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Left side: Icon + text */}
        <View style={styles.left}>
          {Icon && <Icon width={16} height={16} />}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {title}
            </Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streak}>{currentStreak}</Text>
              <FireIcon width={16} height={16} />
            </View>
          </View>
        </View>

        {/* Right side: action buttons */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <View style={styles.editButtonContent}>
              <Text style={styles.editButtonText}>Edit</Text>
              <EditIcon width={12} height={12} />
            </View>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <View style={styles.deleteButtonContent}>
              <Text style={styles.deleteButtonText}>Delete</Text>
              <DeleteIcon width={12} height={12} />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Modal de Edição */}
      {user && (
        <EditHabitModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          habit={habitData}
          token={user.token}
          onHabitUpdated={handleHabitUpdated}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.size.full_width,
    marginBottom: theme.gap.s,
    ...theme.size.full_width,               
  },
  card: {
    ...theme.flex.row,
    ...theme.align["space-between"],
    ...theme.align["center"],
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.padding.horizontal.sm,
    ...theme.padding.vertical.sm,
    borderWidth: theme.borderColor.borderWidth,
    borderColor: theme.colors.gray,
    ...theme.size.full_width,   
    flex: 1,                 
  },
  left: {
    ...theme.flex.row,
    ...theme.align["center"],
    flex: 1,                       
    gap: theme.gap.s,
    ...theme.size.full_width,  
  },
  textContainer: {
    flex: 1,
    gap: theme.gap.xs,
    ...theme.flex.row,
  },
  title: {
    fontSize: theme.typography.sizes.s,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.dark_text,
  },
  streakContainer: {
    ...theme.flex.row,
    ...theme.align["center"],
    gap: theme.gap.xs,
  },
  streak: {
    fontSize: theme.typography.sizes.s,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.dark_text,
  },
  buttonContainer: {
    ...theme.flex.row,
    gap: theme.gap.xs,
    ...theme.align["center"],
  },
  editButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    ...theme.padding.horizontal.sm,
    ...theme.padding.vertical.xs,
  },
  editButtonContent: {
    ...theme.flex.row,
    ...theme.align["center"],
    gap: theme.gap.xs,
  },
  editButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: "#FFE5E5",
    borderRadius: theme.borderRadius.sm,
    ...theme.padding.horizontal.sm,
    ...theme.padding.vertical.xs,
  },
  deleteButtonContent: {
    ...theme.flex.row,
    ...theme.align["center"],
    gap: theme.gap.xs,
  },
  deleteButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.red,
  },
});
