import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows, spacing, radii } from "@/theme/colors";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const hideLogout = ["/login", "/signup", "/reset-password"].includes(pathname);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <LinearGradient
      colors={colors.headerGradient as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.header}>
        <Text style={styles.title}>FinanceTracker</Text>
        {!hideLogout && (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
  logoutText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
});

