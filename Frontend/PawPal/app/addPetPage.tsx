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
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStorage from "expo-secure-store";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export default function AddPetPage() {
  const [page, setPage] = useState<number>(1);
  const [petName, setPetName] = useState<string>("");
  const [isFemale, setIsFemale] = useState<boolean>(false);
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
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

  const uploadPet = async () => {
    if (!image) {
      Toast.show({
        type: "error",
        text1: "Image is required",
      });
      return;
    }
    if (tags.length < 2) {
      Toast.show({
        type: "error",
        text1: "Add at least 2 tags",
      });
    }
    if (!petName) {
      Toast.show({
        type: "error",
        text1: "Name is required",
      });
      return;
    }

    if (!street || !city) {
      Toast.show({
        type: "error",
        text1: "Address is required",
      });
      return;
    }

    try {
      Number.parseFloat(age);
      Number.parseFloat(weight);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Age or weight are not a number",
      });
    }

    const formData = new FormData();

    formData.append("Name", petName);
    formData.append("OwnerId", userId || "");
    formData.append("Address", `Str ${street}, ${city}`);
    formData.append("IsFemale", isFemale.toString());
    formData.append("Weight", weight.toString());
    formData.append("Description", description);
    formData.append("Age", age.toString());
    tags.forEach((tag) => formData.append("Tags", tag));
    formData.append("Image", {
      uri: image.uri,
      name: image.name,
      type: "image/jpeg",
    } as any);

    try {
      const url = API_URL + "/Pet/CreatePet";
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to upload pet:", errorText);
      } else {
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
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {page === 1 ? (
                <View>
                  <Text style={styles.sectionTitle}>
                    We start with some basic questions! 😁
                  </Text>
                  <Text style={styles.label}>What is its name?</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Insert Name"
                    value={petName}
                    onChangeText={setPetName}
                  />
                  <Text style={styles.label}>What is it?</Text>
                  <View style={styles.switchRow}>
                    <Text>Boy</Text>
                    <Switch
                      value={isFemale}
                      onValueChange={setIsFemale}
                      thumbColor={isFemale ? "#FF69B4" : "#2196F3"}
                      trackColor={{ false: "#d3d3d3", true: "#f8b6d2" }}
                    />
                    <Text>Girl</Text>
                  </View>
                  <Text style={styles.label}>What is its age?</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Insert age"
                    value={age.toString()}
                    onChangeText={(text) => setAge(text)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.label}>Is it a big one? 😊</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Insert weight"
                    value={weight.toString()}
                    onChangeText={(text) => setWeight(text)}
                    keyboardType="numeric"
                  />
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    {!isFemale ? (
                      <Image
                        source={require("../assets/images/Boy.png")}
                        style={{
                          width: 200,
                          height: 200,
                          alignSelf: "flex-end",
                        }}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={{ width: 200, height: 200 }}></View>
                    )}

                    {!isFemale ? (
                      <View style={{ width: 200, height: 200 }}></View>
                    ) : (
                      <Image
                        source={require("../assets/images/Girl.png")}
                        style={{
                          width: 200,
                          height: 200,
                          alignSelf: "flex-end",
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </View>
              ) : (
                <GestureHandlerRootView>
                  <View>
                    <Text style={styles.sectionTitle}>
                      Can't forget about the details! 😅
                    </Text>
                    <Text style={styles.label}>
                      Tell us what people should know
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Here goes the description"
                      value={description}
                      onChangeText={setDescription}
                    />
                    <Text style={styles.label}>Where is its home?</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="The city"
                      value={city}
                      onChangeText={setCity}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="The street"
                      value={street}
                      onChangeText={setStreet}
                    />
                    <Text style={styles.label}>
                      We need a picture of them too!
                    </Text>
                    <TouchableOpacity onPress={pickImage}>
                      {image?.uri ? (
                        <Image
                          source={{ uri: image.uri }}
                          style={styles.image}
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
                    <Text style={styles.label}>
                      Lastly, add some special tags!
                    </Text>
                    <View style={styles.tagInputRow}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Type something"
                        value={currentTag}
                        onChangeText={setCurrentTag}
                      />
                      <Button
                        title="Add"
                        onPress={() => {
                          if (currentTag.length) {
                            setTags((prev) => [...prev, currentTag]);
                            setCurrentTag("");
                          }
                        }}
                        color={Colors.mainColor}
                      />
                    </View>
                    <FlatList
                      data={tags}
                      keyExtractor={(tag) => tag}
                      horizontal
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() =>
                            setTags((prev) => prev.filter((tag) => tag != item))
                          }
                        >
                          <Text style={styles.tagItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      style={{ marginTop: 10 }}
                    />
                  </View>
                </GestureHandlerRootView>
              )}
              <View style={styles.navButtons}>
                {page > 1 ? (
                  <TouchableOpacity
                    onPress={() => setPage((prev) => prev - 1)}
                    style={styles.buttonStyling}
                  >
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
                {page < 2 ? (
                  <TouchableOpacity
                    style={styles.buttonStyling}
                    onPress={() => setPage((prev) => prev + 1)}
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.buttonStyling}
                    onPress={uploadPet}
                  >
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: Colors.light.background,
    justifyContent: "space-between",
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    height: 40,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 6,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  tagInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  tagItem: {
    backgroundColor: Colors.mainColor,
    color: Colors.light.background,
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 40,
  },
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
