import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import { colors } from "@/theme/colors";
import { supabase } from "@/utils/supabase";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    const restoreSessionAndRoute = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isActive) return;
      router.replace(session ? "/home" : "/login");
    };

    restoreSessionAndRoute();

    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  logo: {
    width: 140,
    height: 140,
  },
});
