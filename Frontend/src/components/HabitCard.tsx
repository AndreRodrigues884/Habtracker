import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { theme } from "../styles/theme";
import { HabitCardProps } from "../types/Habit";
import HealthIcon from '../assets/icons/health.svg';
import ProductivityIcon from '../assets/icons/productivity.svg';
import LearningIcon from '../assets/icons/learning.svg';
import LifestyleIcon from '../assets/icons/lifestyle.svg';
import SocialIcon from '../assets/icons/social.svg';
import CreativityIcon from '../assets/icons/creativity.svg';
import FireIcon from '../assets/icons/fire.svg';
import CheckIcon from '../assets/icons/check.svg';

const CategoryIcons: Record<string, any> = {
    health: HealthIcon,
    productivity: ProductivityIcon,
    learning: LearningIcon,
    creativity: CreativityIcon,
    lifestyle: LifestyleIcon,
    social: SocialIcon,
};

export const HabitCard: React.FC<HabitCardProps> = memo(({ category, title, currentStreak, isCompleted = false, onComplete, style}) => {
    const Icon = useMemo(() => CategoryIcons[category], [category]);
    return (
          <View style={[styles.container, style]}>
            <View style={styles.card}>
                <View style={styles.left}>
                    {Icon && <Icon width={20} height={20} />}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.streakContainer}>
                            <Text style={styles.streak}>{currentStreak}</Text>
                            <FireIcon width={16} height={16} />
                        </View>

                    </View>
                </View>
                <View style={styles.ButtonContainer}>
                    <Pressable
                        style={styles.completeButton}
                        onPress={onComplete}
                        disabled={isCompleted} 
                    >
                        <View style={styles.completeButtonContent}>
                            <Text style={styles.completeButtonText}>Done</Text>
                            <CheckIcon width={16} height={16} />
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>

    );
});

const styles = StyleSheet.create({
    container: {
        ...theme.size.full_width,
    },
    card: {
        backgroundColor: theme.colors.white,
        ...theme.flex.row,
        ...theme.align["space-between"],
        ...theme.align["center"],
        ...theme.padding.horizontal.sm,
        ...theme.padding.vertical.sm,
        borderRadius: theme.borderRadius.md,
        ...theme.size.full_width,
    },
    left: {
        ...theme.flex.row,
        ...theme.align["center-left"],
        gap: theme.gap.s,
    },
    textContainer: {
        ...theme.flex.row,
        ...theme.align["center-left"],
        gap: theme.gap.s,
    },
    title: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.dark_text,
    },
    streak: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.dark_text,
        fontFamily: theme.typography.fontFamily.medium,
    },
    streakContainer: {
        ...theme.flex.row,
        ...theme.align["center"],
        gap: theme.gap.xs,
    },
    completeButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: theme.borderRadius.md,

    },
    completeButtonText: {
        color: theme.colors.white,
        fontFamily: theme.typography.fontFamily.medium,
    },
    ButtonContainer: {
        flex: 1,
        ...theme.align["center-right"],
    },
    completeButtonContent: {
        ...theme.flex.row,
        ...theme.align["center"],
        gap: theme.gap.xs,
    }
});
