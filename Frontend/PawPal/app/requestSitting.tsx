import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Platform,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Pet } from "./(tabs)/schedule";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Colors } from "../constants/Colors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import * as SecureStorage from "expo-secure-store";

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function RequestSitting() {
  const [petId, setPetId] = useState<string>("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useFocusEffect(
    useCallback(() => {
      const getPets = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        if (!userId) return;
        const token = await SecureStorage.getItem("token");
        const petsUrl = `${API_URL}/Pet/Pets/${userId}`;
        try {
          const response = await fetch(petsUrl, {
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
              Authorization: "Bearer " + token || "",
            },
          });
          const data = await response.json();
          setPets(data);
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Failed to load pets",
            text2: String(error),
          });
        } finally {
          setIsLoading(false);
        }
      };
      getPets();
    }, [])
  );

  const sendRequest = useCallback(() => {
    if (!petId) {
      Toast.show({
        type: "error",
        text1: "Please select a pet first",
      });
      return;
    }

    if (startDate >= endDate) {
      Toast.show({
        type: "error",
        text1: "End date must be after start date",
      });
      return;
    }

    const request = async () => {
      try {
        const URL = `${API_URL}/Booking/createBooking`;
        const body = JSON.stringify({
          petId,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        });
        const token = await SecureStorage.getItem("token");

        const response = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
            Authorization: "Bearer " + token || "",
          },
          body,
        });
        if (response.status == 201) {
          Toast.show({
            type: "success",
            text1: "Sitting request sent successfully!",
          });
          router.replace("/(tabs)");
        } else {
          const text = await response.text();
          Toast.show({
            type: "error",
            text1: "Failed to send request",
            text2: text,
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Request failed",
          text2: String(error),
        });
      }
    };

    request();
  }, [petId, startDate, endDate]);

  const onChangeStartDate = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== "ios") setShowStartPicker(false);
    if (date) setStartDate(date);
  };

  const onChangeEndDate = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== "ios") setShowEndPicker(false);
    if (date) setEndDate(date);
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: Colors.light.background }}
    >
      <View style={{ padding: 16, backgroundColor: Colors.light.background }}>
        <Text style={styles.header}>Who needs a pawrent?</Text>

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setPetId(item.id)}>
                <View style={styles.cardContainer}>
                  <ImageBackground
                    source={{ uri: "data:image/jpeg;base64," + item.image }}
                    style={[
                      styles.cardImage,
                      {
                        borderColor:
                          petId === item.id ? Colors.mainColor : "#ccc",
                      },
                    ]}
                  >
                    <Text style={styles.cardText}>
                      {item.name} - {item.age} years old
                    </Text>
                    <Text style={styles.cardText}>at {item.address}</Text>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <Text
          style={[{ paddingVertical: 10 }, styles.sectionLabel, styles.header]}
        >
          Starting when?
        </Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>{startDate.toDateString()}</Text>
        </TouchableOpacity>

        <Text
          style={[(styles.sectionLabel, styles.header), { paddingTop: 20 }]}
        >
          And ending on?
        </Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>{endDate.toDateString()}</Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
          />
        )}

        <TouchableOpacity
          style={[styles.dateButton, { marginTop: 80 }]}
          onPress={sendRequest}
        >
          <Text style={styles.dateButtonText}>Request a sitting!</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContainer: {
    margin: 10,
    alignItems: "center",
  },
  cardImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    alignItems: "flex-end",
  },
  cardText: {
    fontSize: 10,
    color: Colors.light.background,
    fontWeight: "bold",
  },
  sectionLabel: {
    fontSize: 16,
    marginVertical: 20,
  },
  dateButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    alignItems: "center",
  },
  dateButtonText: {
    color: Colors.light.background,
    fontWeight: "500",
  },
});
