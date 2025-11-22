import { ASPEN_TABLE_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { AspenData } from "@/types/types";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { LineChart } from "react-native-chart-kit";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
const screenWidth = Dimensions.get("window").width;
const frequency = ["day", "month", "year"];
type Frequency = (typeof frequency)[number];

export function AspenOverview() {
  const { signOut, user } = useAuth();
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<Frequency>("day");

  const fetchData = async (mode: Frequency) => {
    // Fetch data based on mode
    const now = new Date();
  
    let startDate;
    switch (mode) {
      case "day":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 12);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        break;
    }
    const dataResponse = await databases.listDocuments(
      DATABASE_ID,ASPEN_TABLE_ID,[
        Query.greaterThanEqual("date",startDate!.toISOString()),
        Query.lessThanEqual("date",now.toISOString()),
      ]
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signOutContainer}>
        <Text></Text>
        <Button
          onPress={signOut}
          icon={"logout"}
          theme={{
            colors: {
              text: "#304a8fff",
              primary: "#26355D",
              outline: "#C7CAD0",
            },
          }}
        >
          Sign Out
        </Button>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View>
          <Text>Aspen Reading Chart</Text>
          <LineChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
                {
                  data: [20, 45, 28, 80, 99, 43, 50],
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                  strokeWidth: 2, // optional
                },
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            // yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {},
  signOutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
});
