import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SecureStorage from "expo-secure-store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLogin = async () => {
      const userId = await SecureStorage.getItemAsync("userId");
      setIsLoggedIn(!!userId);
      setIsReady(true);
      SplashScreen.hideAsync();
    };
    if (loaded) checkLogin();
  }, [loaded]);

  if (!isReady) return null;

  // Redirect if not logged in and not already on login page
  if (!isLoggedIn && !pathname.startsWith("/(auth)")) {
    router.replace("/(auth)");
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{
            navigationBarHidden: true,
            headerShown: false,
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/[userId]"
          options={{ navigationBarHidden: true, headerShown: false }}
        />
        <Stack.Screen
          name="sittingHistory"
          options={{ navigationBarHidden: true, headerShown: false }}
        />
        <Stack.Screen
          name="petProfile/[petId]"
          options={{
            navigationBarHidden: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="addPetPage"
          options={{
            navigationBarHidden: true,
            headerTitle: "Add a furry friend!",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
