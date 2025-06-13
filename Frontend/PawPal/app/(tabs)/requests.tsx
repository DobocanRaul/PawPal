import { Colors } from "@/constants/Colors";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Booking } from "./schedule";
import { SittingDetails } from "@/components/ui/SittingDetails";
import { useCallback, useEffect, useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as SecureStorage from "expo-secure-store";
import { UserProfile } from "../profile/[userId]";
import { BookingRequestCard } from "@/components/ui/BookingRequestCard";
import { useFocusEffect } from "expo-router";

export type BookingRequest = {
  booking: Booking;
  sitter: UserProfile;
};

export default function Requests() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [location, setLocation] = useState<string>("");
  const [currentDate, _] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [urgentSittings, setUrgentSittings] = useState<Booking[]>([]);
  const [trigger, setTrigger] = useState(false);
  const userId = SecureStorage.getItem("userId");
  useFocusEffect(
    useCallback(() => {
      setUrgentSittings(
        bookings.filter((booking) => {
          return (
            new Date(booking.startDate).getDate() - currentDate.getDate() <= 2
          );
        })
      );

      fetch(
        process.env.EXPO_PUBLIC_API_URL +
          "/BookingRequest/GetActiveRequests/" +
          userId,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setBookingRequests(data ?? []);
          setIsLoading(false);
        });
    }, [bookings, trigger])
  );
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleStyle}>Pets in need!</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          style={styles.input}
          onChangeText={setLocation}
          value={location}
          placeholder="Search by location"
        />
        <TouchableOpacity
          onPress={() => {
            if (location == "") {
              setBookings([]);
              return;
            }
            setIsLoading(true);
            const API_URL = process.env.EXPO_PUBLIC_API_URL;
            fetch(
              API_URL +
                "/Booking/getAvailableBookingsByLocation/" +
                location +
                "/" +
                userId,
              {
                headers: {
                  "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                setBookings(data ?? []);
                setIsLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching bookings:", error);
              });
          }}
        >
          <IconSymbol name="search" color={Colors.light.text} size={24} />
        </TouchableOpacity>
      </View>

      {urgentSittings.length > 0 && (
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text style={styles.headingStyle}>Someone is in a hurry!</Text>
          <FlatList
            data={urgentSittings}
            style={{ width: "100%", padding: 16 }}
            renderItem={({ item }) => (
              <SittingDetails
                sittingDetails={item}
                isUrgent={true}
                canBook={true}
                bookingId={item.id}
              />
            )}
          />
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              width: "90%",
              alignSelf: "center",
            }}
          />
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator />
      ) : bookings.length > 0 ? (
        <View
          style={{ flexDirection: "column", width: "100%", paddingTop: 16 }}
        >
          <Text style={styles.headingStyle}>Pets looking for a sitting</Text>
          <FlatList
            data={bookings}
            style={{ width: "100%", paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <SittingDetails
                sittingDetails={item}
                canBook={true}
                bookingId={item.id}
              />
            )}
          />
        </View>
      ) : (
        <Text style={styles.headingStyle}>No requests found!</Text>
      )}
      <View
        style={{
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      />
      <Text style={[styles.titleStyle, { paddingHorizontal: 16 }]}>
        Sitting requests for your pets
      </Text>
      <View>
        <FlatList
          data={bookingRequests}
          style={{ width: "100%", paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <BookingRequestCard
              booking={item.booking}
              user={item.sitter}
              refresh={() => setTrigger((prev) => !prev)}
            />
          )}
          keyExtractor={(item) => item.booking.id + item.sitter.id}
        />
      </View>
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
    gap: 8,
  },
  titleStyle: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
    paddingVertical: 16,
  },
  headingStyle: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
    paddingHorizontal: 24,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    borderRadius: 8,
  },
});
