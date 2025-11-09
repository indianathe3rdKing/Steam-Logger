import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function aspenScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <Text variant="headlineSmall">Aspen Screen</Text>
        <View>
          <TextInput label={"Meter 1"} mode="outlined" style={styles.input} />
          <TextInput label={"Meter 2"} mode="outlined" style={styles.input} />
          <TextInput
            label={"Condensate"}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={"Meter Blue"}
            mode="outlined"
            style={styles.input}
          />
          <TextInput label={"Meter Red"} mode="outlined" style={styles.input} />
          <TextInput
            label={"Steam Flow Meter"}
            mode="outlined"
            style={styles.input}
          />
          <TextInput label={"Aspen"} mode="outlined" style={styles.input} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  input: {},
});
