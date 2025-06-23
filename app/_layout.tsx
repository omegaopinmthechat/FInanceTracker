import { Slot, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  const pathname = usePathname();
  // Hide header/navbar on login, signup, and reset-password pages
  const hideNav = ["/login", "/signup", "/reset-password"].includes(pathname);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {!hideNav && <Header />}
        <View style={styles.content}>
          <Slot />
        </View>
        {!hideNav && <Navbar />}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
