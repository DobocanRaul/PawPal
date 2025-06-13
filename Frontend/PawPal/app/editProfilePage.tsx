import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { UserProfile } from "./profile/[userId]";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  Image,
} from "react-native";
import { Colors } from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function editProfilePage() {
  const [userId, setUserId] = useState<string>("");
  const [profileDetails, setProfileDetails] = useState<UserProfile>();
  const [name, setName] = useState<string>("");
  const [bestWithTags, setBestWithTags] = useState<string[]>([]);
  const [availabilityTags, setAvailabilityTags] = useState<string[]>([]);
  const [currentAvailTag, setCurrentAvailTag] = useState<string>("");
  const [descriptionTags, setDescriptionTags] = useState<string[]>([]);
  const [descriptionTag, setDescriptionTag] = useState<string>("");
  const [petTag, setPetTag] = useState<string>("");
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const router = useRouter();
  useEffect(() => {
    const getUser = async function () {
      const userId = (await SecureStore.getItemAsync("userId")) || "";
      setUserId(userId);

      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const url = `${API_URL}/User/GetUser/${userId}`;
      fetch(url, {
        method: "GET",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY ?? "",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setProfileDetails(data);
          setName(data.name);
          setAvailabilityTags(data.availabilityTags);
          setDescriptionTags(data.descriptionTags);
          setBestWithTags(data.bestWithTags);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    };

    getUser();
  }, []);

  const updateUser = async () => {
    if (!name) {
      Toast.show({
        type: "error",
        text1: "Name is required",
      });
      return;
    }

    if (
      availabilityTags.length < 1 ||
      descriptionTags.length < 1 ||
      bestWithTags.length < 1
    ) {
      Toast.show({
        type: "error",
        text1: "Please add at least one tag in each category",
      });
      return;
    }

    const formData = new FormData();
    formData.append("Id", userId);
    formData.append("Email", profileDetails?.email ?? "");
    formData.append("Name", name);
    formData.append("Address", profileDetails?.address ?? "");

    if (image == null) {
      formData.append("Image", {
        uri: "data:image/jpeg;base64," + profileDetails?.image,
        name: "image.name",
        type: "image/jpeg",
      } as any);
    } else {
      formData.append("Image", {
        uri: image.uri,
        name: image.name,
        type: "image/jpeg",
      } as any);
    }
    availabilityTags.forEach((tag) => formData.append("AvailabilityTags", tag));
    descriptionTags.forEach((tag) => formData.append("DescriptionTags", tag));
    bestWithTags.forEach((tag) => formData.append("BestWithTags", tag));

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const url = `${API_URL}/User/UpdateUser/${userId}`;

      const response = await fetch(url, {
        method: "PUT",
        body: formData,
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
        },
      });
      if (response.status === 404) {
        Toast.show({
          type: "error",
          text1: "This user does not exist!",
        });
      } else if (response.status === 400) {
        const text = await response.text();
        Toast.show({
          type: "error",
          text1: "Invalid input",
          text2: text,
        });
      } else if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Profile edited successfully",
        });
        router.replace("/(tabs)");
      } else {
        const text = await response.text();
        Toast.show({
          type: "error",
          text1: "Registration failed",
          text2: text,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
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
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <GestureHandlerRootView
              style={{
                backgroundColor: Colors.light.background,
                flex: 1,
                justifyContent: "space-evenly",
              }}
            >
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Change name"
              />
              <Text style={[styles.label, { marginTop: 10 }]}>
                Preferred Animals
              </Text>
              <View style={styles.tagInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Type an animal"
                  value={petTag}
                  onChangeText={setPetTag}
                />
                <Button
                  title="Add"
                  onPress={() => {
                    if (petTag.length) {
                      setBestWithTags((prev) => [...prev, petTag]);
                      setPetTag("");
                    }
                  }}
                  color={Colors.mainColor}
                />
              </View>
              <FlatList
                data={bestWithTags}
                keyExtractor={(tag) => tag}
                horizontal
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      setBestWithTags((prev) =>
                        prev.filter((tag) => tag != item)
                      )
                    }
                  >
                    <Text style={styles.tagItem}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={{ marginTop: 10 }}
              />
              <Text style={styles.label}>Availability?</Text>
              <View style={styles.tagInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Did the availability change?"
                  value={currentAvailTag}
                  onChangeText={setCurrentAvailTag}
                />
                <Button
                  title="Add"
                  onPress={() => {
                    if (currentAvailTag.length) {
                      setAvailabilityTags((prev) => [...prev, currentAvailTag]);
                      setCurrentAvailTag("");
                    }
                  }}
                  color={Colors.mainColor}
                />
              </View>
              <FlatList
                data={availabilityTags}
                keyExtractor={(tag) => tag}
                horizontal
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      setAvailabilityTags((prev) =>
                        prev.filter((tag) => tag != item)
                      )
                    }
                  >
                    <Text style={styles.tagItem}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={{ marginTop: 10 }}
              />
              <Text style={styles.label}>Description</Text>
              <View style={styles.tagInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Want to add more words?"
                  value={descriptionTag}
                  onChangeText={setDescriptionTag}
                />
                <Button
                  title="Add"
                  onPress={() => {
                    if (descriptionTag.length) {
                      setDescriptionTags((prev) => [...prev, descriptionTag]);
                      setDescriptionTag("");
                    }
                  }}
                  color={Colors.mainColor}
                />
              </View>
              <FlatList
                data={descriptionTags}
                keyExtractor={(tag) => tag}
                horizontal
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      setDescriptionTags((prev) =>
                        prev.filter((tag) => tag != item)
                      )
                    }
                  >
                    <Text style={styles.tagItem}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={{ marginTop: 10 }}
              />
              <TouchableOpacity onPress={pickImage}>
                {image?.uri ? (
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={[
                      styles.image,
                      {
                        backgroundColor: "#eee",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text>Select an image</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyling}
                onPress={() => {
                  updateUser();
                }}
              >
                <Text style={styles.buttonText}>Save changes</Text>
              </TouchableOpacity>
            </GestureHandlerRootView>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonStyling: {
    backgroundColor: Colors.mainColor,
    width: 100,
    height: 75,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  tagInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
    justifyContent: "center",
  },
  tagItem: {
    backgroundColor: Colors.mainColor,
    color: Colors.light.background,
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background, // make sure this is pure white
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: Colors.labelTextColor,
    marginBottom: 6,
    paddingHorizontal: 20,
    fontWeight: "700",
    fontFamily: "Inter-Regular",
  },
  input: {
    backgroundColor: Colors.textBox,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.mainColor,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    borderBottomColor: Colors.labelTextColor,
    borderBottomWidth: 0.5,
    marginVertical: 20,
    width: "90%",
    alignSelf: "center",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  link: {
    color: Colors.linkTextColor,
    marginLeft: 5,
    fontWeight: "500",
  },
});
