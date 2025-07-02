import { ThemedView } from "../../components/ThemedView";
import React, { useEffect, useState } from "react";
import { DetailedPetView } from "../../components/ui/DetailedViewPet";
import { ActivityIndicator } from "react-native";
import { Pet } from "../(tabs)/schedule";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStorage from "expo-secure-store";

export default function petProfile() {
  const [DetailedPetViewInfo, setDetailedPetViewInfo] = useState<Pet | null>(
    null
  );
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const params = useLocalSearchParams();
  const petId = params.petId as string;
  const canBook = params.canBook == "true" ? true : false;
  const bookingId = params.bookingId as string;
  useEffect(() => {
    const token = SecureStorage.getItem("token");
    fetch(API_URL + "/Pet/Pet/" + petId, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
        Authorization: "Bearer " + token || "",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDetailedPetViewInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching pet details:", error);
      });
  }, []);

  return (
    <ThemedView style={{ flex: 1, paddingTop: 20, backgroundColor: "#fff" }}>
      {DetailedPetViewInfo ? (
        <DetailedPetView
          petDetails={DetailedPetViewInfo}
          canBook={canBook}
          bookingId={bookingId}
        />
      ) : (
        <ActivityIndicator />
      )}
    </ThemedView>
  );
}
