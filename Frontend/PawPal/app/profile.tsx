import { ThemedView } from "@/components/ThemedView";
import { ProfileDetails } from "@/components/ui/ProfileDetails";

export default function profile() {
  return (
    <ThemedView style={{ flex: 1, paddingTop: 40, backgroundColor: "#fff" }}>
      <ProfileDetails />
    </ThemedView>
  );
}
