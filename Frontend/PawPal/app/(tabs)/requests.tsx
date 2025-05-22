import { Colors } from "@/constants/Colors";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { SittingProfile } from "./schedule";
import { SittingDetails } from "@/components/ui/SittingDetails";

export default function Requests() {
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
  ];

  const urgentSittingProfiles: SittingProfile[] = [
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
      <Text style={styles.titleStyle}>Wow, you're so pawpular!</Text>
      {urgentSittingProfiles.length > 0 && (
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text style={styles.headingStyle}>Someone is in a hurry!</Text>
          <FlatList
            data={urgentSittingProfiles}
            style={{ width: "100%", padding: 16 }}
            renderItem={({ item }) => (
              <SittingDetails sittingDetails={item} isUrgent={true} />
            )}
          />
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              width: "90%",
              alignSelf: "center",
            }}
          />
        </View>
      )}

      {sittingProfiles.length > 0 ? (
        <View
          style={{ flexDirection: "column", width: "100%", paddingTop: 16 }}
        >
          <Text style={styles.headingStyle}>Pets interested in you</Text>
          <FlatList
            data={sittingProfiles}
            style={{ width: "100%", paddingHorizontal: 16 }}
            renderItem={({ item }) => <SittingDetails sittingDetails={item} />}
          />
        </View>
      ) : (
        <Text style={styles.headingStyle}>No requests yet</Text>
      )}
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
  headingStyle: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
    paddingHorizontal: 24,
  },
});
