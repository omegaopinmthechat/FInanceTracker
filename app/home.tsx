import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from "react-native";
import React from 'react';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Text>Welcome to the Home 123page!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 }
});

export default Home;