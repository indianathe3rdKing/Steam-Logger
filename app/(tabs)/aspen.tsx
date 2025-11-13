import { ASPEN_TABLE_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { AspenData, MeterRule } from "@/types/types";
import Feather from "@expo/vector-icons/Feather";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function aspenScreen() {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [meter1, setMeter1] = useState<number>(0);
  const [meter2, setMeter2] = useState<number>(0);
  const [condensate, setCondensate] = useState<number>(0);
  const [meterBlue, setMeterBlue] = useState<number>(0);
  const [meterRed, setMeterRed] = useState<number>(0);
  const [steamFlowMeter, setSteamFlowMeter] = useState<number>(0);
  const [aspen, setAspen] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [dateText, setDateText] = useState<boolean>(true);
  const [timeText, setTimeText] = useState<boolean>(true);
  const [send, setSend] = useState<boolean>(false);
  let count: number = 0;
  const theme = useTheme();
  const { user } = useAuth();

  const [showPickerTime, setShowPickerTime] = useState<boolean>(false);
  const [showPickerDate, setShowPickerDate] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPickerTime(Platform.OS === "ios");
    setShowPickerDate(Platform.OS === "ios");

    if (selectedDate) {
      setDateTime(selectedDate);
      setDateText(false);
      setTimeText(false);
    }
  };

  const aspenReadings: AspenData = {
    date: dateTime,
    meter_1: meter1,
    meter_2: meter2,
    condensate: condensate,
    meter_blue: meterBlue,
    meter_red: meterRed,
    steam_flow_meter: steamFlowMeter,
    aspen: aspen,
  };
  const rules: Record<keyof AspenData, MeterRule> = {
    date: { maxDelta: 0 },
    meter_1: { maxDelta: 100, allowSpikeAfter: 6 },
    meter_2: { maxDelta: 100, allowSpikeAfter: 6 },
    condensate: { maxDelta: 100, allowSpikeAfter: 6 },
    meter_blue: { maxDelta: 100, allowSpikeAfter: 6 },
    meter_red: { maxDelta: 100, allowSpikeAfter: 6 },
    steam_flow_meter: { maxDelta: 50000, allowSpikeAfter: 6 },
    aspen: { maxDelta: 50, allowSpikeAfter: 6 },
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const lastResponse = await databases.listDocuments(
        DATABASE_ID,
        ASPEN_TABLE_ID,
        [Query.orderDesc("date"), Query.limit(1)]
      );
      const lastEntry = lastResponse.documents[0];
      let timeExceeded = false;
      let hoursDiff = 0;

      if (lastEntry && lastEntry.date) {
        const prev = new Date(lastEntry.date);
        const current = dateTime;
        if (!isNaN(prev.getTime()) && !isNaN(current.getTime())) {
          const dateDiff = current.getTime() - prev.getTime();
          hoursDiff = dateDiff / (1000 * 60 * 60);
          timeExceeded = hoursDiff < 6;

          console.log(
            "time Exceed" + timeExceeded + " hoursDiff: " + hoursDiff.toFixed(2)
          );
        }
      }
      if (lastEntry) {
        Object.keys(aspenReadings).forEach((key) => {
          const prevReading = lastEntry[key as keyof AspenData];
          const currentReading = aspenReadings[key as keyof AspenData];
          const rule = rules[key as keyof AspenData];
          let time = 0;
          if (
            typeof prevReading === "number" &&
            typeof currentReading === "number"
          ) {
            const difference = currentReading - prevReading;
            console.log(
              `Difference for ${currentReading} & ${prevReading}: ${difference}`
            );
            if (difference < 0 || currentReading < prevReading) {
              setError(
                `Current reading of ${key} is less than previous reading. Please re-check your reading`
              );
              return;
            }
            if (difference > rule.maxDelta && timeExceeded) {
              setError(
                `Current reading of ${key} differs from previous reading by more than ${rule.maxDelta} units. Please re-check your reading. ${timeExceeded}`
              );
              return;
            } else {
              count++;
              console.log("Current count:", count);
            }
          }
        });

        if (count === 7) {
          console.log(count);
          await databases.createDocument(
            DATABASE_ID,
            ASPEN_TABLE_ID,
            ID.unique(),
            {
              ...aspenReadings,
            }
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Aspen Screen
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.timeContainer}>
              <Button onPress={() => setShowPickerDate(!showPickerDate)}>
                {dateText ? "Date" : dateTime.toDateString()}
              </Button>
              <Button onPress={() => setShowPickerTime(!showPickerTime)}>
                {timeText ? "Time" : dateTime.toTimeString()}
              </Button>
            </View>
            {showPickerTime && (
              <RNDateTimePicker
                mode="time"
                display="default"
                value={dateTime}
                onChange={onChange}
              />
            )}
            {showPickerDate && (
              <RNDateTimePicker
                mode="date"
                display="default"
                value={dateTime}
                onChange={onChange}
              />
            )}
            <View>
              <TextInput
                label={"Meter 1"}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                value={meter1.toString()}
                onChangeText={(text) => setMeter1(Number(text) || 0)}
              />
              <Button style={styles.button}>
                <Feather name="check" size={24} color="black" />
              </Button>
            </View>

            <View>
              <TextInput
                label={"Meter 2"}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                value={meter2.toString()}
                onChangeText={(text) => setMeter2(Number(text) || 0)}
              />
              <Button style={styles.button}>
                <Feather name="check" size={24} color="black" />
              </Button>
            </View>

            <View>
              <TextInput
                label={"Condensate"}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                value={condensate.toString()}
                onChangeText={(text) => setCondensate(Number(text) || 0)}
              />

              <Button style={styles.button}>
                <Feather name="check" size={24} color="black" />
              </Button>
            </View>

            <View>
              <TextInput
                label={"Meter Blue"}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                value={meterBlue.toString()}
                onChangeText={(text) => setMeterBlue(Number(text) || 0)}
              />
              <Button style={styles.button}>
                <Feather name="check" size={24} color="black" />
              </Button>
            </View>

            <View>
              <TextInput
                label={"Meter Red"}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                value={meterRed.toString()}
                onChangeText={(text) => setMeterRed(Number(text) || 0)}
              />
              <Button style={styles.button}>
                <Feather name="check" size={24} color="black" />
              </Button>
            </View>

            <View>
              <TextInput
                label={"Steam Flow Meter"}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                value={steamFlowMeter.toString()}
                onChangeText={(text) => setSteamFlowMeter(Number(text) || 0)}
              />

              <Button style={styles.button}>
                <Feather name="check" size={24} color="black" />
              </Button>
            </View>

            <View>
              <TextInput
                label={"Aspen"}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                value={aspen.toString()}
                onChangeText={(text) => setAspen(Number(text) || 0)}
              />

              <Button style={styles.button}>
                <Feather name="check" size={24} color="black" />
              </Button>
            </View>
            {error && (
              <Text style={[{ color: theme.colors.error }, styles.errors]}>
                {error}
              </Text>
            )}

            <Button mode="contained" onPress={handleSubmit}>
              Send
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  input: {},
  errors: {
    paddingLeft: 24,
    marginTop: 8,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  timeContainer: {},
  button: {},
});
