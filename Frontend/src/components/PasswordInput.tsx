import * as React from "react";
import { View, StyleSheet, TextInput as RNTextInput } from "react-native";
import { theme } from "../styles/theme";

import EyeIcon from "../assets/icons/eye.svg";
import EyeOffIcon from "../assets/icons/eye-off.svg";

interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    value,
    onChangeText,
    placeholder,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <View style={styles.container}>
            <RNTextInput
                placeholder={placeholder}
                placeholderTextColor={theme.colors.gray}
                style={styles.input}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChangeText}
            />
            <View style={styles.iconContainer} onTouchStart={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon width={24} height={24} /> : <EyeIcon width={24} height={24} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
    },
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
        paddingRight: 40, // espaço para o ícone
    },
    iconContainer: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -12 }],
    },
});
