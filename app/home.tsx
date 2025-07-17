import { supabase } from "@/utils/supabase";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, shadows } from '@/theme/colors';

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

    // Expense: always show all months, fill missing with 0
    const expenseForYear = expenseData.filter((item) => item.year === selectedYear);
    const expenseByMonth: { [month: string]: number } = {};
    expenseForYear.forEach((item) => {
      const month = item.month.toLowerCase();
      expenseByMonth[month] = (expenseByMonth[month] || 0) + Number(item.expense);
    });
    const expenseLabels = monthAbbr;
    const expenseValues = monthOrder.map((m) => expenseByMonth[m] || 0);
    setExpenseChartData({
      labels: expenseLabels,
      datasets: [{ data: expenseValues }],
    });

    // Income: always show all months, fill missing with 0
    const incomeForYear = incomeData.filter((item) => item.year === selectedYear);
    const incomeByMonth: { [month: string]: number } = {};
    incomeForYear.forEach((item) => {
      const month = item.month.toLowerCase();
      incomeByMonth[month] = (incomeByMonth[month] || 0) + Number(item.income);
    });
    const incomeLabels = monthAbbr;
    const incomeValues = monthOrder.map((m) => incomeByMonth[m] || 0);
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

  const chartBoxWidth = Math.min(Dimensions.get("window").width - 20, 420);
  const chartContentWidth = Math.max(chartBoxWidth, 900);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Monthly Overview</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Year:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              dropdownIconColor={colors.text}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              {availableYears.map((year) => (
                <Picker.Item 
                  key={year} 
                  label={`${year}`} 
                  value={year}
                  color="#000" 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expenses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={expenseChartData}
              width={chartContentWidth}
              height={220}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: colors.chartBackground,
                backgroundGradientFrom: colors.chartBackground,
                backgroundGradientTo: colors.chartBackground,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(248, 113, 113, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: colors.error
                },
                propsForBackgroundLines: {
                  stroke: colors.chartGrid,
                  strokeWidth: 1
                },
              }}
              bezier
              style={styles.chart}
            />
          </ScrollView>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Income</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={incomeChartData}
              width={chartContentWidth}
              height={220}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: colors.chartBackground,
                backgroundGradientFrom: colors.chartBackground,
                backgroundGradientTo: colors.chartBackground,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: colors.success
                },
                propsForBackgroundLines: {
                  stroke: colors.chartGrid,
                  strokeWidth: 1
                },
              }}
              bezier
              style={styles.chart}
            />
          </ScrollView>
        </View>

        {/* --- New Visualizations Section --- */}
        <View style={styles.visualSection}>
          <Text style={styles.visualTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderColor: colors.error }]}>
              <Text style={styles.summaryLabel}>Total Expense</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                ₹{expenseData.filter(e => e.year === selectedYear).reduce((sum, e) => sum + Number(e.expense), 0)}
              </Text>
            </View>
            <View style={[styles.summaryCard, { borderColor: colors.success }]}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                ₹{incomeData.filter(i => i.year === selectedYear).reduce((sum, i) => sum + Number(i.income), 0)}
              </Text>
            </View>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.summaryLabel}>Net Balance</Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color:
                    (incomeData.filter(i => i.year === selectedYear).reduce((sum, i) => sum + Number(i.income), 0) -
                      expenseData.filter(e => e.year === selectedYear).reduce((sum, e) => sum + Number(e.expense), 0)) >= 0
                      ? colors.success
                      : colors.error,
                },
              ]}
            >
              ₹
              {incomeData.filter(i => i.year === selectedYear).reduce((sum, i) => sum + Number(i.income), 0) -
                expenseData.filter(e => e.year === selectedYear).reduce((sum, e) => sum + Number(e.expense), 0)}
            </Text>
          </View>

          {/* --- Pie Chart Visualization --- */}
          <View style={styles.pieChartContainer}>
            <Text style={styles.visualTitle}>Income vs Expense</Text>
            <PieChart
              data={[
                {
                  name: "Expense",
                  amount: expenseData.filter(e => e.year === selectedYear).reduce((sum, e) => sum + Number(e.expense), 0),
                  color: colors.error,
                  legendFontColor: colors.textPrimary,
                  legendFontSize: 14,
                },
                {
                  name: "Income",
                  amount: incomeData.filter(i => i.year === selectedYear).reduce((sum, i) => sum + Number(i.income), 0),
                  color: colors.success,
                  legendFontColor: colors.textPrimary,
                  legendFontSize: 14,
                },
              ]}
              width={Dimensions.get("window").width - 48}
              height={180}
              chartConfig={{
                color: () => colors.textPrimary,
                labelColor: () => colors.textPrimary,
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
              hasLegend={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scrollContent: {
    padding: 16,
  },
  title: { 
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  pickerWrapper: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.inputBackground,
  },
  picker: {
    color: colors.textPrimary,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  visualSection: {
    marginTop: 8,
    marginBottom: 32,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  visualTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 2,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  balanceCard: {
    marginTop: 4,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pieChartContainer: {
    marginTop: 18,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
});

export default Home;
