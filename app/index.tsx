import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Will be the login page.
      </Text>
    </SafeAreaView>
  );
}
