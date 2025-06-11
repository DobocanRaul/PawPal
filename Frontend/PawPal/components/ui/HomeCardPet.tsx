import { Pet } from "@/app/(tabs)/schedule";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

type CardProps = {
  pet: Pet;
};
export function HomeCardPet(props: CardProps) {
  const { pet } = props;
  const router = useRouter();
  return (
    <View
      style={{
        margin: 10,
        alignItems: "center",
        borderColor: Colors.mainColor,
        backgroundImage: "data:image/jpeg;base64," + pet.image,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/petProfile/[petId]",
            params: {
              petId: pet.id,
            },
          });
        }}
      >
        <ImageBackground
          source={{ uri: "data:image/jpeg;base64," + pet.image }}
          style={{
            width: 240,
            height: 240,
            borderRadius: 8,
            overflow: "hidden",
            borderWidth: 2,
            justifyContent: "flex-end",
            paddingHorizontal: 8,
            alignItems: "flex-end",
          }}
        >
          <Text style={styles.cardText}>
            {pet.name} - {pet.age + " years old"}
          </Text>
          <Text style={styles.cardText}>{"at " + pet.address}</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardText: {
    fontSize: 18,
    color: Colors.light.background,
    fontWeight: "bold",
  },
});
