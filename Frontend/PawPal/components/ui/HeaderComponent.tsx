import { View, Text, Button, TouchableOpacity } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { useNavigation } from "expo-router";
import { BackButton } from "./BackButton";
export function HeaderComponent() {
  const navigation = useNavigation();
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
        <TouchableOpacity onPress={() => {}}>
          <IconSymbol name="settingsIcon" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
