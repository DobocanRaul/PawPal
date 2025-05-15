import { SittingHistoryInfo } from "@/app/sittingHistory";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { View, Image, Text, TouchableOpacity } from "react-native";
import StarRating from "react-native-star-rating-widget";
type SittingHistoryProps = {
  sittingInfo: SittingHistoryInfo;
};

export function SittingHistoryCard({ sittingInfo }: SittingHistoryProps) {
  const { name, image, date, rating } = sittingInfo;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        backgroundColor: Colors.SittingHistoryCard.BackgroundColor,
        borderRadius: 16,
        borderColor: Colors.SittingHistoryCard.BorderColor,
        borderWidth: 1,
        height: 100,
        marginVertical: 8,
      }}
    >
      <Image
        source={{ uri: image }}
        style={{ borderRadius: 0, height: 100, width: 100 }}
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
              { fontWeight: "bold" },
            ]}
          >
            {name}
          </Text>
          <Text style={[{ fontSize: 12 }, Styles.specificFontFamily]}>
            You were with {name} on {date.toUTCString().slice(0, 16)}
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
            <StarRating
              rating={rating}
              maxStars={5}
              starSize={24}
              color={Colors.SittingHistoryCard.StarColor}
              starStyle={{ marginHorizontal: 0 }}
              onChange={(_) => {}}
            />
          </View>
          <View style={{ alignItems: "flex-end", padding: 8 }}>
            <TouchableOpacity>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                View Details {">"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
