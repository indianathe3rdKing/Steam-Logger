import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function ExportPage() {
  return (
    <View style={styles.container}>
      <Button>Export Sheet</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
