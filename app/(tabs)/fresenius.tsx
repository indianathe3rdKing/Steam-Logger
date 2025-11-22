import { DATABASE_ID, databases, FRESENIUS_TABLE_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { freseniusData, MeterRule } from "@/types/types";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function freseniusScreen() {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [meterfk, setMeterfk] = useState<number>(0);
  const [metersh, setMetersh] = useState<number>(0);
  const [makeUp, setMakeUp] = useState<number>(0);
  const [hfo, setHfo] = useState<number>(0);
  const [steamFlowMeter1, setSteamFlowMeter1] = useState<number>(0);
  const [steamFlowMeter2, setSteamFlowMeter2] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [dateText, setDateText] = useState<boolean>(true);
  const [timeText, setTimeText] = useState<boolean>(true);

  let count: number = 0;
  const theme = useTheme();
  const { user } = useAuth();
  const [editableMeter1, setEditableMeter1] = useState<boolean>(false);
  const [editableMeter2, setEditableMeter2] = useState<boolean>(false);
  const [editableCondensate, setEditableCondensate] = useState<boolean>(false);
  const [editableRed, setEditableRed] = useState<boolean>(false);
  const [editableBlue, setEditableBlue] = useState<boolean>(false);
  const [editableSteamFlowMeter, setEditableSteamFlowMeter] =
    useState<boolean>(false);
  const [editableAspen, setEditableAspen] = useState<boolean>(false);

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

  const freseniusReadings: freseniusData = {
    date: dateTime,
    meter_fk: meterfk,
    meter_sh: metersh,
    make_up: makeUp,
    hfo: hfo,
    steam_flow_meter_1: steamFlowMeter1,
    steam_flow_meter_2: steamFlowMeter2,
  };
  const rules: Record<keyof freseniusData, MeterRule> = {
    date: { maxDelta: 0 },
    time: { maxDelta: 0 },
    meter_fk: { maxDelta: 100, allowSpikeAfter: 6 },
    meter_sh: { maxDelta: 100, allowSpikeAfter: 6 },
    make_up: { maxDelta: 100, allowSpikeAfter: 6 },
    hfo: { maxDelta: 100, allowSpikeAfter: 6 },
    steam_flow_meter_1: { maxDelta: 50000, allowSpikeAfter: 6 },
    steam_flow_meter_2: { maxDelta: 50000, allowSpikeAfter: 6 },
  };

  function clearForm() {
    setMeterfk(0);
    setMetersh(0);
    setMakeUp(0);
    setHfo(0);
    setSteamFlowMeter1(0);
    setSteamFlowMeter2(0);

    // Reset Date and Time to current
    setDateTime(new Date());

    // Reset error
    setError(null);

    // Reset date and time text indicators
    setDateText(true);
    setTimeText(true);
  }

  const handleSubmit = async () => {
    if (!user) return;
    let send: boolean = true;

    try {
      const lastResponse = await databases.listDocuments(
        DATABASE_ID,
        FRESENIUS_TABLE_ID,
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
        Object.keys(freseniusReadings).forEach((key) => {
          const prevReading = lastEntry[key as keyof freseniusData];
          const currentReading = freseniusReadings[key as keyof freseniusData];
          const rule = rules[key as keyof freseniusData];

          if (
            typeof prevReading === "number" &&
            typeof currentReading === "number"
          ) {
            const difference = currentReading - prevReading;

            if (difference < 0 || currentReading < prevReading) {
              setError(
                `Current reading of ${key} is less than previous reading. Please re-check your reading`
              );
              send = false;
            }
            if (difference > rule.maxDelta && timeExceeded) {
              setError(
                `Current reading of ${key} differs from previous reading by more than ${rule.maxDelta} units. Please re-check your reading. ${timeExceeded}`
              );
              send = false;
            }
            console.log("Difference for", key, ":", difference, "send =", send);
          }
        });

        if (send) {
          await databases.createDocument(
            DATABASE_ID,
            FRESENIUS_TABLE_ID,
            ID.unique(),
            {
              ...freseniusReadings,
            }
          );
          clearForm();
          Alert.alert("Success", "Fresenius readings submitted successfully.");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const height = useSharedValue(100);
  const handlePress = () => {
    height.value = height.value + 10;
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <View style={styles.timeContainer}>
                <Button
                  theme={{
                    colors: {
                      primary: "#304a8fff",
                      outline: "#C7CAD0",
                      text: "#304a8fff",
                    },
                  }}
                  style={styles.button}
                  onPress={() => setShowPickerDate(!showPickerDate)}
                >
                  {dateText ? "Date" : dateTime.toDateString()}
                </Button>
                <Button
                  theme={{
                    colors: {
                      primary: "#304a8fff",
                      outline: "#C7CAD0",
                      text: "#304a8fff",
                    },
                  }}
                  style={styles.button}
                  onPress={() => setShowPickerTime(!showPickerTime)}
                >
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
                theme={{
                  colors: {
                    primary: "#304a8fff",
                    outline: "#C7CAD0",
                    text: "#304a8fff",
                  },
                }}
                label={"Meter FK"}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                value={meterfk.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableMeter1((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setMeterfk(Number(text))}
                disabled={editableMeter1}
              />

              <TextInput
                theme={{
                  colors: {
                    primary: "#304a8fff",
                    outline: "#C7CAD0",
                    text: "#304a8fff",
                  },
                }}
                label={"Make Up"}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                value={makeUp.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableMeter2((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setMakeUp(Number(text) || 0)}
                disabled={editableMeter2}
              />

              <TextInput
                theme={{
                  colors: {
                    primary: "#304a8fff",
                    outline: "#C7CAD0",
                    text: "#304a8fff",
                  },
                }}
                label={"Meter SH"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={metersh.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableCondensate((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setMetersh(Number(text))}
                disabled={editableCondensate}
              />

              <TextInput
                theme={{
                  colors: {
                    // primary: "#5A4AE3",
                    // outline: "#C7CAD0",
                    // text: "#111",
                    primary: "#304a8fff",
                    outline: "#C7CAD0",
                    text: "#304a8fff",
                  },
                }}
                label={"HFO"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={hfo.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableBlue((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setHfo(Number(text))}
                disabled={editableBlue}
              />

              <TextInput
                theme={{
                  colors: {
                    primary: "#304a8fff",
                    outline: "#C7CAD0",
                    text: "#304a8fff",
                  },
                }}
                label={"Steam Flow Meter 1"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={steamFlowMeter1.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableRed((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setSteamFlowMeter1(Number(text))}
                disabled={editableRed}
              />

              <TextInput
                theme={{
                  colors: {
                    primary: "#304a8fff",
                    outline: "#C7CAD0",
                    text: "#304a8fff",
                  },
                }}
                label={"Steam Flow Meter 2"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={steamFlowMeter2.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableSteamFlowMeter((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setSteamFlowMeter2(Number(text))}
                disabled={editableSteamFlowMeter}
              />

              {error && (
                <Text style={[{ color: theme.colors.error }, styles.errors]}>
                  {error}
                </Text>
              )}

              <Button
                theme={{
                  colors: {
                    primary: "#26355D",
                    outline: "#C7CAD0",
                    text: "#fff",
                  },
                }}
                style={styles.submitButton}
                mode="contained"
                onPress={handleSubmit}
              >
                Send
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 40,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginBottom: 8,
    marginTop: 8,
    color: "white",

    elevation: 1,
    shadowColor: "#909090ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 0.6,
    borderRadius: 12,
  },
  errors: {
    paddingLeft: 24,
    marginTop: 8,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    // color: "white",
  },
  timeContainer: { flexDirection: "row", justifyContent: "space-between" },
  button: {},
  submitButton: {
    marginTop: 12,
    height: 50,

    justifyContent: "center",
  },
});
