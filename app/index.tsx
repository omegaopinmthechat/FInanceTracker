import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 50); // short delay ensures layout is mounted
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient
      colors={["#a770ef", "#f6d365"]}
      style={styles.gradient}
    >
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
