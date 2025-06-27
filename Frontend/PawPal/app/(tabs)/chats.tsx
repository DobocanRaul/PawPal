import { ActivityIndicator, FlatList, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { UserProfile } from "../profile/[userId]";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ChatButton } from "../../components/ui/ChatButton";

export type LastMessageInfo = {
  msg: string;
  dateTimeSent: string;
  senderId: string;
  receiverId: string;
};

export default function chats() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastMessages, setLastMessages] = useState<LastMessageInfo[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        try {
          const API_URL = process.env.EXPO_PUBLIC_API_URL;
          const userId = await SecureStore.getItemAsync("userId");
          const url = `${API_URL}/Booking/GetUsersForBookings/${userId}`;
          const token = await SecureStore.getItemAsync("token");

          const response = await fetch(url, {
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
              Bearer: token || "",
            },
          });
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      };
      const fetchLastMessages = async () => {
        try {
          setIsLoading(true);
          const API_URL = process.env.EXPO_PUBLIC_API_URL;
          const userId = await SecureStore.getItemAsync("userId");
          const url = `${API_URL}/Messages/AllLastMessages/${userId}`;
          const token = await SecureStore.getItemAsync("token");

          const response = await fetch(url, {
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
              Bearer: token || "",
            },
          });
          const data = await response.json();
          setLastMessages(data);
        } catch (error) {
          console.error(error);
        }
      };

      Promise.all([fetchLastMessages(), fetchUsers()]).then(() =>
        setIsLoading(false)
      );
    }, []) // Add dependencies if needed
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light.background,
        paddingTop: 40,
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatButton
              user={item}
              lastMessage={
                lastMessages.filter(
                  (info) =>
                    info.receiverId == item.id || info.senderId == item.id
                )[0]
              }
            />
          )}
        />
      )}
    </View>
  );
}
