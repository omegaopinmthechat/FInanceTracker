import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }
    alert("Thank you for your feedback!");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.label}>Subject:</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Ex: App Feedback"
          placeholderTextColor="#b0b0b0"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Message:</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Feedback</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
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
});