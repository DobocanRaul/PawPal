import { View, Text, Button, TouchableOpacity } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { useNavigation } from "expo-router";
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
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <IconSymbol name="arrow-back-ios" size={16} color="black" />
          <Text style={{ fontSize: 18 }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <IconSymbol name="settingsIcon" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
