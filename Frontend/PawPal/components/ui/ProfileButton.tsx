import { TouchableOpacity } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Colors } from "../../constants/Colors";
export function ProfileButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingRight: 16 }}>
      <IconSymbol name="person" size={30} color={Colors.iconSecondary} />
    </TouchableOpacity>
  );
}
