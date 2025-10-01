import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

interface Props {
  title: string;
  onPress: () => void;
}

export const OutlineButton: React.FC<Props> = ({ title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.button}
    activeOpacity={0.8}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    ...theme.padding.horizontal.sm,
    ...theme.padding.vertical.sm,
    ...theme.align["center"],
    ...theme.size.hug_height,
    ...theme.size.full_width,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    ...theme.borderColor
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
