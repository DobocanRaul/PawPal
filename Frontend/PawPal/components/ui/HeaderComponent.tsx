import { View, Text, Button, TouchableOpacity } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { router, useNavigation } from "expo-router";
import { BackButton } from "./BackButton";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

type HeaderComponentProps = {
  isOwnProfile?: boolean;
};
export function HeaderComponent(props: HeaderComponentProps) {
  const { isOwnProfile } = props;
  const navigation = useNavigation();

  const logout = useCallback(() => {
    const goLogout = async function () {
      await SecureStore.deleteItemAsync("userId");
      router.replace("/(auth)");
    };
    goLogout();
  }, []);
  return (
    <View style={{ paddingTop: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
      >
        <BackButton />
        {isOwnProfile ? (
          <TouchableOpacity onPress={logout}>
            <IconSymbol name="logout" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
