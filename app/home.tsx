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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const fetchExpense = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("Expense")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw new Error(error.message);

      const validData =
        data?.filter((item) => item.expense != null && !isNaN(item.expense)) ||
        [];

      setExpenseData(validData);

      const years = Array.from(
        new Set(validData.map((item) => item.year))
      ).sort();

      setAvailableYears(years);
      setSelectedYear(years[0] ?? null);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setExpenseData([]);
      setChartData({ labels: [], datasets: [{ data: [] }] });
      setLoading(false);
    }
  };

  const updateChartData = () => {
    if (!selectedYear) return;

    const dataForYear = expenseData
      .filter((item) => item.year === selectedYear)
      .sort(
        (a, b) =>
          monthOrder.indexOf(a.month.toLowerCase()) -
          monthOrder.indexOf(b.month.toLowerCase())
      );

    const labels = dataForYear.map(
      (item) => item.month.charAt(0).toUpperCase() + item.month.slice(1)
    );
    const values = dataForYear.map((item) => Number(item.expense));

    setChartData({
      labels,
      datasets: [{ data: values }],
    });
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  useEffect(() => {
    updateChartData();
  }, [selectedYear, expenseData]);

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

      {/* Year Picker */}
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
      {chartData.labels.length > 1 ? (
        <LineChart
          data={chartData}
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
          Not enough data to display chart.
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
