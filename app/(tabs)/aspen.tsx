import { ASPEN_TABLE_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
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
  const theme = useTheme();
  const { user } = useAuth();
  const aspenReadings = [];

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

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await databases.createDocument(DATABASE_ID, ASPEN_TABLE_ID, ID.unique(), {
        date: dateTime.toISOString(),
        meter_1: meter1,
        meter_2: meter2,
        condensate: condensate,
        meter_blue: meterBlue,
        meter_red: meterRed,
        steam_flow_meter: steamFlowMeter,
        aspen: aspen,
      });
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
