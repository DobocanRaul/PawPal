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
import { Styles } from "../../constants/Styles";
import { Colors } from "../../constants/Colors";
import { Pet } from "../../app/(tabs)/schedule";
import * as SecureStorage from "expo-secure-store";
import { useCallback, useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { DeletePetModal } from "./DeleteModal";

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
      "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
      Bearer: SecureStorage.getItem("token") || "",
    },
    body: JSON.stringify({
      bookingId: bookingId,
      sitterId: sitterId,
    }),
  })
    .finally(() => {
      router.push("/(tabs)/requests");
    })
    .catch((error) => {
      console.error("Error creating booking request:", error);
    });
}

export function DetailedPetView({
  petDetails,
  canBook = false,
  bookingId = "",
}: DetailedPetViewProps) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  const UserID = SecureStorage.getItem("userId") || "defaultUserId";
  const [visible, setVisibility] = useState<boolean>(false);

  const deletePet = useCallback(() => {
    const triggerRequest = async function () {
      const url = API_URL + "/Pet/DeletePet/" + petDetails.id;
      fetch(url, {
        method: "DELETE",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
          Authorization: "Bearer " + SecureStorage.getItem("token") || "",
          Bearer: SecureStorage.getItem("token") || "",
        },
      }).then((response) => {
        if (response.status != 200)
          Toast.show({
            type: "error",
            text1: "Something went wrong!",
          });
        else {
          router.push("/(tabs)");
          Toast.show({
            type: "success",
            text1: "The pet has been deleted succesfully",
          });
        }
      });
    };
    triggerRequest();
  }, []);

  return (
    <GestureHandlerRootView>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          paddingHorizontal: 24,
          gap: 12,
          paddingBottom: canBook || UserID === petDetails.ownerId ? 100 : 24,
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 40 }}>{petDetails.name}</Text>
          {petDetails.ownerId == UserID ? (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/editPetProfile/[petId]",
                  params: {
                    petId: petDetails.id,
                  },
                });
              }}
            >
              <IconSymbol name="edit" color={Colors.light.text} />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
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
      {petDetails.ownerId === UserID ? (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.urgentTextColor,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            position: "absolute",
            width: "90%",
            //center the button at the bottom
            bottom: 15,
            left: "5%",
          }}
          onPress={() => setVisibility(true)}
        >
          <Text
            style={{
              color: Colors.light.background,
              fontSize: 22,
              fontFamily: "Inter-Regular",
              fontWeight: "bold",
            }}
          >
            Delete pet!
          </Text>
        </TouchableOpacity>
      ) : null}
      <DeletePetModal
        visible={visible}
        petName={petDetails.name}
        onClose={() => setVisibility(false)}
        onConfirmDelete={deletePet}
      />
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
