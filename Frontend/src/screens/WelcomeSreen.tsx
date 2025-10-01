import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../routes/router";
import { View, Text, StyleSheet } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { OutlineButton } from "../components/OutlineButton";
import { theme } from "../styles/theme";

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.mainContainer}>
      
      {/* Title no meio */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Habtracker</Text>
      </View>

      {/* Texto + botões em baixo */}
      <View style={styles.bottomContainer}>
        <Text style={styles.line}>
          An atomic habit is a small, easy change that helps you get powerful results!
        </Text>
        <View style={styles.buttonsContainer}>
          <PrimaryButton 
            title="Let’s get started"
            onPress={() => navigation.replace("Register")} 
          />
          <OutlineButton 
            title="I already have an account"
            onPress={() => navigation.replace("Login")} 
          />
        </View>
        <Text style={styles.credits}>
          By continuing, you agree to HabTracker Terms of Service and Privacy Policy
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...theme.padding.horizontal.xxl,
    ...theme.padding.vertical.xxl,
  },
  titleContainer: {
    flex: 1, // ocupa o resto do ecrã
    ...theme.align["center"],
  },
  title: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.semibold,
    ...theme.typography.align.center,
  },
  bottomContainer: {
    ...theme.flex.column,
    ...theme.align["center"],
    gap: theme.gap.lg,
       ...theme.size.full_width,
  },
  line: {
    color: theme.colors.dark_text,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    ...theme.typography.align.center,
  },
  buttonsContainer: {
    gap: theme.gap.sm,
    ...theme.size.full_width
  },
  credits: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.dark_text,
    ...theme.typography.align.center,
  },
});
