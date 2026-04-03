import { supabase } from "@/utils/supabase";
import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from '@/theme/colors';
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

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

  const fetchData = useCallback(async () => {
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
      setSelectedYear((prev) => {
        if (!prev || !years.includes(prev)) {
          return years.includes(currentYear) ? currentYear : years[0] ?? null;
        }
        return prev;
      });
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setExpenseData([]);
      setIncomeData([]);
      setExpenseChartData({ labels: [], datasets: [{ data: [] }] });
      setIncomeChartData({ labels: [], datasets: [{ data: [] }] });
      setLoading(false);
    }
  }, [currentYear]);

  const updateChartData = useCallback(() => {
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
  }, [expenseData, incomeData, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DashboardSkeleton />
        </ScrollView>
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
        <Text style={styles.subtitle}>A concise view of cash in, cash out, and balance health.</Text>
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
                  color={colors.textPrimary}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.visualSection}>
          <Text style={styles.visualTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Expense</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                ₹
                {expenseData
                  .filter((e) => e.year === selectedYear)
                  .reduce((sum, e) => sum + Number(e.expense), 0)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                ₹
                {incomeData
                  .filter((i) => i.year === selectedYear)
                  .reduce((sum, i) => sum + Number(i.income), 0)}
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
                    incomeData
                      .filter((i) => i.year === selectedYear)
                      .reduce((sum, i) => sum + Number(i.income), 0) -
                      expenseData
                        .filter((e) => e.year === selectedYear)
                        .reduce((sum, e) => sum + Number(e.expense), 0) >=
                    0
                      ? colors.success
                      : colors.error,
                },
              ]}
            >
              ₹
              {incomeData
                .filter((i) => i.year === selectedYear)
                .reduce((sum, i) => sum + Number(i.income), 0) -
                expenseData
                  .filter((e) => e.year === selectedYear)
                  .reduce((sum, e) => sum + Number(e.expense), 0)}
            </Text>
          </View>

          {/* --- Pie Chart Visualization --- */}
          <View style={styles.pieChartContainer}>
            <Text style={styles.visualTitle}>Income vs Expense</Text>
            <PieChart
              data={[
                {
                  name: "Expense",
                  amount: expenseData
                    .filter((e) => e.year === selectedYear)
                    .reduce((sum, e) => sum + Number(e.expense), 0),
                  color: colors.error,
                  legendFontColor: colors.textPrimary,
                  legendFontSize: 14,
                },
                {
                  name: "Income",
                  amount: incomeData
                    .filter((i) => i.year === selectedYear)
                    .reduce((sum, i) => sum + Number(i.income), 0),
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
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
              hasLegend={true}
            />
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
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(17, 17, 17, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: colors.error,
                },
                propsForBackgroundLines: {
                  stroke: colors.chartGrid,
                  strokeWidth: 1,
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
                color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(17, 17, 17, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: colors.success,
                },
                propsForBackgroundLines: {
                  stroke: colors.chartGrid,
                  strokeWidth: 1,
                },
              }}
              bezier
              style={styles.chart}
            />
          </ScrollView>
        </View>

        {/* --- New Visualizations Section --- */}
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
    paddingBottom: 110,
  },
  title: { 
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.2,
    fontFamily: fonts.display,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    fontFamily: fonts.body,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 4,
  },
  pickerLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    fontFamily: fonts.heading,
  },
  pickerWrapper: {
    flex: 1,
    borderRadius: 12,
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
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    fontFamily: fonts.heading,
  },
  chart: {
    borderRadius: 16,
  },
  visualSection: {
    marginTop: 4,
    marginBottom: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  visualTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.3,
    fontFamily: fonts.heading,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 2,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "600",
    fontFamily: fonts.heading,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
    fontFamily: fonts.display,
  },
  balanceCard: {
    marginTop: 4,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  pieChartContainer: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 8,
  },
});

export default Home;
