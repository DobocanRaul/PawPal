import { View, Text, StyleSheet } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Colors } from "@/constants/Colors";
export function TagSquare({
  displayText,
  iconName,
}: {
  displayText: string;
  iconName: string;
}) {
  return (
    <View style={styles.tagContainer}>
      <IconSymbol name={iconName} size={20} color={Colors.iconSecondary} />
      <Text style={styles.tagText}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    backgroundColor: Colors.light.secondaryColor,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
  },
});
