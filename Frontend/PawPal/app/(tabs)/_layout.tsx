import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProfileButton } from "@/components/ui/ProfileButton";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const iconSize = 28;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.mainColor,
        tabBarInactiveTintColor: Colors.mainColorInactive,
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
          shadowColor: "transparent",
        },
        tabBarButton: HapticTab,
        headerLeft: () => (
          <IconSymbol
            name="pawicon"
            style={{ paddingLeft: 16 }}
            color={Colors.mainColor}
            size={30}
          />
        ),
        headerRight: () => <ProfileButton onPress={() => {}} />,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="schedule"
        options={{
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="calendar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="message.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "transparent",
          },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="requesticon.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
