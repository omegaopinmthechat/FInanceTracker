import { Link, usePathname, type Href } from "expo-router";
import { BlurView } from "expo-blur";
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radii, spacing } from "@/theme/colors";

type TabConfig = {
  key: string;
  label: string;
  href: Href;
  renderIcon: (color: string, size: number) => ReactNode;
};

const tabs: TabConfig[] = [
  {
    key: "home",
    label: "Home",
    href: "/home",
    renderIcon: (color, size) => <FontAwesome5 name="home" size={size} color={color} />,
  },
  {
    key: "income",
    label: "Income",
    href: "/income",
    renderIcon: (color, size) => <MaterialIcons name="trending-up" size={size + 1} color={color} />,
  },
  {
    key: "expense",
    label: "Expense",
    href: "/expense",
    renderIcon: (color, size) => (
      <MaterialCommunityIcons name="arrow-bottom-left" size={size + 2} color={color} />
    ),
  },
  {
    key: "feedback",
    label: "Feedback",
    href: "/feedback",
    renderIcon: (color, size) => (
      <MaterialCommunityIcons name="message-outline" size={size + 1} color={color} />
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, spacing.sm) + spacing.sm;
  const blurIntensity = Platform.select({ ios: 90, android: 72, default: 84 }) ?? 84;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
      <BlurView
        intensity={blurIntensity}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={styles.glass}
      >
        <View style={styles.glassTint} pointerEvents="none" />
        <View style={styles.glassSpecular} pointerEvents="none" />
        <View style={styles.glassRim} pointerEvents="none" />
        <View style={styles.glassDepth} pointerEvents="none" />

        <View style={styles.navbar}>
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/home" && pathname.startsWith(`${tab.href}/`));

            return (
              <Link href={tab.href} asChild key={tab.key}>
                <TouchableOpacity style={styles.tab} activeOpacity={0.78}>
                  {isActive && (
                    <View style={styles.activeLens}>
                      <View style={styles.activeLensShine} />
                    </View>
                  )}
                  <View style={[styles.iconCircle, isActive && styles.activeIconCircle]}>
                    {tab.renderIcon(isActive ? colors.textPrimary : colors.textSecondary, 19)}
                  </View>
                  <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
  },
  glass: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.49)",
    backgroundColor: "rgba(246, 248, 250, 0.10)",
    shadowColor: "#111111",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 16,
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.09)",
  },
  glassSpecular: {
    position: "absolute",
    top: -8,
    left: 22,
    right: 22,
    height: 26,
    borderRadius: radii.full,
    backgroundColor: "rgba(255, 255, 255, 0.32)",
  },
  glassRim: {
    position: "absolute",
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
  },
  glassDepth: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: "rgba(17, 17, 17, 0.08)",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 74,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 7,
  },
  activeLens: {
    position: "absolute",
    top: 7,
    width: 54,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.48)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.78)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  activeLensShine: {
    position: "absolute",
    top: 2,
    left: 7,
    right: 7,
    height: 10,
    borderRadius: radii.full,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderColor: "rgba(255, 255, 255, 0.36)",
    borderWidth: 1,
    marginBottom: 2,
  },
  activeIconCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.56)",
    borderColor: "rgba(255, 255, 255, 0.82)",
    transform: [{ scale: 1.04 }, { translateY: -0.5 }],
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "500",
    fontFamily: fonts.body,
  },
  activeLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontFamily: fonts.heading,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: "rgba(17, 17, 17, 0.42)",
  },
});
