import { SittingDetails } from "@/components/ui/SittingDetails";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as SecureStorage from "expo-secure-store";

export type SittingProfile = {
  id: string;
  name: string;
  image: string;
  date: string;
  time: string;
  location: string;
};

export type Pet = {
  id: string;
  name: string;
  isFemale: boolean;
  address: string;
  age: number;
  weight: number;
  description: string;
  image: string; // base64 string or image URL depending on your backend
  tags: string[];
  ownerId: string;
  owner: null | any; // refine this if you model `User`
};

export type Booking = {
  id: string;
  ownerId: string;
  petId: string;
  pet: Pet;
  userId: string;
  startDate: string; // ISO date string
  endDate: string;
  address: string;
};

export default function TabTwoScreen() {
  const router = useRouter();
  const userId = SecureStorage.getItem("userId");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [sittingProfiles, setSittingProfiles] = useState<Booking[]>([]);
  const [sittingRequests, setSittingRequests] = useState<Booking[]>([]);
  useEffect(() => {
    const sittingsUrl = API_URL + "/Booking/getSitterBookings/" + userId;
    fetch(sittingsUrl)
      .then((response) => response.json())
      .then((data) => {
        setSittingProfiles(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sitting profiles:", error);
        setIsLoading(false);
      });
    fetch(API_URL + "/Booking/getUserBookings/" + userId)
      .then((response) => response.json())
      .then((data) => {
        setSittingRequests(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sitting requests:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleStyle}>
        Good luck on your {"\n"} next pawventure
      </Text>
      <Text style={styles.titleStyle}>Your sitting requests!</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : !sittingRequests.length ? (
        <Text style={{ fontSize: 16, color: Colors.light.text }}>
          Oops ! No sittings are active right now.
        </Text>
      ) : (
        <FlatList
          data={sittingRequests}
          style={{ width: "100%", paddingHorizontal: 16 }}
          renderItem={({ item }) => <SittingDetails sittingDetails={item} />}
        />
      )}
      <Text style={styles.titleStyle}>Your scheduled sittings!</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : !sittingProfiles.length ? (
        <Text style={{ fontSize: 16, color: Colors.light.text }}>
          Oops ! No Requests are active right now.
        </Text>
      ) : (
        <FlatList
          data={sittingProfiles}
          style={{ width: "100%", paddingHorizontal: 16 }}
          renderItem={({ item }) => <SittingDetails sittingDetails={item} />}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          router.push("/sittingHistory");
        }}
      >
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
