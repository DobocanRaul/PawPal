import { useNavigation } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { IconSymbol } from "./IconSymbol";
export function BackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
      style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
    >
      <IconSymbol name="arrow-back-ios" size={16} color="black" />
      <Text style={{ fontSize: 18 }}>Back</Text>
    </TouchableOpacity>
  );
}
