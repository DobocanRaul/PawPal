import { SittingDetails } from "@/components/ui/SittingDetails";
import { Colors } from "@/constants/Colors";
import {
  StyleSheet,
  Text,
  Image,
  Platform,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

export type SittingProfile = {
  name: string;
  image: string;
  date: string;
  time: string;
  location: string;
};

export default function TabTwoScreen() {
  const sittingProfiles: SittingProfile[] = [
    {
      name: "John Doe",
      image: "https://reactnative.dev/img/tiny_logo.png",
      date: "01/10/2023",
      time: "10:00",
      location: "Str. Republicii 81",
    },
    {
      name: "John Doe",
      image: "https://reactnative.dev/img/tiny_logo.png",
      date: "01/10/2023",
      time: "10:00",
      location: "Str. Republicii 81",
    },
    {
      name: "John Doe",
      image: "https://reactnative.dev/img/tiny_logo.png",
      date: "01/10/2023",
      time: "10:00",
      location: "Str. Republicii 81",
    },
  ];
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleStyle}>
        Good luck on your {"\n"} next pawventure
      </Text>
      <FlatList
        data={sittingProfiles}
        style={{ width: "100%", paddingHorizontal: 16 }}
        renderItem={({ item }) => <SittingDetails sittingDetails={item} />}
      />
      <TouchableOpacity>
        <Text style={styles.historyText}>View sitting history {">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 24,
  },
  titleStyle: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
    paddingVertical: 24,
  },
  historyText: {
    fontSize: 16,
    color: Colors.mainColor,
    fontWeight: "bold",
    fontStyle: "italic",
    paddingTop: 24,
    fontFamily: "Inter-Regular",
  },
});
