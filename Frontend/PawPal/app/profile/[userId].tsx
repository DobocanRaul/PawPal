import { ThemedView } from "../../components/ThemedView";
import { ProfileDetails } from "../../components/ui/ProfileDetails";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as S from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  rating: number;
  image: string;
  address: string;
  bestWithTags: string[];
  availabilityTags: string[];
  descriptionTags: string[];
};

export default function profile() {
  const [profileDetails, setProfileDetails] = useState<UserProfile | null>(
    null
  );
  const userId = useLocalSearchParams().userId as string;
  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const url = `${API_URL}/User/GetUser/${userId}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProfileDetails(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setProfileDetails(null);
      });
  }, []);
  return (
    <ThemedView style={{ flex: 1, paddingTop: 40, backgroundColor: "#fff" }}>
      {profileDetails !== null ? (
        <ProfileDetails profile={profileDetails} />
      ) : (
        <ActivityIndicator />
      )}
    </ThemedView>
  );
}
