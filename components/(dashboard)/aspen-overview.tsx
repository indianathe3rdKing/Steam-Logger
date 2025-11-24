import { ASPEN_DELTA_TABLE_ID, DATABASE_ID, databases } from "@/lib/appwrite";
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
import { Button, DataTable } from "react-native-paper";
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
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState<number[]>([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState<number>(
    numberOfItemsPerPageList[0]
  );
  const [dataContainer, setDataContainer] = useState([]);
  const readingsObj: AspenData = {};

  const [items] = React.useState([
    {
      key: 1,
      name: "Cupcake",
      calories: 356,
      fat: 16,
    },
    {
      key: 2,
      name: "Eclair",
      calories: 262,
      fat: 16,
    },
    {
      key: 3,
      name: "Frozen yogurt",
      calories: 159,
      fat: 6,
    },
    {
      key: 4,
      name: "Gingerbread",
      calories: 305,
      fat: 3.7,
    },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

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

    return rev;
  };

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
      ASPEN_DELTA_TABLE_ID,
      [
        // Query.greaterThanEqual("date", startDate!.toISOString()),
        // Query.lessThanEqual("date", now.toISOString()),
        Query.equal("time", "06:00"),
      ]
    );

    const fetchedReadings = dataResponse.documents.map(
      (item) => item as unknown as AspenData
    );

    fetchedReadings.forEach((reading) => {
      const meterReadings = [
        reading.meter_1,
        reading.bypass,
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
    console.log("New Columns", newColumns);
  };

  useEffect(() => {
    fetchData("day");
    setPage(0);
  }, [itemsPerPage, user, columns]);

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
          {/* <Text>{JSON.stringify(label)}</Text>
          <Text>{JSON.stringify(newColumns.reading5)}</Text> */}
          <LineChart
            data={{
              labels: label,
              datasets: [
                {
                  data: newColumns?.reading5 || [20, 45, 28, 80, 99, 43, 50],
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
            width={Dimensions.get("window").width}
            height={220}
            yAxisSuffix="k"
            yAxisInterval={5} // Show every 5th value for cleaner display
            withVerticalLabels={true}
            withHorizontalLabels={true}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0, // No decimals for cleaner look
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
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Dessert</DataTable.Title>
              <DataTable.Title numeric>Calories</DataTable.Title>
              <DataTable.Title numeric>Fat</DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
              <DataTable.Row key={item.key}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
                <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(items.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${items.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
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
