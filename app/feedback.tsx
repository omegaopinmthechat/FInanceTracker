import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { supabase } from "@/utils/supabase";
import { colors, fonts } from '@/theme/colors';

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!email || !subject || !message) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    try {
      const { error } = await supabase.from("feedback").insert([
        {
          mail: email,
          subject,
          message,
        },
      ]);
      if (error) throw error;
      setEmail("");
      setSubject("");
      setMessage("");
      setErrorMessage("");
      setShowSuccess(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }).start(() => setShowSuccess(false));
        }, 1800);
      });
    } catch (error) {
      setErrorMessage("Failed to add your feedback. Please try after sometime.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Send Feedback</Text>
          <Text style={styles.subtitle}>Tell us what works and what we can improve.</Text>
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
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={(value) => {
                setSubject(value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="App Feedback"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={(value) => {
                setMessage(value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Type your message here..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Send Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showSuccess && (
        <Modal transparent animationType="none" visible>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.successBox, { opacity: fadeAnim }]}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successText}>Thank you for your feedback!</Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingBottom: 110,
  },
  card: {
    width: "100%",
    maxWidth: 420,
  },
  title: {
    fontSize: 30,
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
    marginBottom: 18,
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
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.body,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  successEmoji: {
    fontSize: 44,
    marginBottom: 10,
  },
  successText: {
    color: colors.primaryLight,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.5,
    fontFamily: fonts.heading,
  },
});

