import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows } from '@/theme/colors';

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
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="user@email.com"
            placeholderTextColor="#b0b0b0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <LinearGradient
          colors={["#a770ef", "#f6d365"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <TouchableOpacity style={{ width: "100%" }} onPress={handleReset}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 32,
    alignSelf: "center",
    letterSpacing: 1.2,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: colors.textPrimary },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    paddingVertical: 14,
    textAlign: "center",
  },
  link: {
    color: colors.primaryLight,
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});