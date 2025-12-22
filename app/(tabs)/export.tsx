import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
export default function ExportPage() {
  const freseniusUrl =
    "https://fra.cloud.appwrite.io/v1/storage/buckets/69439f20003aac2fe7b9/files/6948fc62003d3f13bbd7/view?project=6902702b00168de30b77&mode=admin";

  const aspenUrl =
    "https://fra.cloud.appwrite.io/v1/storage/buckets/69439f20003aac2fe7b9/files/6948fc56000c92df1a54/view?project=6902702b00168de30b77&mode=admin";
  async function handlePressAspen() {
    const supportUrl = await Linking.canOpenURL(aspenUrl);
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
      <Button
        style={styles.button}
        icon="file-export"
        onPress={handlePressAspen}
        theme={{
          colors: {
            primary: "#304a8fff",
          },
        }}
      >
        Export Sheet(Aspen)
      </Button>

      <Button
        style={styles.button}
        icon="file-export"
        onPress={handlePressFresenius}
        theme={{
          colors: {
            primary: "#304a8fff",
          },
        }}
      >
        Export Sheet(Fresenius)
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 10,
    fontSize: 30,
  },
});
