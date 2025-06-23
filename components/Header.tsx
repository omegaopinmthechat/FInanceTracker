import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter, usePathname } from "expo-router";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const hideLogout = ["/login", "/signup", "/reset-password"].includes(pathname);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>FInanceTracker</Text>
      {!hideLogout && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#9b59b6",
    alignItems: "center",
    justifyContent: "center",
    height: 90,
    width: "100%",
    flexDirection: "row",
    position: "relative",
  },
  title: {
    top: 20,
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    flex: 1,
    textAlign: "center",
  },
  logoutBtn: {
    position: "absolute",
    right: 20,
    top: 40,
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginTop: 8,
  },
  logoutText: {
    color: "#9b59b6",
    fontWeight: "bold",
    fontSize: 16,
  },
});
