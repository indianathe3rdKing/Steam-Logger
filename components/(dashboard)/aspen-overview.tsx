import { ASPEN_TABLE_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { AspenData, readingsRecord } from "@/types/types";
import React, { useEffect, useState } from "react";
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
type Columns = Record<string, number[]>;

export function AspenOverview() {
  const { signOut, user } = useAuth();
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<Frequency>("day");
  const [readings, setReadings] = useState<AspenData[]>();
  const [newColumns, setNewColumns] = useState<Columns>({});
  const [label, setLabel] = useState<string[]>([]);
  const columns: readingsRecord = {
    reading1: [],
    reading2: [],
    reading3: [],
    reading4: [],
    reading5: [],
    reading6: [],
    reading7: [],
  };
  const [column, setColumns] = useState<Columns>({});

  const last12Months = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      months.push(formattedDate);
    }
    const reversedMonths = months.reverse();

    return reversedMonths;
  };

  const last30Days = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      days.push(formattedDate);
    }
    const reversedDays = days.reverse();
    return reversedDays;
  };

  const last7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      days.push(formattedDate);
    }
    const rev = days.reverse();
    console.log("the days", rev);

    return rev;
  };

  function calculateAxisConfig(data: number[]) {
    const max = Math.max(...data);
    const interval = Math.ceil(max / 5);
    return interval;
  }

  const fetchData = async (mode: Frequency) => {
    const months = [];
    const days = [];
    // Clear columns first to prevent duplication
    Object.keys(columns).forEach((key) => {
      columns[key as keyof readingsRecord] = [];
    });

    // Fetch data based on mode
    const now = new Date();
    let startDate;
    switch (mode) {
      case "day":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        setLabel(last7Days());
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 12);
        setLabel(last30Days());
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        setLabel(last12Months());
        break;
    }
    const dataResponse = await databases.listDocuments(
      DATABASE_ID,
      ASPEN_TABLE_ID,
      [
        Query.greaterThanEqual("date", startDate!.toISOString()),
        Query.lessThanEqual("date", now.toISOString()),
        Query.equal("time", "06:00"),
      ]
    );

    const fetchedReadings = dataResponse.documents.map(
      (item) => item as unknown as AspenData
    );

    fetchedReadings.forEach((reading) => {
      const meterReadings = [
        reading.meter_1,
        reading.meter_2,
        reading.condensate,
        reading.meter_blue,
        reading.meter_red,
        reading.steam_flow_meter,
        reading.aspen,
      ];
      meterReadings.forEach((value, index) => {
        if (typeof value === "number") {
          const columnKey = `reading${index + 1}` as keyof readingsRecord;
          if (!columns[columnKey]) {
            columns[columnKey] = [];
          }
          columns[columnKey].push(value);
        }
      });
    });
    setNewColumns({ ...columns });
  };

  useEffect(() => {
    fetchData("day");
  }, []);

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
          <Text>{JSON.stringify(label)}</Text>
          <Text>{JSON.stringify(newColumns.reading6)}</Text>
          <LineChart
            data={{
              labels: label,
              datasets: [
                {
                  data: newColumns?.reading6 || [20, 45, 28, 80, 99, 43, 50],
                },
                // {
                //   data: [20, 45, 28, 80, 99, 43, 50],
                //   color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                //   strokeWidth: 2, // optional
                // },
                // {
                //   data: [
                //     Math.random() * 100,
                //     Math.random() * 100,
                //     Math.random() * 100,
                //   ],
                // },
                // {
                //   data: [
                //     Math.random() * 100,
                //     Math.random() * 100,
                //     Math.random() * 100,
                //   ],
                // },
                // {
                //   data: [
                //     Math.random() * 100,
                //     Math.random() * 100,
                //     Math.random() * 100,
                //   ],
                // },
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
