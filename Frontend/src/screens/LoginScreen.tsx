import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../routes/router";
import { View, Text, Alert, StyleSheet } from "react-native";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { AuthContext } from "../contexts/AuthContext";
import { theme } from "../styles/theme";
import { PasswordInput } from "../components/PasswordInput";


export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState("");

  const handleLogin = async () => {
    setInputError("");

    const error = await login({ identifier, password });

    if (error) {
      setInputError( error);
      return;
    }

    navigation.replace("Menu");
  };

  return (
    <View style={[styles.mainContainer]}>
      <View style={[styles.secondContainer]}>
        <View style={[styles.thirdContainer]}>
          <View style={[styles.textsContainer]}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Don't have an account?{" "}
              <Text style={styles.link} onPress={() => navigation.replace("Register")}>
                Sign up
              </Text>
            </Text>
          </View>

          <View style={[styles.inputsContainer]}>
            <View style={[styles.inputs]}>
              <View>
                <InputField placeholder="Name or Email" value={identifier} onChangeText={setIdentifier} />
              </View>
              <View>
                <PasswordInput placeholder="Password" value={password} onChangeText={setPassword} />
                {inputError && (
                  <Text style={{ color: 'red' }}>{inputError}</Text>
                )}
              </View>

            </View>
            <View style={[styles.link_passwordContainer]}>
              <Text style={styles.link_password}>Forgot your password?</Text>
            </View>
          </View>

          <PrimaryButton title="Sign In" onPress={handleLogin} />
        </View>

        <View style={[styles.logoContainer]}>
          <Text style={styles.logo}>HabTracker</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    ...theme.padding.horizontal.xxl,
    ...theme.padding.vertical.xxl,
    ...theme.align["top-left"],
    ...theme.size.full,
    ...theme.flex.column,
    gap: theme.gap.lg,
    backgroundColor: theme.colors.background,
  },
  secondContainer: {
    ...theme.align["center-left"],
    ...theme.size.full,
    ...theme.flex.column,
  },
  thirdContainer: {
    ...theme.align["center-left"],
    ...theme.size.full,
    ...theme.flex.column,
    gap: theme.gap.lg,
  },
  textsContainer: {
    ...theme.size.hug,
    gap: theme.gap.sm,
  },
  inputsContainer: {
    ...theme.size.full_width,
    gap: theme.gap.sm,
  },
  inputs: {
    gap: theme.gap.md,
  },
  title: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  subtitle: {
    color: theme.colors.dark_text,
    fontFamily: theme.typography.fontFamily.medium,
  },
  link: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  link_password: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.regular,
  },
  link_passwordContainer: {
    ...theme.align["center-right"],
    ...theme.size.full_width,
  },
  logo: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    ...theme.padding.vertical.sm
  },
  logoContainer: {
    ...theme.size.full_width,
    ...theme.size.hug_height,
    ...theme.align["center"],
  }
});
