import { Colors } from "@/constants/Colors";
import { View, Text } from "react-native";

type SquareProps = {
  title: string;
  info: string;
};

export function InfoSquare({ title, info }: SquareProps) {
  return (
    <View
      style={{
        backgroundColor: Colors.InfoSquare.BackgroundColor,
        borderWidth: 1,
        borderColor: Colors.InfoSquare.BorderColor,
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "300" }}>{title}</Text>
      <Text style={{ fontSize: 20 }}>{info}</Text>
    </View>
  );
}
