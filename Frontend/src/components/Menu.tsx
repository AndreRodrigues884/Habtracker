import React from "react";
import { StyleSheet, ImageProps } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { theme } from "../styles/theme";
import { useThemeContext } from "../contexts/ThemeContext";

import { HomeScreen } from "../screens/HomeScreen";
import { CreateScreen } from "../screens/CreateScreen";
import { StreakScreen } from "../screens/StreakScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ListScreen } from "../screens/ListScreen";

// Importar SVGs como componentes
import HomeIcon from "../assets/icons/home.svg";
import HomeIconActive from "../assets/icons/home-active.svg";
import ListIcon from "../assets/icons/list.svg";
import ListIconActive from "../assets/icons/list-active.svg";
import CreateIcon from "../assets/icons/create.svg";
import CreateIconActive from "../assets/icons/create-active.svg";
import StreakIcon from "../assets/icons/streak.svg";
import StreakIconActive from "../assets/icons/streak-active.svg";
import ProfileIcon from "../assets/icons/profile.svg";
import ProfileIconActive from "../assets/icons/profile-active.svg";

const Tab = createBottomTabNavigator();

export const Menu = () => {
  const { theme: t } = useThemeContext();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: t.colors.white }],
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused }) => {
          let IconComponent: React.FC<ImageProps> = HomeIcon;
          let iconSize = 28;

          switch (route.name) {
            case "Home":
              IconComponent = focused ? HomeIconActive : HomeIcon;
              iconSize = 28;
              break;
            case "List":
              IconComponent = focused ? ListIconActive : ListIcon;
              iconSize = 28;
              break;
            case "Create":
              IconComponent = focused ? CreateIconActive : CreateIcon;
              iconSize = 40;
              break;
            case "Streak":
              IconComponent = focused ? StreakIconActive : StreakIcon;
              iconSize = 28;
              break;
            case "Profile":
              IconComponent = focused ? ProfileIconActive : ProfileIcon;
              iconSize = 28;
              break;
          }

          return <IconComponent width={iconSize} height={iconSize} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="List" component={ListScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Streak" component={StreakScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    height: 80,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 4,
    elevation: 0,
    ...theme.flex.row,
    ...theme.align["space-between"],
    ...theme.align["center"],
    ...theme.padding.horizontal.md,
  },
  tabBarItem: {
    ...theme.align["center"],
  },
});
