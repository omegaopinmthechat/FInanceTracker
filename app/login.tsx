import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from '@/theme/colors';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setErrorMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } else {
      setErrorMessage("");
      router.replace("/home");
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue managing your finances.</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1, paddingRight: 40 }]}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
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
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: "left",
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
    marginBottom: 14,
    fontSize: 13,
    fontFamily: fonts.body,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
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
    textAlign: "center",
    paddingVertical: 14,
    letterSpacing: 0.4,
    fontFamily: fonts.heading,
  },
  link: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 13,
    fontWeight: "500",
    fontFamily: fonts.body,
    textAlign: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
});