import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ThemedView } from "../../components/ThemedView";
import * as SecureStore from "expo-secure-store";
import { Colors } from "../../constants/Colors";
import { useCallback, useState } from "react";
import { Pet } from "./schedule";
import { useFocusEffect } from "@react-navigation/native";
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { HomeCardPet } from "../../components/ui/HomeCardPet";
import { router } from "expo-router";
export default function HomeScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [API_URL, setAPi] = useState<string>(
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
  );
  const userId = SecureStore.getItem("userId");
  const token = SecureStore.getItem("token");
  useFocusEffect(
    useCallback(() => {
      const getPets = async function () {
        const petsUrl = API_URL + "/Pet/Pets/" + userId;
        const token = await SecureStore.getItem("token");
        try {
          const repsonseData = await fetch(petsUrl, {
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
              Authorization: "Bearer " + token || "",
            },
          });
          if (repsonseData.status === 401) {
            console.error("Unauthorized access. Please log in again.");
            router.push("/auth");
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("userId");
            return;
          }
          const data = await repsonseData.json();
          setPets(data);
        } catch (error) {
          console.error("Error fetching pets:", error);
        } finally {
          setIsLoading(false);
        }
      };
      getPets();
    }, [isLoading])
  );

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            onPress={() => router.push("/schedule")}
            style={{
              backgroundColor: Colors.mainColor,
              width: "40%",
              height: 50,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderColor: Colors.light.text,
              borderWidth: 1,
            }}
          >
            <Text style={{ color: Colors.light.background, fontSize: 18 }}>
              Go see your schedule!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/requests")}
            style={{
              backgroundColor: Colors.mainColor,
              width: "40%",
              height: 50,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderColor: Colors.light.text,
              borderWidth: 1,
            }}
          >
            <Text style={{ color: Colors.light.background, fontSize: 18 }}>
              Go see requests!
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[styles.titleStyle, { alignSelf: "baseline", marginLeft: 20 }]}
        >
          Looking for help?
        </Text>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.mainColor,
              width: "75%",
              height: 50,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderColor: Colors.light.text,
              borderWidth: 1,
            }}
            onPress={() => {
              router.push("/requestSitting");
            }}
          >
            <Text style={{ color: Colors.light.background, fontSize: 18 }}>
              Request a sitting!
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.titleStyle,
              { alignSelf: "baseline", marginLeft: 20 },
            ]}
          >
            Do you have a pet friend?
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.mainColor,
              width: "75%",
              height: 50,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderColor: Colors.light.text,
              borderWidth: 1,
            }}
            onPress={() => router.push("/addPetPage")}
          >
            <Text style={{ color: Colors.light.background, fontSize: 18 }}>
              Add a pet!
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider}></View>
        <Text
          style={[styles.titleStyle, { alignSelf: "baseline", marginLeft: 20 }]}
        >
          Take a look at your furry friends!
        </Text>
        <View style={{ paddingBottom: 20 }}>
          {!isLoading ? (
            pets.length > 0 ? (
              <FlatList
                data={pets}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <HomeCardPet pet={item} />}
              />
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                Looks like no furry friends were found {":("}
              </Text>
            )
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  divider: {
    borderBottomColor: Colors.labelTextColor,
    borderBottomWidth: 0.5,
    marginVertical: 20,
    width: "90%",
    alignSelf: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  titleStyle: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
    paddingVertical: 24,
  },
});
