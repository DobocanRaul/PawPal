import { SittingDetails } from "../../components/ui/SittingDetails";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as SecureStorage from "expo-secure-store";
import { UserProfile } from "../profile/[userId]";
import { useFocusEffect } from "@react-navigation/native";
import { DeleteBookingModal } from "../../components/ui/DeleteModal";

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
  owner: UserProfile; // refine this if you model `User`
};

export type Booking = {
  id: string;
  ownerId: string;
  petId: string;
  pet: Pet;
  userId: string;
  user: UserProfile;
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
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);

      const sittingsUrl = API_URL + "/Booking/getSitterBookings/" + userId;
      const userBookingsUrl = API_URL + "/Booking/getUserBookings/" + userId;

      const fetchData = async () => {
        try {
          const [sittingsRes, requestsRes] = await Promise.all([
            fetch(sittingsUrl, {
              headers: {
                "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
              },
            }),
            fetch(userBookingsUrl, {
              headers: {
                "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
              },
            }),
          ]);

          const sittingsData = await sittingsRes.json();
          const requestsData = await requestsRes.json();

          setSittingProfiles(sittingsData);
          setSittingRequests(requestsData);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [userId])
  );

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
          showsVerticalScrollIndicator={false}
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
          showsVerticalScrollIndicator={false}
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
    paddingBottom: 24,
  },
  titleStyle: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
    paddingVertical: 16,
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
