import { usePathname, Link } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import { colors, shadows, spacing, radii } from '@/theme/colors';

const tabs = [
  {
    label: "Home",
    icon: <FontAwesome5 name="home" size={22} color="#fff" />,
    href: "/home",
    key: "home",
  },
  {
    label: "Income",
    icon: <MaterialIcons name="trending-up" size={24} color="#fff" />,
    href: "/income",
    key: "income",
  },
  {
    label: "Expense",
    icon: <MaterialCommunityIcons name="arrow-bottom-left" size={26} color="#fff" />,
    href: "/expense",
    key: "expense",
  },
  {
    label: "Feedback",
    icon: <MaterialCommunityIcons name="message-outline" size={24} color="#fff" />,
    href: "/feedback",
    key: "feedback",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <BlurView intensity={80} tint="dark" style={styles.blur}>
      <View style={styles.navbar}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link href={tab.href} asChild key={tab.key}>
              <TouchableOpacity 
                style={styles.tab} // removed styles.activeTab
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, isActive && styles.activeIconCircle]}>
                  {tab.icon}
                </View>
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.medium, // fixed from shadows.md to shadows.medium
  },
  gradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.card, // changed from colors.navbarBackground to colors.card
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    // removed activeTab style, not needed
  },
  iconCircle: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 4,
  },
  activeIconCircle: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -spacing.xs,
    width: 16,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
});

