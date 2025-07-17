import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
  Modal,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { supabase } from "@/utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows } from '@/theme/colors';

const { width } = Dimensions.get("window");

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = async () => {
    if (!email || !subject || !message) {
      Alert.alert("Please fill in all fields.");
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
      Alert.alert("Failed to add your feedback. Please try after sometime.");
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="App Feedback"
              placeholderTextColor="#b0b0b0"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here..."
              placeholderTextColor="#b0b0b0"
              multiline
              numberOfLines={4}
            />
          </View>
          <LinearGradient
            colors={[colors.headerGradient[0], colors.headerGradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <TouchableOpacity style={{ width: "100%" }} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send Feedback</Text>
            </TouchableOpacity>
          </LinearGradient>
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
    paddingTop: -400, 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start", // Align content to the top
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 24,
    alignSelf: "center",
    letterSpacing: 1.2,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: colors.textPrimary },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    backgroundColor: colors.card,
    borderRadius: 18,
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
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

