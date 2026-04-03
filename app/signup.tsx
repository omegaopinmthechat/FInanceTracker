import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "@/theme/colors";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMessage(error.message || "Could not sign up right now. Please try again.");
    } else {
      setSuccessMessage("Check your email for a confirmation link, then sign in.");
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start tracking your money in one place.</Text>
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
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1, paddingRight: 40 }]}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Feather
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
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
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
});
  
