import { BackButton } from "@/components/ui/BackButton";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { Styles } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SittingHistoryCard } from "@/components/ui/SittingHistoryCard";

export type SittingHistoryInfo = {
  name: string;
  image: string;
  date: Date;
  rating: number;
};
export default function SittingHistory() {
  const router = useRouter();
  const sittingHistory: SittingHistoryInfo[] = [
    {
      name: "John Doe",
      image: "https://reactnative.dev/img/tiny_logo.png",
      date: new Date(),
      rating: 4.5,
    },
    {
      name: "John Doe",
      image: "https://reactnative.dev/img/tiny_logo.png",
      date: new Date(),
      rating: 3.5,
    },
  ];

  sittingHistory[1].date.setMonth(10);
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BackButton />
        <ProfileButton
          onPress={() => {
            router.push("/profile");
          }}
        />
      </View>
      <View style={{ paddingTop: 30, flexDirection: "column" }}>
        <Text
          style={[
            Styles.boldFont,
            Styles.specificFontFamily,
            { fontSize: 24, textAlign: "center", paddingVertical: 40 },
          ]}
        >
          You were a great {"\n"} temporary pawrent for them!
        </Text>
        <FlatList
          data={sittingHistory}
          renderItem={({ item }) => <SittingHistoryCard sittingInfo={item} />}
        />
      </View>
    </View>
  );
}
