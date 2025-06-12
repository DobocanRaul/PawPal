import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  Button,
  Image,
} from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function signup() {
  const [page, setPage] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisibile, setpasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisibile, setConfirmPasswordVisible] =
    useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const [availabilityTags, setAvailabilityTags] = useState<string[]>([]);
  const [currentAvailTag, setCurrentAvailTag] = useState<string>("");

  const [descriptionTags, setDescriptionTags] = useState<string[]>([]);
  const [descriptionTag, setDescriptionTag] = useState<string>("");

  const [petPreferenceTags, setPetPreferenceTags] = useState<string[]>([]);
  const [petTag, setPetTag] = useState<string>("");

  const registerUser = async () => {
    if (
      !email ||
      !confirmEmail ||
      email.toLowerCase() !== confirmEmail.toLowerCase()
    ) {
      Toast.show({
        type: "error",
        text1: "Emails must match and cannot be empty",
      });
      return;
    }

    if (!password || !confirmPassword || password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords must match and cannot be empty",
      });
      return;
    }

    if (!firstName || !lastName) {
      Toast.show({
        type: "error",
        text1: "First and Last name are required",
      });
      return;
    }

    if (!address || !city) {
      Toast.show({
        type: "error",
        text1: "Address and city are required",
      });
      return;
    }

    if (!image) {
      Toast.show({
        type: "error",
        text1: "Profile image is required",
      });
      return;
    }

    if (
      availabilityTags.length < 1 ||
      descriptionTags.length < 1 ||
      petPreferenceTags.length < 1
    ) {
      Toast.show({
        type: "error",
        text1: "Please add at least one tag in each category",
      });
      return;
    }

    const formData = new FormData();
    formData.append("Email", email);
    formData.append("Password", password);
    formData.append("Name", `${firstName} ${lastName}`);
    formData.append("Address", `${address}, ${city}`);

    formData.append("Image", {
      uri: image.uri,
      name: image.name,
      type: "image/jpeg",
    } as any);

    availabilityTags.forEach((tag) => formData.append("AvailabilityTags", tag));
    descriptionTags.forEach((tag) => formData.append("DescriptionTags", tag));
    petPreferenceTags.forEach((tag) => formData.append("BestWithTags", tag));

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const url = `${API_URL}/Auth/register`;

      console.log(url);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.status === 409) {
        Toast.show({
          type: "error",
          text1: "An account already exists with this email!",
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
          text1: "Account registered successfully",
        });
        router.replace("/(auth)");
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
                justifyContent: "space-around",
                flex: 1,
                backgroundColor: Colors.light.background,
              }}
            >
              {page == 1 ? (
                <View>
                  <Text style={styles.welcomeText}>Tell us about you</Text>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Add your Email"
                  />
                  <Text style={styles.label}>Confirm Email</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmEmail}
                    onChangeText={setConfirmEmail}
                    placeholder="Confirm your Email"
                  />
                  <Text style={styles.label}>Password</Text>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      style={[styles.input, { paddingRight: 40 }]}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={passwordVisibile ? false : true}
                      placeholder="Add your password"
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: "10%",
                        top: "50%",
                        transform: [{ translateY: -20 }],
                      }}
                      onPress={() => setpasswordVisible((prev) => !prev)}
                    >
                      <IconSymbol name="eye" color={Colors.labelTextColor} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      style={[styles.input, { paddingRight: 40 }]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={confirmPasswordVisibile ? false : true}
                      placeholder="Confirm your password"
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: "10%",
                        top: "50%",
                        transform: [{ translateY: -20 }],
                      }}
                      onPress={() => setConfirmPasswordVisible((prev) => !prev)}
                    >
                      <IconSymbol name="eye" color={Colors.labelTextColor} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : page == 2 ? (
                <View>
                  <Text style={styles.welcomeText}>
                    Tell us about{"\n"} the real you
                  </Text>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                  />
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                  />
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter city"
                  />
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="The name of the street"
                  />
                </View>
              ) : (
                <View>
                  <Text style={styles.welcomeText}>It's about the details</Text>
                  <Text style={styles.label}>
                    Tell us when are you available?
                  </Text>

                  <View style={styles.tagInputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Type something"
                      value={currentAvailTag}
                      onChangeText={setCurrentAvailTag}
                    />
                    <Button
                      title="Add"
                      onPress={() => {
                        if (currentAvailTag.length) {
                          setAvailabilityTags((prev) => [
                            ...prev,
                            currentAvailTag,
                          ]);
                          setCurrentAvailTag("");
                        }
                      }}
                      color={Colors.mainColor}
                    />
                  </View>
                  <FlatList
                    data={availabilityTags}
                    keyExtractor={(tag) => tag}
                    contentContainerStyle={{ marginBottom: 40 }}
                    horizontal
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
                  <Text style={styles.label}>
                    Describe yourself in a couple of words!
                  </Text>

                  <View style={styles.tagInputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Type something"
                      value={descriptionTag}
                      onChangeText={setDescriptionTag}
                    />
                    <Button
                      title="Add"
                      onPress={() => {
                        if (descriptionTag.length) {
                          setDescriptionTags((prev) => [
                            ...prev,
                            descriptionTag,
                          ]);
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
                    contentContainerStyle={{ marginBottom: 40 }}
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
                  <Text style={styles.label}>
                    Tell us what animals are you best with?
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
                          setPetPreferenceTags((prev) => [...prev, petTag]);
                          setPetTag("");
                        }
                      }}
                      color={Colors.mainColor}
                    />
                  </View>
                  <FlatList
                    data={petPreferenceTags}
                    keyExtractor={(tag) => tag}
                    horizontal
                    contentContainerStyle={{ marginBottom: 40 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          setPetPreferenceTags((prev) =>
                            prev.filter((tag) => tag != item)
                          )
                        }
                      >
                        <Text style={styles.tagItem}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    style={{ marginTop: 10 }}
                  />

                  <Text style={styles.label}>Show us what you look like!</Text>
                  <TouchableOpacity onPress={pickImage}>
                    {image?.uri ? (
                      <Image source={{ uri: image.uri }} style={styles.image} />
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
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                {page > 1 ? (
                  <TouchableOpacity
                    style={styles.buttonStyling}
                    onPress={() =>
                      setPage((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                  >
                    <Text style={styles.buttonText}>Prev</Text>
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )}
                {page < 3 ? (
                  <TouchableOpacity
                    style={styles.buttonStyling}
                    onPress={() =>
                      setPage((prev) => (prev < 4 ? prev + 1 : prev))
                    }
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.buttonStyling}
                    onPress={() => {
                      registerUser();
                    }}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    width: 75,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
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
    height: 200,
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
    marginBottom: 16,
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
