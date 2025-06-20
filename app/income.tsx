import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { ActivityIndicator } from "react-native-paper";

export default function Income() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [income, setIncome] = useState("");
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    if (!year || !month || !income) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data, error } = await supabase.from("Income").insert([
        {
          year: parseInt(year),
          month: month.trim().toLowerCase(),
          income: parseInt(income),
        },
      ]);
      fetchIncome();

      if (error) throw error;

      console.log("Success");
      setYear("");
      setMonth("");
      setIncome("");
    } catch (err) {
      alert("Failed to add income.");
      console.log("Supabase insert error", err);
    }
  };

  const fetchIncome = async () => {
    const { data, error } = await supabase.from("Income").select("*");

    if (error) {
      console.error("Error fetching income:", error);
    } else {
      setIncomeData(data || []);
    }

    setLoading(false);
  };

  //Loading
  useEffect(() => {
    fetchIncome();
  }, []);
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
        <Text style={styles.label}>Income:</Text>
        <TextInput
          style={styles.input}
          value={income}
          onChangeText={setIncome}
          placeholder="Ex: 2500"
          placeholderTextColor="#b0b0b0"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Income</Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 32,
          marginBottom: 8,
        }}
      >
        Past Income:
      </Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Year</Text>
        <Text style={styles.headerCell}>Month</Text>
        <Text style={styles.headerCell}>Income</Text>
      </View>
      <FlatList
        data={incomeData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.year}</Text>
            <Text style={styles.cell}>{item.month}</Text>
            <Text style={styles.cellIncome}>{item.income}</Text>
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
  item: {
    backgroundColor: "#f3e5f5",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
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
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    minHeight: 36,
  },
  cell: {
    flex: 1,
    minWidth: 70,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  cellIncome: {
    flex: 1,
    minWidth: 70,
    fontSize: 16,
    textAlign: "center",
    color: "#8ec322",
    fontWeight: "bold",
  },
});
