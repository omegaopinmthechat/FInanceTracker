import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Please enter your email.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert("Reset failed", error.message);
    } else {
      Alert.alert("Check your email for a password reset link!");
      router.replace("/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.link}>Back to Login</Text>
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