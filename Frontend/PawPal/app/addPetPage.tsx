import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Button,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Image,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import {
  FlatList,
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import { NativeGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/nativeGesture";
import * as SecureStorage from "expo-secure-store";
import { router } from "expo-router";
export default function addPetPage() {
  const [page, setPage] = useState<number>(1);
  const [petName, setPetName] = useState<string>("");
  const [isFemale, setIsFemale] = useState<boolean>(false);
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0.0);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const userId = SecureStorage.getItem("userId");
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  console.log(image);
  const uploadPet = async () => {
    if (!image) {
      console.error("Image is required.");
      return;
    }

    const formData = new FormData();

    formData.append("Name", petName); // 'Name'
    formData.append("OwnerId", userId || ""); // 'OwnerId'
    formData.append("Address", `Str ${street}, ${city}`); // 'Address'
    formData.append("IsFemale", isFemale.toString()); // 'IsFemale'
    formData.append("Weight", weight.toString()); // 'Weight'
    formData.append("Description", description); // 'Description'
    formData.append("Age", age.toString()); // 'Age'

    tags.forEach((tag) => formData.append("Tags", tag)); // 'Tags=string'

    // Image
    formData.append("Image", {
      uri: image.uri,
      name: image.name,
      type: "image/jpeg",
    } as any);
    console.log(formData);

    try {
      const url = API_URL + "/Pet/CreatePet";
      console.log(url);
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to upload pet:", errorText);
      } else {
        console.log("Pet uploaded successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error during pet upload:", error);
    }
  };

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        name: asset.fileName || "photo.jpg",
        type: asset.type || "image/jpeg",
      });
    }
  }, []);

  return (
    <View
      style={{
        backgroundColor: Colors.light.background,
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      {page === 1 ? (
        <View>
          <Text>We start with some basic questions! 😁</Text>
          <Text>What is it's name?</Text>
          <TextInput
            placeholder="Insert Name"
            value={petName}
            onChangeText={setPetName}
          />
          <Text>What is it?</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Boy</Text>
            <Switch
              value={isFemale}
              onValueChange={setIsFemale}
              thumbColor={isFemale ? "#FF69B4" : "#2196F3"}
              trackColor={{ false: "#d3d3d3", true: "#f8b6d2" }}
            />
            <Text>Girl</Text>
          </View>
          <Text>What is it's age?</Text>
          <TextInput
            placeholder="Insert age"
            value={age.toString()}
            onChangeText={(text) => setAge(Number(text))}
            keyboardType="numeric"
          />
          <Text>Is it a big one ? 😊</Text>
          <TextInput
            placeholder="Insert weight"
            value={weight.toString()}
            onChangeText={(text) => setWeight(Number(text))}
            keyboardType="numeric"
          />
        </View>
      ) : (
        <GestureHandlerRootView>
          <View>
            <Text>Can't forget about the details!😅</Text>
            <Text>Tell us what the people should know about it!</Text>
            <TextInput
              placeholder="Here goes the description"
              value={description}
              onChangeText={setDescription}
            />
            <Text>Where is it's home?</Text>
            <TextInput
              placeholder="The city"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              placeholder="The street"
              value={street}
              onChangeText={setStreet}
            />
            <Text>We need a picture of his also!</Text>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{
                  uri: image?.uri,
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              />
            </TouchableOpacity>
            <Text>Lastly, tell us about the special things!</Text>
            <TextInput
              placeholder="Type something"
              value={currentTag}
              onChangeText={setCurrentTag}
            />
            <Button
              title="Add tag"
              onPress={() => {
                if (currentTag.length) {
                  setTags((prev) => [...prev, currentTag]);
                  setCurrentTag("");
                }
              }}
            />
            <FlatList
              data={tags}
              keyExtractor={(tag) => tag}
              renderItem={({ item }) => <Text>{item}</Text>}
            />
          </View>
        </GestureHandlerRootView>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          paddingBottom: 40,
        }}
      >
        {page > 1 ? (
          <TouchableOpacity
            onPress={() => {
              if (page !== 1) {
                setPage((prev) => prev - 1);
              }
            }}
            style={{
              backgroundColor: Colors.mainColor,
              width: 75,
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}

        {page < 2 ? (
          <TouchableOpacity
            style={styles.buttonStyling}
            onPress={() => {
              if (page !== 2) {
                setPage((prev) => prev + 1);
              }
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonStyling} onPress={uploadPet}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyling: {
    backgroundColor: Colors.mainColor,
    width: 75,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: Colors.light.background,
    fontWeight: "bold",
  },
});
