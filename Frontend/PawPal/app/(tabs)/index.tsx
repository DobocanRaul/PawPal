import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import * as SecureStore from "expo-secure-store";
export default function HomeScreen() {
  SecureStore.setItem("userId", "00B16E73-9649-44A6-BB17-902DAB8150C2");
  return (
    <ThemedView
      style={{ flex: 1, paddingTop: 40, backgroundColor: "#fff" }}
    ></ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
