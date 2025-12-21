import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
export default function ExportPage() {
  const freseniusUrl =
    "https://fra.cloud.appwrite.io/v1/storage/buckets/69439f20003aac2fe7b9/files/69470673001a6e940b07/view?project=6902702b00168de30b77&mode=adminx";

  const aspenUrl =
    "https://fra.cloud.appwrite.io/v1/storage/buckets/69439f20003aac2fe7b9/files/6947066000343d0465b6/view?project=6902702b00168de30b77&mode=admin";

  async function handlePressAspen() {
    const supportUrl = await Linking.canOpenURL(freseniusUrl);
    if (supportUrl) {
      await Linking.openURL(freseniusUrl);
    }
  }
  async function handlePressFresenius() {
    const supportUrl = await Linking.canOpenURL(freseniusUrl);
    if (supportUrl) {
      await Linking.openURL(freseniusUrl);
    }
  }
  return (
    <View style={styles.container}>
      <Button onPress={handlePressAspen}>Export Sheet(Aspen)</Button>

      <Button onPress={handlePressFresenius}>Export Sheet(Fresenius)</Button>
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
