import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from '@/theme/colors';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setErrorMessage(error.message || "Reset failed. Please try again.");
    } else {
      setSuccessMessage("Check your email for a password reset link.");
      setTimeout(() => {
        router.replace("/login");
      }, 1600);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>We will send a secure reset link to your email.</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="user@email.com"
            placeholderTextColor={colors.textMuted}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  logo: {
    width: 74,
    height: 74,
    marginBottom: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
    alignSelf: "flex-start",
    letterSpacing: 0.2,
    fontFamily: fonts.display,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: fonts.body,
  },
  errorText: {
    width: "100%",
    color: colors.error,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 13,
    fontFamily: fonts.body,
  },
  successText: {
    width: "100%",
    color: colors.success,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(22, 163, 74, 0.35)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 13,
    fontFamily: fonts.body,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: colors.textPrimary,
    fontFamily: fonts.heading,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.body,
  },
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
    paddingVertical: 14,
    textAlign: "center",
    fontFamily: fonts.heading,
  },
  link: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 13,
    textAlign: "left",
    fontWeight: "500",
    fontFamily: fonts.body,
  },
});