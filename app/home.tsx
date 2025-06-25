import { supabase } from "@/utils/supabase";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const monthOrder = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const monthAbbr = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Home = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [expenseChartData, setExpenseChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [incomeChartData, setIncomeChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const [{ data: expense, error: expenseError }, { data: income, error: incomeError }] = await Promise.all([
        supabase.from("Expense").select("*").eq("user_id", user?.id),
        supabase.from("Income").select("*").eq("user_id", user?.id),
      ]);

      if (expenseError) throw new Error(expenseError.message);
      if (incomeError) throw new Error(incomeError.message);

      const validExpense = expense?.filter((item) => item.expense != null && !isNaN(item.expense)) || [];
      const validIncome = income?.filter((item) => item.income != null && !isNaN(item.income)) || [];

      setExpenseData(validExpense);
      setIncomeData(validIncome);

      const years = Array.from(
        new Set([
          ...validExpense.map((item) => item.year),
          ...validIncome.map((item) => item.year),
        ])
      ).sort();

      setAvailableYears(years);
      if (!selectedYear || !years.includes(selectedYear)) {
        setSelectedYear(years.includes(currentYear) ? currentYear : years[0] ?? null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setExpenseData([]);
      setIncomeData([]);
      setExpenseChartData({ labels: [], datasets: [{ data: [] }] });
      setIncomeChartData({ labels: [], datasets: [{ data: [] }] });
      setLoading(false);
    }
  };

  const updateChartData = () => {
    if (!selectedYear) return;

    const expenseForYear = expenseData.filter((item) => item.year === selectedYear);
    const expenseByMonth: { [month: string]: number } = {};
    expenseForYear.forEach((item) => {
      const month = item.month.toLowerCase();
      expenseByMonth[month] = (expenseByMonth[month] || 0) + Number(item.expense);
    });
    const expenseLabels = monthOrder
      .filter((m) => expenseByMonth[m] !== undefined)
      .map((m, i) => monthAbbr[i]);
    const expenseValues = monthOrder
      .filter((m) => expenseByMonth[m] !== undefined)
      .map((m) => expenseByMonth[m]);
    setExpenseChartData({
      labels: expenseLabels,
      datasets: [{ data: expenseValues }],
    });

    const incomeForYear = incomeData.filter((item) => item.year === selectedYear);
    const incomeByMonth: { [month: string]: number } = {};
    incomeForYear.forEach((item) => {
      const month = item.month.toLowerCase();
      incomeByMonth[month] = (incomeByMonth[month] || 0) + Number(item.income);
    });
    const incomeLabels = monthOrder
      .filter((m) => incomeByMonth[m] !== undefined)
      .map((m, i) => monthAbbr[i]);
    const incomeValues = monthOrder
      .filter((m) => incomeByMonth[m] !== undefined)
      .map((m) => incomeByMonth[m]);
    setIncomeChartData({
      labels: incomeLabels,
      datasets: [{ data: incomeValues }],
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateChartData();
  }, [selectedYear, expenseData, incomeData]);

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
      <Text style={styles.title}>Monthly Expense</Text>
      <View style={styles.pickerContainer}>
        <Text style={{ fontWeight: "bold", marginRight: 10 }}>
          Select Year:
        </Text>
        <Picker
          selectedValue={selectedYear}
          style={{ height: 50, width: 160 }}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {availableYears.map((year) => (
            <Picker.Item key={year} label={`${year}`} value={year} />
          ))}
        </Picker>
      </View>
      {expenseChartData.labels.length > 1 ? (
        <LineChart
          data={expenseChartData}
          width={Dimensions.get("window").width - 20}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: "#800080",
            backgroundGradientFrom: "#800080",
            backgroundGradientTo: "#4B0082",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      ) : (
        <Text style={{ color: "gray", padding: 20 }}>
          Not enough expense data to display chart.
        </Text>
      )}

      <Text style={styles.title}>Monthly Income</Text>
      {incomeChartData.labels.length > 1 ? (
        <LineChart
          data={incomeChartData}
          width={Dimensions.get("window").width - 20}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: "#27ae60",
            backgroundGradientFrom: "#27ae60",
            backgroundGradientTo: "#145a32",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      ) : (
        <Text style={{ color: "gray", padding: 20 }}>
          Not enough income data to display chart.
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default Home;
