import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Expense() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    if (!year || !month || !expense) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data, error } = await supabase.from("Expense").insert([
        {
          year: parseInt(year),
          month: month.trim().toLowerCase(),
          expense: parseInt(expense),
        },
      ]);
      fetchExpense();

      if (error) throw error;

      console.log("Success");

      setYear("");
      setMonth("");
      setExpense("");
    } catch (error) {
      alert("Failed to add expense.");
      console.log("Supabase insert error", error);
    }
  };

  const fetchExpense = async () => {
    const { data, error } = await supabase.from("Expense").select("*");

    if (error) console.log("Error fetching data");
    setExpenseData(data || []);

    setLoading(false);
  };
  useEffect(() => {
    fetchExpense();
  }, []);

  //Loading
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#9b59b6" />
      </SafeAreaView>
    );
  }

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

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 32,
          marginBottom: 8,
        }}
      >
        Past Expense:
      </Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Year</Text>
        <Text style={styles.headerCell}>Month</Text>
        <Text style={styles.headerCell}>Expense</Text>
      </View>
      <FlatList
        data={expenseData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.year}</Text>
            <Text style={styles.cell}>{item.month}</Text>
            <Text style={styles.cellExpense}>{item.expense}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}

//Styles
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
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    minHeight: 36,
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
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e5f5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 6,
  },
  headerCell: {
    flex: 1,
    minWidth: 70,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    minWidth: 70,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  cellExpense: {
    flex: 1,
    minWidth: 70,
    fontSize: 16,
    textAlign: "center",
    color: "#FF0000",
    fontWeight: "bold",
  },
});
