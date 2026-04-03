import { colors, fonts } from '@/theme/colors';
import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormTableSkeleton } from "@/components/LoadingSkeleton";

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
  const currentDate = now.getDate();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [expense, setExpense] = useState("");
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // keep date as a string so clearing the TextInput shows blank instead of NaN
  const [date, setDate] = useState<string>(currentDate.toString());

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!year || !month || !expense || !reason || date === "") {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const parsedDate = parseInt(date, 10);
    if (isNaN(parsedDate) || parsedDate < 1 || parsedDate > 31) {
      setErrorMessage("Please enter a valid date between 1 and 31.");
      return;
    }

    //Input data in the database
    try {
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (getUserError) {
        console.error("Error getting user:", getUserError);
        throw getUserError;
      }

      const { data: insertData, error: insertError } = await supabase
        .from("Expense")
        .insert([
          {
            year: parseInt(year),
            month: month.trim().toLowerCase(),
            expense: parseInt(expense),
            user_id: user?.id,
            reason: reason,
            date: parsedDate,
          },
        ])
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Insert success:", insertData);
      await fetchExpense();

      setYear(currentYear);
      setMonth(currentMonth);
      setDate(currentDate.toString());
      setExpense("");
      setReason("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to add expense. See console for details.");
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
    if (error) setErrorMessage("Failed to fetch expense data.");
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
      setErrorMessage("Failed to delete expense.");
      console.log("Supabase delete error", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <FormTableSkeleton />
        </ScrollView>
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
        <Text style={styles.pageTitle}>Expense Tracker</Text>
        <Text style={styles.pageSubtitle}>Log spending with clear monthly visibility.</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={year}
                onValueChange={(itemValue) => {
                  setYear(itemValue);
                  if (errorMessage) setErrorMessage("");
                }}
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
                onValueChange={(itemValue) => {
                  setMonth(itemValue);
                  if (errorMessage) setErrorMessage("");
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Select Month" value="" />
                {months.map((m) => (
                  <Picker.Item key={m} label={m} value={m.toLowerCase()} />
                ))}
              </Picker>
            </View>
            <Text style={styles.label2}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={(text) => {
                setDate(text);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Ex: 21"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expense</Text>
            <TextInput
              style={styles.input}
              value={expense}
              onChangeText={(value) => {
                setExpense(value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Ex: 2500"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
            <Text style={styles.label2}>Reason</Text>
            <TextInput
              style={styles.input}
              value={reason}
              onChangeText={(value) => {
                setReason(value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Ex: Groceries"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
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
                  <Text style={styles.headerCell}>Date</Text>
                </View>
                <View style={{ flex: 0.8, alignItems: "flex-start" }}>
                  <Text style={styles.headerCell}>Month</Text>
                </View>
                <View style={{ flex: 0.7, alignItems: "flex-start" }}>
                  <Text style={styles.headerCell}>Year</Text>
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
                      <Text style={styles.cell}>{item.date}</Text>
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
                        flex: 0.7,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={styles.cell}>{item.year}</Text>
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
                            color: colors.textPrimary,
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
                        <Feather name="trash-2" size={20} color={colors.error} />
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
    marginBottom: 18,
    width: "100%",
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
    alignSelf: "flex-start",
    letterSpacing: 0.2,
    fontFamily: fonts.display,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 18,
    alignSelf: "flex-start",
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
  label2: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 8,
    color: colors.textPrimary,
    fontFamily: fonts.heading,
  },
  inputGroup: { marginBottom: 16, width: "100%" },
  label: {
    fontSize: 15,
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
  pickerWrapper: {
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
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
    backgroundColor: colors.primary,
    width: "100%",
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 10,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 10,
    alignSelf: "flex-start",
    color: colors.textPrimary,
    letterSpacing: 0.2,
    fontFamily: fonts.heading,
  },
  tableCard: {
    marginBottom: 24,
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    width: '100%',
  },
  headerCell: {
    fontWeight: "600",
    fontSize: 12,
    textAlign: "left",
    paddingLeft: 10,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: fonts.heading,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
    minHeight: 36,
    width: '100%',
  },
  cell: {
    fontSize: 15,
    textAlign: "left",
    color: colors.textPrimary,
    paddingLeft: 10,
    fontFamily: fonts.body,
  },
  cellExpense: {
    fontSize: 15,
    textAlign: "left",
    color: colors.error,
    fontWeight: "700",
    paddingLeft: 10,
    fontFamily: fonts.heading,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 20, 0.74)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.textPrimary,
    fontFamily: fonts.heading,
  },
  modalText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    fontFamily: fonts.body,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
    fontFamily: fonts.heading,
  },
});

