import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Menu } from "../components/Menu";
import { RegisterScreen } from "../screens/RegisterScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { WelcomeScreen } from "../screens/WelcomeSreen";
import { AchievementModal } from "../components/AchievementModal";
import { useAchievementModal } from "../contexts/AchievementModalContext";

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Menu: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RouterContent = () => {
  const { modalVisible, currentAchievement, hideModal } = useAchievementModal();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" /* Menu */ screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Menu" component={Menu} />
        </Stack.Navigator>
      </NavigationContainer>
      
      <AchievementModal
        achievement={currentAchievement || {
          _id: 'default',
          name: 'Default Achievement',
          type: 'xp',
          threshold: 0,
          rewardXp: 0,
        }}
        isVisible={modalVisible && !!currentAchievement}
        onClaim={hideModal}
      />
    </>
  );
};

export const Router = () => {
  return <RouterContent />;
};

/* Para telas que alternam entre si, como Login ↔ Register, sempre use replace.
Assim não empilhas múltiplas instâncias da mesma tela na stack.

Para navegar para telas que fazem parte do fluxo normal da app, como “Home”, “Profile” ou “Detalhes de item”,
 aí use navigate, porque queres manter a stack de navegação para permitir o botão “Back”. */