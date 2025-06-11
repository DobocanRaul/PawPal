import {
  ScrollView,
  View,
  Image,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import { IconSymbol } from "./IconSymbol";
import { InfoSquare } from "./YellowInfoSquare";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Styles } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { Pet } from "@/app/(tabs)/schedule";
import * as SecureStorage from "expo-secure-store";

type DetailedPetViewProps = {
  petDetails: Pet;
  canBook?: boolean;
  bookingId?: string;
};

function createBookingRequest(
  bookingId: string,
  sitterId: string,
  API_URL: string
) {
  const router = require("expo-router").router;
  fetch(`${API_URL}/BookingRequest/AddRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookingId: bookingId,
      sitterId: sitterId,
    }),
  })
    .finally(() => {
      router.push("/(tabs)/requests"); // Navigate to requests page after creating booking request
    })
    .catch((error) => {
      console.error("Error creating booking request:", error);
    });
}

export function DetailedPetView({
  petDetails,
  canBook = false,
  bookingId = "", // Optional bookingId, default is empty string
}: DetailedPetViewProps) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"; // Fallback URL for local development
  const UserID = SecureStorage.getItem("userId") || "defaultUserId"; // Fallback for user ID
  return (
    <GestureHandlerRootView>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          paddingHorizontal: 24,
          gap: 12,
          paddingBottom: canBook ? 100 : 24,
        }}
      >
        <Image
          source={{ uri: "data:image/jpeg;base64," + petDetails.image }}
          style={{
            height: 350,
            width: 350,
            borderRadius: 16,
            alignSelf: "center",
          }}
        />

        <Text style={{ fontSize: 40 }}>{petDetails.name}</Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <IconSymbol name="location" color={"gray"} />
          <Text
            style={[{ fontSize: 20, color: "gray" }, Styles.specificFontFamily]}
          >
            {petDetails.address}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <InfoSquare
            title="Gender"
            info={petDetails.isFemale ? "Female" : "Male"}
          />
          <InfoSquare title="Age" info={petDetails.age.toString() + " years"} />
          <InfoSquare
            title="Weight"
            info={petDetails.weight.toString() + " kg"}
          />
        </View>
        <Text style={[{ fontSize: 18 }, Styles.specificFontFamily]}>
          {petDetails.description}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Me in a nutshell
        </Text>
        <View>
          <FlatList
            data={petDetails.tags}
            horizontal={true}
            renderItem={({ item }) => (
              <View style={fileStyles.infoSquare}>
                <IconSymbol name="fingerprintIcon" />
                <Text style={fileStyles.infoSquareText}>{item}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
      {canBook ? (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.mainColor,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            position: "absolute",
            width: "90%",
            //center the button at the bottom
            bottom: 25,
            left: "5%",
          }}
          onPress={() => {
            createBookingRequest(bookingId, UserID, API_URL);
          }}
        >
          <Text
            style={{
              color: Colors.light.background,
              fontSize: 22,
              fontFamily: "Inter-Regular",
              fontWeight: "bold",
            }}
          >
            Book Sitting
          </Text>
        </TouchableOpacity>
      ) : null}
    </GestureHandlerRootView>
  );
}

const fileStyles = StyleSheet.create({
  infoSquare: {
    backgroundColor: Colors.InfoSquare.BackgroundColor,
    padding: 4,
    margin: 4,
    flexDirection: "row",
    borderRadius: 8,
  },
  infoSquareText: {
    fontSize: 16,
  },
});
