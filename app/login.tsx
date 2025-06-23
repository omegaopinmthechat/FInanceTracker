import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Login failed", error.message);
    } else {
      router.replace("/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Ex: user@email.com"
          placeholderTextColor="#b0b0b0"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#b0b0b0"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Do not have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/reset-password")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#9b59b6", marginBottom: 32, alignSelf: "center" },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 18, fontWeight: "500", marginBottom: 6 },
  input: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#9b59b6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  link: {
    color: "#9b59b6",
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});