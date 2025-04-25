import { SittingProfile } from "@/app/(tabs)/schedule";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Styles } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "./IconSymbol";

export function SittingDetails(sittingDetails: SittingProfile) {
  const { name, image, date, time, location } = sittingDetails;
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        gap: 8,
        backgroundColor: Colors.cardBackgroundColor,
        borderRadius: 16,
        marginVertical: 8,
        borderColor: Colors.borderColor,
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
            ]}
          >
            {name}
          </Text>
          <Text style={[{ fontSize: 12 }, Styles.specificFontFamily]}>
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
            <IconSymbol name="location" color={Colors.iconSecondary} />
            <Text style={[{ fontSize: 12 }, Styles.specificFontFamily]}>
              {location}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", padding: 8 }}>
            <TouchableOpacity>
              <Text style={{ color: Colors.mainColor, fontWeight: "bold" }}>
                See more {">"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
