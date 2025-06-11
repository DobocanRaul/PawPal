import { ThemedView } from "@/components/ThemedView";
import { ProfileDetails } from "@/components/ui/ProfileDetails";
import { useEffect, useState } from "react";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePicture: string; // base64 or URL
};

export default function profile() {
  const [profileDetails, setProfileDetails] = useState<UserProfile | null>(
    null
  );

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
  }, []);
  return (
    <ThemedView style={{ flex: 1, paddingTop: 40, backgroundColor: "#fff" }}>
      <ProfileDetails />
    </ThemedView>
  );
}
