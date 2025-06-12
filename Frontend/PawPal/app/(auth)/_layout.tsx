import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
export default function AuthLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        router.replace("/(tabs)"); // if logged in, redirect away
      } else {
        setIsLoggedIn(false); // allow rendering
      }
    };
    checkAuth();
  }, []);

  if (isLoggedIn === null) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
