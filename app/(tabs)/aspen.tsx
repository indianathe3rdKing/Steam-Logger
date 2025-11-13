import { ASPEN_TABLE_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { AspenData } from "@/types/types";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
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
  const rules = {
    meter1: { maxDelta: 100, allowSpikeAfter: 6 },
    meter2: { maxDelta: 100, allowSpikeAfter: 6 },
    condensate: { maxDelta: 100, allowSpikeAfter: 6 },
    meterBlue: { maxDelta: 100, allowSpikeAfter: 6 },
    meterRed: { maxDelta: 100, allowSpikeAfter: 6 },
    steamFlowMeter: { maxDelta: 50000, allowSpikeAfter: 6 },
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

      if (lastEntry) {
        Object.keys(aspenReadings).forEach((key) => {
          const prevReading = lastEntry[key];
          const currentReading = aspenReadings[key as keyof AspenData];

          if (
            typeof prevReading === "number" &&
            typeof currentReading === "number"
          ) {
            const difference = currentReading - prevReading;
            console.log(
              `Difference for ${currentReading} & ${prevReading}: ${difference}`
            );
            if (difference < 0) {
              setError(
                `Current reading of ${key} is less than previous reading. Please re-check your reading.`
              );
              return;
            } else if (difference > 100) {
              setError(
                `Current reading of ${key} differs from previous reading by more than 100 units. Please re-check your reading.`
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
        <Text variant="headlineSmall">Aspen Screen</Text>
        <View>
          <View>
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
          <TextInput
            label={"Meter 1"}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={meter1.toString()}
            onChangeText={(text) => setMeter1(Number(text) || 0)}
          />

          <TextInput
            label={"Meter 2"}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={meter2.toString()}
            onChangeText={(text) => setMeter2(Number(text) || 0)}
          />
          <TextInput
            label={"Condensate"}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            value={condensate.toString()}
            onChangeText={(text) => setCondensate(Number(text) || 0)}
          />
          <TextInput
            label={"Meter Blue"}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={meterBlue.toString()}
            onChangeText={(text) => setMeterBlue(Number(text) || 0)}
          />
          <TextInput
            label={"Meter Red"}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={meterRed.toString()}
            onChangeText={(text) => setMeterRed(Number(text) || 0)}
          />
          <TextInput
            label={"Steam Flow Meter"}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={steamFlowMeter.toString()}
            onChangeText={(text) => setSteamFlowMeter(Number(text) || 0)}
          />
          <TextInput
            label={"Aspen"}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={aspen.toString()}
            onChangeText={(text) => setAspen(Number(text) || 0)}
          />
          {error && (
            <Text style={[{ color: theme.colors.error }, styles.errors]}>
              {error}
            </Text>
          )}

          <Button mode="outlined" onPress={handleSubmit}>
            Send
          </Button>
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
  errors: {
    paddingLeft: 24,
    marginTop: 8,
  },
});
