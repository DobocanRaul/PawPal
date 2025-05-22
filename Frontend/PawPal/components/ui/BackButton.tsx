import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { useRoute } from "@react-navigation/native";
export function BackButton() {
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.back();
      }}
      style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
    >
      <IconSymbol name="arrow-back-ios" size={16} color="black" />
      <Text style={{ fontSize: 18 }}>Back</Text>
    </TouchableOpacity>
  );
}
