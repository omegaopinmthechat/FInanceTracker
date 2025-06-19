import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>FInanceTracker</Text>
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
  },
  title: {
    top: 20,
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});