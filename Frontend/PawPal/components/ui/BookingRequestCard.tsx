import { Booking } from "@/app/(tabs)/schedule";
import { UserProfile } from "@/app/profile/[userId]";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { View, Image, Button, Text, TouchableOpacity } from "react-native";

type BookingRequestCardProps = {
  booking: Booking;
  user: UserProfile;
};
export function BookingRequestCard(props: BookingRequestCardProps) {
  const { booking, user } = props;
  return (
    <View
      style={{
        borderWidth: 1,
        flexDirection: "row",
        flex: 1,
        width: "100%",
        borderRadius: 16,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.mainColor,
        marginVertical: 8,
        gap: 16,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/profile/[userId]",
            params: {
              userId: user.id,
            },
          });
        }}
      >
        <Image
          source={{
            uri: "data:image/jpeg;base64," + user.image,
          }}
          style={{ width: 100, height: 100, borderRadius: 16 }}
        />
      </TouchableOpacity>
      <View style={{ justifyContent: "space-evenly" }}>
        <Text style={{ color: Colors.light.background }}>
          Wants to look after : {booking.pet.name}{" "}
        </Text>
        <Text style={{ color: Colors.light.background }}>
          From: {booking.startDate}{" "}
        </Text>
        <Text style={{ color: Colors.light.background }}>
          To: {booking.endDate}{" "}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          gap: 8,
          justifyContent: "space-evenly",
        }}
      >
        <Button
          onPress={() => {}}
          title="Accept"
          color={Colors.AcceptButtonColor}
        />
        <Button
          onPress={() => {}}
          title="Decline"
          color={Colors.RejectButtonColor}
        />
      </View>
    </View>
  );
}
