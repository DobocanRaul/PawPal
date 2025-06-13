import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { UserProfile } from "../../app/profile/[userId]";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../../constants/Colors";
import { router } from "expo-router";

type ChatButtonProps = {
  user: UserProfile;
};

export function ChatButton(props: ChatButtonProps) {
  const { user } = props;
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
            <Text>Last message sent</Text>
          </View>
          <View style={styles.infoRow}>
            <Text>17:30</Text>
          </View>
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
    height: "100%",
    marginVertical: 10,
    justifyContent: "flex-start",
    padding: 10,
  },
});
