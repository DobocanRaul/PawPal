import { Tabs, useRouter } from "expo-router";
import React from "react";
import { useNavigation } from "expo-router";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const iconSize = 28;
  const router = useRouter();
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
          <TouchableOpacity
            style={{ paddingLeft: 16 }}
            onPress={() => {
              router.push("/");
            }}
          >
            <IconSymbol name="pawicon" color={Colors.mainColor} size={30} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <ProfileButton
            onPress={() => {
              router.push("/profile");
            }}
          />
        ),
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
          tabBarLabel: "Schedule",
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="message.fill" color={color} />
          ),
          tabBarLabel: "Messages",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "transparent",
          },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="house.fill" color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="requesticon.fill" color={color} />
          ),
          tabBarLabel: "Requests",
        }}
      />
    </Tabs>
  );
}
