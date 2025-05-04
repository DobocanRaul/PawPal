import { BackButton } from "@/components/ui/BackButton";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { useRouter } from "expo-router";
import { View } from "react-native";

type SittingHistoryCard = {
  name: string;
  image: string;
  date: string;
  rating: number;
};
export default function SittingHistory() {
  const router = useRouter();
  const sittingHistory: SittingHistoryCard[] = [
    {
      name: "John Doe",
      image: "https://reactnative.dev/img/tiny_logo.png",
      date: "01/10/2023",
      rating: 4.5,
    },
    {
      name: "John Doe",
      image: "https://reactnative.dev/img/tiny_logo.png",
      date: "01/11/2023",
      rating: 3.5,
    },
  ];
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View>
        <BackButton />
        <ProfileButton
          onPress={() => {
            router.push("/profile");
          }}
        />
      </View>
    </View>
  );
}
