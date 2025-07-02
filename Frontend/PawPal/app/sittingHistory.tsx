import { BackButton } from "../components/ui/BackButton";
import { Styles } from "../constants/Styles";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Booking } from "./(tabs)/schedule";
import * as SecureStorage from "expo-secure-store";
import { SittingDetails } from "../components/ui/SittingDetails";
import { Colors } from "../constants/Colors";

export default function SittingHistory() {
  const router = useRouter();
  const [historyAsSitter, setHistoryAsSitter] = useState<Booking[]>([]);
  const [historyAsOwner, setHistoryAsOwner] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [userId, setUserId] = useState<string>(
    SecureStorage.getItem("userId") || ""
  );
  useFocusEffect(
    useCallback(() => {
      const token = SecureStorage.getItem("token");
      const asOwnerUrl = API_URL + "/Booking/getOwnerSittingHistory/" + userId;
      const asSitterUrl =
        API_URL + "/Booking/getSitterSittingHistory/" + userId;
      const fetchSittingHistory = async () => {
        try {
          const [ownerResponse, sitterResponse] = await Promise.all([
            fetch(asOwnerUrl, {
              headers: {
                "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
                Authorization: "Bearer " + token || "",
              },
            }),
            fetch(asSitterUrl, {
              headers: {
                "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
                Authorization: "Bearer " + token || "",
              },
            }),
          ]);

          const ownerData = await ownerResponse.json();
          const sitterData = await sitterResponse.json();

          if (ownerResponse.status === 200) {
            setHistoryAsOwner(ownerData);
          }
          if (sitterResponse.status === 200) {
            setHistoryAsSitter(sitterData);
          }
        } catch (error) {
          console.error("Error fetching sitting history:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSittingHistory();
    }, [])
  );
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
        {!isLoading ? (
          <View>
            <Text style={styles.titleStyle}>Sitting history as owner:</Text>
            {historyAsOwner.length != 0 ? (
              <FlatList
                data={historyAsOwner}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SittingDetails sittingDetails={item} />
                )}
              />
            ) : (
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                Oops! You have no sitting history as a sitter.
              </Text>
            )}
            <Text style={styles.titleStyle}>Sitting history as sitter:</Text>
            {historyAsSitter.length != 0 ? (
              <FlatList
                data={historyAsSitter}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SittingDetails sittingDetails={item} />
                )}
              />
            ) : (
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                Oops! You have no sitting history as a sitter.
              </Text>
            )}
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
    paddingVertical: 24,
  },
});
