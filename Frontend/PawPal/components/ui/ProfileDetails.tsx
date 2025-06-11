import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { HeaderComponent } from "./HeaderComponent";
import StarRating from "react-native-star-rating-widget";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { TagSquare } from "./TagSquare";
import { Colors } from "@/constants/Colors";
import { UserProfile } from "@/app/profile";

type ProfileDetailsProps = {
  profile: UserProfile;
};

export function ProfileDetails(props: ProfileDetailsProps) {
  const { profile } = props;
  return (
    <GestureHandlerRootView>
      <HeaderComponent />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          gap: 16,
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={{
            uri: "data:image/jpeg;base64," + profile.image,
          }}
          style={{
            height: 300,
            width: "100%",
            borderRadius: 16,
          }}
        />
        <View
          style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}
        >
          <Text style={[Styles.specificFontFamily, Styles.textSize]}>
            Hi, I'm{" "}
          </Text>
          <Text
            style={[
              { fontSize: 36 },
              Styles.specificFontFamily,
              Styles.boldFont,
            ]}
          >
            {profile.name}
          </Text>
          <StarRating
            rating={profile.rating}
            maxStars={5}
            starSize={24}
            color={Colors.mainColor}
            starStyle={{ marginHorizontal: 0 }}
            onChange={(_) => {}}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            flex: 0.9,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[Styles.specificFontFamily, Styles.boldFont]}>
              I'm best with
            </Text>
            <FlatList
              data={profile.bestWithTags}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TagSquare displayText={item} iconName="pawicon" />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[Styles.specificFontFamily, Styles.boldFont]}>
              I'm available on
            </Text>
            <FlatList
              data={profile.availabilityTags}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TagSquare displayText={item} iconName="calendar.fill" />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[Styles.specificFontFamily, Styles.boldFont]}>
              Me in a nutshell
            </Text>
            <FlatList
              data={profile.descriptionTags}
              horizontal={true}
              renderItem={({ item }) => (
                <TagSquare displayText={item} iconName="fingerprintIcon" />
              )}
            />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const Styles = StyleSheet.create({
  textSize: {
    fontSize: 24,
  },
  specificFontFamily: {
    fontFamily: "Inter-Regular",
  },
  boldFont: {
    fontWeight: "900",
  },
});
