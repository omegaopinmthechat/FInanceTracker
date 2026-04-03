import { Image, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "@/theme/colors";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const hideLogout = ["/login", "/signup", "/reset-password"].includes(pathname);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <View style={styles.headerContainer}>
      <SafeAreaView style={styles.header}>
        <View style={styles.brandWrap}>
          <Image
            source={require("../images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>FinanceTracker</Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 }, // shadow below header
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: 0.3,
    fontFamily: fonts.display,
    flexShrink: 1,
  },
  logoutBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  logoutText: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: fonts.heading,
  },
});

