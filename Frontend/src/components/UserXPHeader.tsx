import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { UserXPHeaderProps } from "../types/Components";


export const UserXPHeader: React.FC<UserXPHeaderProps> = ({
  name,
  currentXp,
  maxXp = 100, 
}) => {
  // calcula porcentagem da barra
  const progressPercent = ((currentXp % maxXp) / maxXp) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.xpBarBackground}>
        <View
          style={[styles.xpBarFill, { width: `${progressPercent}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.padding.vertical.sm,
    ...theme.flex.row,
     gap: theme.gap.s,
     width: 280,
     ...theme.align["center"],
  },
  name: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.dark_text,
  },
  xpBarBackground: {
    height: 12,
    ...theme.size.full_width,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  xpBarFill: {
    ...theme.size.full_width_flex,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
});
