import { usePathname, Link } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

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
    <View style={styles.navbar}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link href={tab.href} asChild key={tab.key}>
            <TouchableOpacity style={styles.tab}>
              {tab.icon}
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeBar} />}
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 95,
    backgroundColor: "#9b59b6",
    width: "100%",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginTop: 2,
    fontWeight: "600",
  },
  activeLabel: {
    fontWeight: "bold",
    color: "#fff",
  },
  activeBar: {
    marginTop: 2,
    height: 4,
    width: 36,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
});
