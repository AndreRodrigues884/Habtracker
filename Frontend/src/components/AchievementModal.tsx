import React from "react";
import { View, Text, Pressable, StyleSheet, Modal, Dimensions } from "react-native";
import { Achievement } from "../types/Achievements";
import { theme } from "../styles/theme";

const { height: screenHeight } = Dimensions.get('window');

interface AchievementModalProps {
    achievement: Achievement;
    onClaim: () => void;
    isVisible: boolean;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClaim, isVisible }) => { 
    
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClaim}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClaim} />
                <View style={styles.modal}>
                    <View style={styles.handle} />
                    <Text style={styles.type}>{achievement.type}</Text>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Achievement Unlocked! 🎉</Text>
                        <Text style={styles.name}>{achievement.name}</Text>
                        <Text style={styles.xpReward}>+{achievement.rewardXp} XP</Text>
                    </View>
                    <Pressable style={styles.button} onPress={onClaim}>
                        <Text style={styles.buttonText}>Claim</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modal: {
        backgroundColor: theme.colors.white,
        ...theme.padding.horizontal.xxl,
        ...theme.padding.vertical.md,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        ...theme.flex.column,
        ...theme.align["space-between"],
        gap: theme.gap.lg,
        paddingBottom: 50, // Espaço extra para o safe area
        minHeight: 200, // Altura mínima para garantir que cubra o menu
        maxHeight: screenHeight * 0.6, // Máximo 60% da tela
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.dark_text,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: theme.gap.md,
    },
    titleContainer: {
        gap: theme.gap.sm,
        ...theme.align["center"],
        ...theme.padding.vertical.sm,
    },
    title: {
        fontSize: theme.typography.sizes.lg,
        color: theme.colors.primary,
        fontFamily: theme.typography.fontFamily.semibold,
    },
    name: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.dark_text,
        fontFamily: theme.typography.fontFamily.medium,
    },
    xpReward: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.primary,
        fontFamily: theme.typography.fontFamily.semibold,
        backgroundColor: theme.colors.primary + '20', // 20% opacity
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    type: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.dark_text,
        fontFamily: theme.typography.fontFamily.semibold,
        ...theme.align["top-center"],
    },
    button: {
        backgroundColor: theme.colors.primary,
        ...theme.size.full_width,
        ...theme.typography.align.center,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
    },
    buttonText: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.background,
        fontFamily: theme.typography.fontFamily.semibold,
        ...theme.typography.align.center,
    },
});

