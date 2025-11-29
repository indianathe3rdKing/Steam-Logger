import {
  DATABASE_ID,
  databases,
  FRESENIUS_DELTA_TABLE_ID,
  FRESENIUS_TABLE_ID,
  tableDB,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { altColumns, freseniusData, readingsRecord } from "@/types/types";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { LineChart } from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";
import { Button, DataTable } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;
const frequency = ["day", "month", "year"];
type Frequency = (typeof frequency)[number];
type Columns = Record<string, number[]>;

export function FreseniusOverview() {
  const { signOut, user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [mode, setMode] = useState<Frequency>("day");
  const [allColumns, setAllColumns] = useState<altColumns>({});
  const [newColumns, setNewColumns] = useState<Columns>({});
  const [label, setLabel] = useState<string[]>([]);
  const altColumns: altColumns = {
    date: [],
    time: [],
  };
  const columns: readingsRecord = {
    reading1: [],
    reading2: [],
    reading3: [],
    reading4: [],
    reading5: [],
    reading6: [],
  };
  const [column, setColumns] = useState<Columns>({});
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState<number[]>([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState<number>(
    numberOfItemsPerPageList[0]
  );
  const [tableData, setTableData] = useState<freseniusData[]>([]);

  const items = tableData;

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  const formatDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString("en-Us", {
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

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
      const formattedDate = formatDate(date);
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
      FRESENIUS_DELTA_TABLE_ID,
      [
        Query.greaterThanEqual("date", startDate!.toISOString()),
        // Query.lessThanEqual("date", now.toISOString()),
        Query.equal("time", "06:00"),
      ]
    );

    const fetchedReadings = dataResponse.documents.map(
      (item) => item as unknown as freseniusData
    );

    fetchedReadings.forEach((reading) => {
      const meterReadings = [
        reading.meter_fk,
        reading.meter_sh,
        reading.hfo,
        reading.make_up,
        reading.steam_flow_meter_1,
        reading.steam_flow_meter_2,
        reading.date,
        reading.time,
      ];
      meterReadings.forEach((value, index) => {
        if (typeof value === "number") {
          const columnKey = `reading${index + 1}` as keyof readingsRecord;
          if (!columns[columnKey]) {
            columns[columnKey] = [];
          }
          columns[columnKey].push(value);
        } else if (typeof value !== "number") {
          // Simply skip non-number values for now to avoid errors
          // console.log("Skipping non-number value:", value, "at ndex", index);
          if (index === 6) {
            const Key = "date" as keyof altColumns;
            if (!altColumns[Key]) {
              altColumns[Key] = [];
            }
            (altColumns as any)[Key].push(value);
          }
          if (index === 7) {
            const Key = "time" as keyof altColumns;
            if (!altColumns[Key]) {
              altColumns[Key] = [];
            }
            (altColumns as any)[Key].push(value);
          }
        }
      });
    });
    setNewColumns({ ...columns });
    // console.log("New Columns (numbers only):", allColumns);
  };

  function getReading(readingNumber: number) {
    const readingKey = `reading${readingNumber}`;

    return newColumns[readingKey];
  }

  async function fetchTableData() {
    const result = await tableDB.listRows({
      databaseId: DATABASE_ID,
      tableId: FRESENIUS_TABLE_ID,
      queries: [
        Query.limit(26),
        Query.select([
          "date",
          "time",
          "meter_fk",
          "meter_sh",
          "hfo",
          "make_up",
          "steam_flow_meter_1",
          "steam_flow_meter_2",
        ]),
      ],
    });

    const row = result.rows;
    const parsedData = row.map((item: any) => ({
      date: item.date,
      time: item.time,
      meter_fk: item.meter_fk,
      meter_sh: item.meter_sh,
      hfo: item.hfo,
      make_up: item.make_up,
      steam_flow_meter_1: item.steam_flow_meter_1,
      steam_flow_meter_2: item.steam_flow_meter_2,
    }));
    setTableData(parsedData);
    return parsedData;
  }

  useEffect(() => {
    // Only run if user is authenticated
    if (!user) return;

    const loadData = () => {
      try {
        fetchData("day");
        setPage(0);
        setAllColumns({ ...altColumns, ...columns });
        fetchTableData();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [itemsPerPage, user]);

  return (
    <View
      style={[styles.container, isDesktop ? styles.desktopContainer : null]}
    >
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
        style={[styles.content, isDesktop && styles.desktopContent]}
      >
        <ScrollView>
          <View>
            {/* <Text>{JSON.stringify(label)}</Text>
            <Text>{JSON.stringify(newColumns.reading5)}</Text> */}
            <LineChart
              data={{
                labels: label.slice(0, newColumns.reading5?.length),
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
              // yAxisSuffix="k"
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
                borderRadius: isDesktop ? 0 : 16,
              }}
            />
          </View>
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title numeric>Time</DataTable.Title>
                <DataTable.Title numeric>Meter FK</DataTable.Title>
                <DataTable.Title numeric>Meter SH</DataTable.Title>
                <DataTable.Title numeric>HFO</DataTable.Title>
                <DataTable.Title numeric>Make Up</DataTable.Title>
                <DataTable.Title numeric>Steam 1</DataTable.Title>
                <DataTable.Title numeric>Steam 2</DataTable.Title>
              </DataTable.Header>

              {items.slice(from, to).map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>
                    {formatDate(new Date(item.date || ""))}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item.time}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.meter_fk}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.meter_sh}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.hfo}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.make_up}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {item.steam_flow_meter_1}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {item.steam_flow_meter_2}
                  </DataTable.Cell>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  desktopContainer: {
    flex: 1,
    // marginHorizontal: 100,
  },
  content: { flex: 1, paddingBottom: 16 },
  desktopContent: {
    flex: 1,
    paddingBottom: 16,
    marginHorizontal: 100,
  },
  signOutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});

export default FreseniusOverview;
