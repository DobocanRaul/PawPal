import { ActivityIndicator, FlatList, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { UserProfile } from "../profile/[userId]";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ChatButton } from "../../components/ui/ChatButton";

export default function chats() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        try {
          const API_URL = process.env.EXPO_PUBLIC_API_URL;
          const userId = await SecureStore.getItemAsync("userId");
          const url = `${API_URL}/Booking/GetUsersForBookings/${userId}`;

          const response = await fetch(url);
          const data = await response.json();
          setUsers(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      };

      fetchUsers();
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
          renderItem={({ item }) => <ChatButton user={item} />}
        />
      )}
    </View>
  );
}
