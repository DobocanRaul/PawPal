import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { UserProfile } from "../../app/profile/[userId]";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../../constants/Colors";
import { router } from "expo-router";
import { LastMessageInfo } from "../../app/(tabs)/chats";
import { IconSymbol } from "../../components/ui/IconSymbol";

type ChatButtonProps = {
  user: UserProfile;
  lastMessage: LastMessageInfo;
};

export function ChatButton(props: ChatButtonProps) {
  const { user, lastMessage } = props;
  let date;
  if (lastMessage) {
    date = new Date(lastMessage.dateTimeSent).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // use true for AM/PM
    });
  }
  return (
    <GestureHandlerRootView>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/chatPage/[userId]",
            params: {
              userId: user.id,
            },
          });
        }}
      >
        <View style={styles.mainContainer}>
          <Image
            source={{
              uri: "data:image/jpeg;base64," + user.image,
            }}
            style={{ width: 70, height: 70, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={styles.messageRow}>
            <Text style={styles.name}>{user.name}</Text>
            {lastMessage === undefined ? (
              <Text></Text>
            ) : (
              <Text>{lastMessage.msg}</Text>
            )}
          </View>
          {lastMessage === undefined ? (
            <></>
          ) : (
            <View style={styles.infoRow}>
              <Text>{date} </Text>
              {user.id === lastMessage.receiverId ? (
                <IconSymbol name="check" color={Colors.light.text} size={16} />
              ) : (
                <IconSymbol
                  name="circle"
                  color={Colors.urgentTextColor}
                  size={20}
                />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 16,
    alignItems: "center",
    backgroundColor: Colors.textBox,
    borderRadius: 8,
    borderColor: Colors.mainColor,
    borderWidth: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter-Regular",
  },
  messageRow: {
    justifyContent: "space-around",
    flex: 1,
    height: "100%",
  },
  infoRow: {
    height: "auto",
    marginVertical: 10,
    gap: 8,
    justifyContent: "space-evenly",
    padding: 10,
    flexDirection: "column",
    alignItems: "center",
  },
});
