import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { HeaderComponent } from "./HeaderComponent";
import StarRating from "react-native-star-rating-widget";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { TagSquare } from "./TagSquare";
type Profile = {
  id: string;
  name: string;
  rating: number;
  bestWith: Array<string>;
  availability: string;
  descriptionTags: Array<string>;
};

export function ProfileDetails() {
  const rating = 4.5;
  const name: string = "John Doe";
  const BestWithTags = ["Dog", "Cat", "Bird"];
  const AvailabilityTags = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const DescriptionTags = ["Smoker", "Empath"];
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
            uri: "https://reactnative.dev/img/tiny_logo.png",
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
          <Text style={[{ fontSize: 32 }, Styles.specificFontFamily]}>
            {name}
          </Text>
          <StarRating
            rating={rating}
            maxStars={5}
            starSize={24}
            color="#9747FF"
            starStyle={{ marginHorizontal: 0 }}
            onChange={(_) => {}}
          />
        </View>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={Styles.specificFontFamily}>I'm best with</Text>
            <FlatList
              data={BestWithTags}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TagSquare displayText={item} iconName="pawicon" />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={Styles.specificFontFamily}>I'm available on</Text>
            <FlatList
              data={AvailabilityTags}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TagSquare displayText={item} iconName="calendar.fill" />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={Styles.specificFontFamily}>Me in a nutshell</Text>
            <FlatList
              data={DescriptionTags}
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
});
