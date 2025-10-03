import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { InputFieldProps } from "../types/Components";



export const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  secureTextEntry = false,
  ...props
}) => {
  const [showPassword] = useState(false);

  return (
  <View>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={theme.colors.gray}
      style={styles.input}
      secureTextEntry={secureTextEntry && !showPassword}
      {...props}
    />
  </View>
);
}



const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.white,
    ...theme.padding.horizontal.md,
    ...theme.padding.vertical.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.borderColor,
    ...theme.size.full_width,
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
});
