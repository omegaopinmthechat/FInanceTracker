import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Slot />
      </View>
      <Navbar />
    </View>
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
