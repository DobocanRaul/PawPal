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
    <View style={[styles.tagContainer]}>
      <IconSymbol name={iconName} size={14} color={Colors.iconSecondary} />
      <Text style={[styles.tagText, styles.specificFontFamily]}>
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    backgroundColor: Colors.light.secondaryColor,
    borderRadius: 8,
    paddingHorizontal: 16,
    margin: 4,
    flexDirection: "row",
    alignItems: "center",
    height: "50%",
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#333",
  },
  specificFontFamily: {
    fontFamily: "Inter-Regular",
    fontWeight: "900",
  },
});
