import { Booking, SittingProfile } from "@/app/(tabs)/schedule";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Styles } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "./IconSymbol";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

type SittingDetailsProps = {
  sittingDetails: Booking;
  isUrgent?: boolean;
  canBook?: boolean;
  bookingId?: string; // Optional bookingId, default is empty string
};

export function SittingDetails({
  sittingDetails,
  isUrgent,
  canBook = false,
  bookingId = "", // Optional bookingId, default is empty string
}: SittingDetailsProps) {
  const { pet, startDate, address, endDate, userId, user } = sittingDetails;

  const textColor = isUrgent ? Colors.urgentTextColor : Colors.iconSecondary;
  const backgroundColor = isUrgent
    ? Colors.urgentColor
    : userId != null
    ? Colors.AcceptButtonColor
    : Colors.cardBackgroundColor;
  const borderColor = isUrgent ? Colors.urgentTextColor : Colors.mainColor;
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        gap: 8,
        backgroundColor: backgroundColor,
        borderRadius: 16,
        marginVertical: 8,
        borderColor: borderColor,
        borderWidth: 1,
      }}
    >
      <Image
        source={{
          uri: "data:image/jpeg;base64," + pet.image,
        }}
        style={{
          height: 100,
          width: 100,
          borderRadius: 16,
        }}
      />
      <View
        style={{
          gap: 8,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View>
          <Text
            style={[
              { fontSize: 22 },
              Styles.specificFontFamily,
              Styles.boldFont,
              { color: textColor, fontWeight: "bold" },
            ]}
          >
            {pet.name}
          </Text>
          <Text
            style={[
              { fontSize: 12, color: textColor },
              Styles.specificFontFamily,
            ]}
          >
            {"from " + startDate + " to " + endDate}
          </Text>
          {userId != null ? (
            <Text>
              <Text
                style={[
                  { fontSize: 12, color: textColor },
                  Styles.specificFontFamily,
                ]}
              >
                Booked by {user.name}
              </Text>
            </Text>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <IconSymbol name="location" color={textColor} />
            <Text
              style={[
                { fontSize: 12, color: textColor },
                Styles.specificFontFamily,
              ]}
            >
              {address}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", padding: 8 }}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/petProfile/[petId]",
                  params: {
                    petId: pet.id,
                    canBook: canBook == true ? "true" : "false",
                    bookingId: bookingId,
                  },
                });
              }}
            >
              <Text
                style={{
                  color: isUrgent ? Colors.urgentTextColor : Colors.mainColor,
                  fontWeight: "bold",
                }}
              >
                See more {">"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
