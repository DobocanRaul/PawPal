import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { router, useLocalSearchParams } from "expo-router";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { IconSymbol } from "../../components/ui/IconSymbol";
import Toast from "react-native-toast-message";
import { Colors } from "../../constants/Colors";
import { UserProfile } from "../profile/[userId]";

type Message = {
  senderId: string;
  msg: string;
};

export default function chatPage() {
  const [userDetails, setUser] = useState<UserProfile>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [chatRoom, setChatRoom] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);
  const joinRoom = async function (userId: string) {
    const currentUser = (await SecureStore.getItemAsync("userId")) || "";
    setChatRoom(
      currentUser < userId ? currentUser + userId : userId + currentUser
    );

    try {
      const url = API_URL + "/Chat";
      const newConn = new HubConnectionBuilder()
        .withUrl(url)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      newConn.on("ReceiveSpecificMessage", (userId, message) => {
        setMessages((prev) => [...prev, { senderId: userId, msg: message }]);
      });

      await newConn.start();
      await newConn.invoke("JoinSpecificChat", {
        userId: userId,
        chatName: chatRoom,
      });

      setConnection(newConn);
    } catch (e) {
      console.log(e);
    }

    const url = process.env.EXPO_PUBLIC_API_URL + "/User/GetUser/" + userId;
    fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
      },
    })
      .then((response) => {
        if (response.status != 200) {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
          return null;
        } else return response.json();
      })
      .then((data) => {
        if (data) setUser(data);
      });
    const messagesurl =
      process.env.EXPO_PUBLIC_API_URL + "/Messages/AllMessages/" + currentUser;

    fetch(messagesurl, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) setMessages(data);
      });
  };

  useEffect(() => {
    joinRoom(userId);
  }, [chatRoom]);

  const sendMessage = async () => {
    try {
      const currentUser = await SecureStore.getItemAsync("userId");
      await connection?.invoke(
        "SendSpecificMessage",
        currentUser,
        userDetails?.id,
        currentMessage,
        chatRoom
      );
      setCurrentMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {userDetails ? (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
        >
          <TouchableOpacity
            onPress={() => router.push("/profile/" + userDetails.id)}
          >
            <View style={styles.header}>
              <Image
                source={{
                  uri: "data:image/jpeg;base64," + userDetails.image,
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <Text style={styles.name}>{userDetails.name}</Text>
            </View>
          </TouchableOpacity>

          <FlatList
            ref={flatListRef}
            data={messages}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageList}
            keyExtractor={(_, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            renderItem={({ item }) => {
              const isMe = userId === item.senderId;
              return (
                <View
                  style={[
                    styles.bubbleWrapper,
                    !isMe ? styles.bubbleRight : styles.bubbleLeft,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubble,
                      {
                        backgroundColor: !isMe
                          ? Colors.mainColorInactive
                          : Colors.textBox,
                      },
                    ]}
                  >
                    {item.msg}
                  </Text>
                </View>
              );
            }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={currentMessage}
              onChangeText={setCurrentMessage}
              placeholder="Type message..."
              placeholderTextColor="#999"
              style={[styles.input, { paddingRight: 40 }]}
            />
            <TouchableOpacity
              onPress={() => sendMessage()}
              style={styles.sendButton}
            >
              <IconSymbol
                name="paperplane.fill"
                color={Colors.labelTextColor}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <ActivityIndicator />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.mainColor,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.labelTextColor,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    marginBottom: 100,
  },
  bubbleWrapper: {
    marginVertical: 4,
    flexDirection: "row",
    maxWidth: "80%",
  },
  bubbleLeft: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  bubbleRight: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderRadius: 14,
    overflow: "hidden",
    color: "#333",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
    borderTopWidth: 0.5,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: Colors.textBox,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    flex: 1,
  },
  sendButton: {
    position: "absolute",
    right: 24,
    top: "50%",
  },
});
