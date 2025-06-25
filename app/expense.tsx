import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());

const screenWidth = Dimensions.get("window").width;

export default function Expense() {
  const now = new Date();
  const currentMonth = months[now.getMonth()].toLowerCase();
  const currentYear = now.getFullYear().toString();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [expense, setExpense] = useState("");
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    if (!year || !month || !expense) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      await supabase.from("Expense").insert([
        {
          year: parseInt(year),
          month: month.trim().toLowerCase(),
          expense: parseInt(expense),
          user_id: user?.id,
        },
      ]);
      fetchExpense();

      if (error) throw error;

      console.log("Success");

      setYear(currentYear);
      setMonth(currentMonth);
      setExpense("");
    } catch (error) {
      alert("Failed to add expense.");
      console.log("Supabase insert error", error);
    }
  };

  const fetchExpense = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("Expense")
      .select("*")
      .eq("user_id", user?.id);

    if (error) console.log("Error fetching data");
    setExpenseData(data || []);

    setLoading(false);
  };
  useEffect(() => {
    fetchExpense();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await supabase.from("Expense").delete().eq("id", id);
      fetchExpense();
    } catch (err) {
      alert("Failed to delete expense.");
      console.log("Supabase delete error", err);
    }
  };

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Year:</Text>
          <View style={{ backgroundColor: "#ededed", borderRadius: 8 }}>
            <Picker
              selectedValue={year}
              onValueChange={(itemValue) => setYear(itemValue)}
              style={{ color: "#333" }}
            >
              <Picker.Item label="Select Year" value="" />
              {years.map((y) => (
                <Picker.Item key={y} label={y} value={y} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Month:</Text>
          <View style={{ backgroundColor: "#ededed", borderRadius: 8 }}>
            <Picker
              selectedValue={month}
              onValueChange={(itemValue) => setMonth(itemValue)}
              style={{ color: "#333" }}
            >
              <Picker.Item label="Select Month" value="" />
              {months.map((m) => (
                <Picker.Item key={m} label={m} value={m.toLowerCase()} />
              ))}
            </Picker>
          </View>
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

        <Text style={styles.sectionTitle}>Past Expense:</Text>
        <ScrollView horizontal>
          <View style={{ minWidth: screenWidth - 32 }}>
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
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={{ padding: 4, marginLeft: 8 }}
                  >
                    <Feather name="trash-2" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 16 }}
              style={{ minWidth: screenWidth - 32 }}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 24,
    paddingBottom: 32,
  },
  inputGroup: { marginBottom: 20, width: "100%" },
  label: { fontSize: 18, fontWeight: "500", marginBottom: 6 },
  input: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    width: "100%",
    minWidth: 0,
  },
  button: {
    backgroundColor: "#9b59b6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 8,
    alignSelf: "flex-start",
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
  cellExpense: {
    flex: 1,
    minWidth: 70,
    fontSize: 16,
    textAlign: "center",
    color: "#FF0000",
    fontWeight: "bold",
  },
});
