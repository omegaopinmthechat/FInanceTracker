import { SafeAreaView } from "react-native-safe-area-context";
import { Text,TouchableOpacity ,StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";

export default function Expense() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [expense, setExpense] = useState("");

  const handleSubmit = () => {
    // Handle submit logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Year:</Text>
        <TextInput
          style={styles.input}
          value={year}
          onChangeText={setYear}
          placeholder="Ex: 2024"
          placeholderTextColor="#b0b0b0"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Month:</Text>
        <TextInput
          style={styles.input}
          value={month}
          onChangeText={setMonth}
          placeholder="Ex: June"
          placeholderTextColor="#b0b0b0"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expense:</Text>
        <TextInput
          style={styles.input}
          value={expense}
          onChangeText={setExpense}
          placeholder="Ex: 2500"
          placeholderTextColor="#b0b0b0"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add Expense</Text>
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