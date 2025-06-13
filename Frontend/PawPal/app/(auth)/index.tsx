import { Colors } from "../../constants/Colors";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import * as SecureStorage from "expo-secure-store";
import { router } from "expo-router";
import { IconSymbol } from "../../components/ui/IconSymbol";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = useCallback(() => {
    const goLogin = async function () {
      try {
        const API_URL = process.env.EXPO_PUBLIC_API_URL;
        const login_URL = API_URL + "/auth/login";
        const body = JSON.stringify({
          email: email,
          password: password,
        });
        fetch(login_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.EXPO_PUBLIC_API_KEY,
          },
          body: body,
        })
          .then((response) => {
            if (response.status != 200) {
              throw new Error("Credentials not ok!");
            } else return response.json();
          })
          .then((data) => {
            SecureStorage.setItemAsync("userId", data.userId);
            SecureStorage.setItemAsync("token", data.token);
            router.replace("/(tabs)");
          });
      } catch (error) {
        console.error(error);
      }
    };

    goLogin();
  }, [email, password]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.welcomeText}>Welcome!</Text>

            <Image
              source={require("../../assets/images/LoginGroup.png")}
              style={styles.image}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>

            <View style={{ position: "relative" }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.input, { paddingRight: 40 }]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: "50%",
                  transform: [{ translateY: -20 }],
                }}
              >
                <IconSymbol name="eye" color={Colors.labelTextColor} />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity>
              <Text
                style={[
                  styles.label,
                  {
                    fontWeight: "bold",
                    alignSelf: "flex-end",
                    paddingHorizontal: 10,
                  },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.signupRow}>
              <Text style={styles.label}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(auth)/signup");
                }}
              >
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
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
  },
  input: {
    backgroundColor: Colors.textBox,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
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
