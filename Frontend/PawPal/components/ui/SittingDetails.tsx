import { SittingProfile } from "@/app/(tabs)/schedule";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Styles } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "./IconSymbol";

type SittingDetailsProps = {
  sittingDetails: SittingProfile;
  isUrgent?: boolean;
};

export function SittingDetails({
  sittingDetails,
  isUrgent,
}: SittingDetailsProps) {
  const { name, image, date, time, location } = sittingDetails;
  const textColor = isUrgent ? Colors.urgentTextColor : Colors.iconSecondary;
  const backgroundColor = isUrgent
    ? Colors.urgentColor
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
          uri: image,
        }}
        style={{
          height: 100,
          width: 100,
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
            {name}
          </Text>
          <Text
            style={[
              { fontSize: 12, color: textColor },
              Styles.specificFontFamily,
            ]}
          >
            {date + " at " + time}
          </Text>
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
              {location}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", padding: 8 }}>
            <TouchableOpacity>
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
