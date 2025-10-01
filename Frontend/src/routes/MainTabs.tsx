import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { ListScreen } from "../screens/ListScreen";
import { CreateScreen } from "../screens/CreateScreen";
import { StreakScreen } from "../screens/StreakScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export const Menu = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="List" component={ListScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Streak" component={StreakScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

/* O TabNavigator é quem contém as tuas screens (HomeScreen, ListScreen, CreateScreen, etc).

Ou seja:

Não pões o TabNavigator dentro do HomeScreen.

O HomeScreen, ListScreen, etc. são registrados como tabs dentro do TabNavigator.

🔎 Porquê assim?

O TabNavigator é o “menu de navegação” da tua app. Ele serve como "container" 
e já mete a barra de ícones no fundo em todas as páginas que tu definiste dentro dele.

Se metesses o TabNavigator dentro do HomeScreen, ias acabar com um menu só dentro dessa página,
 e nas outras não aparecia nada — ou ias acabar com loops estranhos de navegação. */