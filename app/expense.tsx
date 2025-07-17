import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Modal } from "react-native";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows } from '@/theme/colors';

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
const contentMaxWidth = 420;

export default function Expense() {
  const [selectedReason, setSelectedReason] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const now = new Date();
  const currentMonth = months[now.getMonth()].toLowerCase();
  const currentYear = now.getFullYear().toString();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [expense, setExpense] = useState("");
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!year || !month || !expense || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    //Input data in the database
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
          reason: reason
        },
      ]);
      fetchExpense();

      if (error) throw error;

      console.log("Success");

      setYear(currentYear);
      setMonth(currentMonth);
      setExpense("");
      setReason("");
    } catch (error) {
      alert("Failed to add expense.");
      console.log("Supabase insert error", error);
    }
  };

  //Fetching data from the database
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
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={year}
                onValueChange={(itemValue) => setYear(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Select Year" value="" />
                {years.map((y) => (
                  <Picker.Item key={y} label={y} value={y} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Month</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={month}
                onValueChange={(itemValue) => setMonth(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Select Month" value="" />
                {months.map((m) => (
                  <Picker.Item key={m} label={m} value={m.toLowerCase()} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expense</Text>
            <TextInput
              style={styles.input}
              value={expense}
              onChangeText={setExpense}
              placeholder="Ex: 2500"
              placeholderTextColor="#b0b0b0"
              keyboardType="numeric"
            />
            <Text style={styles.label2}>Reason</Text>
            <TextInput
              style={styles.input}
              value={reason}
              onChangeText={setReason}
              placeholder="Ex: Groceries"
              placeholderTextColor="#b0b0b0"
            />
          </View>
          <LinearGradient
            colors={[colors.headerGradient[0], colors.headerGradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <TouchableOpacity style={{ width: "100%" }} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add Expense</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <Text style={styles.sectionTitle}>Past Expense</Text>
        <View style={styles.tableCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View
              style={{ minWidth: screenWidth - 32, width: screenWidth * 1.2 }}
            >
              <View style={styles.tableHeader}>
                <View style={{ flex: 0.7, alignItems: "flex-start" }}>
                  <Text style={styles.headerCell}>Year</Text>
                </View>
                <View style={{ flex: 0.8, alignItems: "flex-start" }}>
                  <Text style={styles.headerCell}>Month</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                  <Text style={styles.headerCell}>Expense</Text>
                </View>
                <View style={{ flex: 1.5, alignItems: "flex-start" }}>
                  <Text style={styles.headerCell}>Reason</Text>
                </View>
                <View style={{ width: 40 }} />
              </View>
              <FlatList
                data={expenseData}
                keyExtractor={(item, index) =>
                  item.id?.toString() || index.toString()
                }
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <View
                      style={{
                        flex: 0.7,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={styles.cell}>{item.year}</Text>
                    </View>
                    <View
                      style={{
                        flex: 0.8,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={styles.cell}>{item.month}</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={styles.cellExpense}>{item.expense}</Text>
                    </View>
                    <View
                      style={{
                        flex: 1.5,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (item.reason && item.reason.length > 7) {
                            setSelectedReason(item.reason);
                            setModalVisible(true);
                          }
                        }}
                        style={{ width: "100%" }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            textAlign: "left",
                            color: "#ffffff",
                            paddingLeft: 10,
                          }}
                        >
                          {item.reason && item.reason.length > 7
                            ? item.reason.substring(0, 7) + "..."
                            : item.reason}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: 40, alignItems: "center" }}>
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Feather name="trash-2" size={20} color="#e74c3c" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 16 }}
                style={{ width: "100%" }}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal for displaying full reason */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reason</Text>
            <Text style={styles.modalText}>{selectedReason}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 0 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
    width: "100%",
  },
  label2: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 5,
    color: colors.textPrimary,
  },
  inputGroup: { marginBottom: 18, width: "100%" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: colors.textPrimary },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerWrapper: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    width: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  picker: {
    width: "100%",
    color: colors.textPrimary,
    backgroundColor: "transparent",
  },
  pickerItem: {
    fontSize: 16,
    color: colors.textPrimary,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
    color: colors.textPrimary,
  },
  tableCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
    marginBottom: 24,
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceHighlight, // changed from "#f3e5f5"
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 6,
    width: '100%',
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
    paddingLeft: 10,
    color: colors.textPrimary, // ensure header text is visible
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.surfaceHighlight,
    minHeight: 36,
    width: '100%',
  },
  cell: {
    fontSize: 16,
    textAlign: "left",
    color: colors.textPrimary, // changed from "#333"
    paddingLeft: 10,
  },
  cellExpense: {
    fontSize: 16,
    textAlign: "left",
    color: "#FF0000",
    fontWeight: "bold",
    paddingLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#9b59b6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

