import {
  ASPEN_DELTA_TABLE_ID,
  ASPEN_TABLE_ID,
  client,
  DATABASE_ID,
  databases,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { AspenData, MeterRule, RealtimeResponse } from "@/types/types";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function aspenScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 668;
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [meter1, setMeter1] = useState<number>(0);
  // const [meter2, setMeter2] = useState<number>(0);
  const [bypass, setBypass] = useState<number>(0);
  const [meterBlue, setMeterBlue] = useState<number>(0);
  const [meterRed, setMeterRed] = useState<number>(0);
  const [steamFlowMeter, setSteamFlowMeter] = useState<number>(0);
  const [aspen, setAspen] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [dateText, setDateText] = useState<boolean>(true);
  const [timeText, setTimeText] = useState<boolean>(true);
  const [aspenDelta, setAspenDelta] = useState<AspenData>({
    meter_1: 0,

    bypass: 0,
    meter_blue: 0,
    meter_red: 0,
    steam_flow_meter: 0,
    aspen: 0,
  });

  let count: number = 0;
  const theme = useTheme();
  const { user } = useAuth();
  const [editableMeter1, setEditableMeter1] = useState<boolean>(false);
  const [editableMeter2, setEditableMeter2] = useState<boolean>(false);
  const [editableBypass, setEditableBypass] = useState<boolean>(false);
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

  const aspenReadings: AspenData = {
    date: new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate()
    ),
    time: dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    meter_1: meter1,
    bypass: bypass,
    meter_blue: meterBlue,
    meter_red: meterRed,
    steam_flow_meter: steamFlowMeter,
    aspen: aspen,
  };

  const rules: Record<keyof AspenData, MeterRule> = {
    date: { maxDelta: 0 },
    time: { maxDelta: 0 },
    meter_1: { maxDelta: 100, allowSpikeAfter: 6 },
    bypass: { maxDelta: 100, allowSpikeAfter: 6 },
    meter_blue: { maxDelta: 100, allowSpikeAfter: 6 },
    meter_red: { maxDelta: 100, allowSpikeAfter: 6 },
    steam_flow_meter: { maxDelta: 50000, allowSpikeAfter: 6 },
    aspen: { maxDelta: 100, allowSpikeAfter: 6 },
  };

  function clearForm() {
    setMeter1(0);

    setBypass(0);
    setMeterBlue(0);
    setMeterRed(0);
    setSteamFlowMeter(0);
    setAspen(0);

    // Reset Date and Time to current
    setDateTime(new Date());

    // Reset error
    setError(null);

    // Reset date and time text indicators
    setDateText(true);
    setTimeText(true);
  }

  useEffect(() => {
    if (!user) return;

    const channel = `databases.${DATABASE_ID}.collections.${ASPEN_TABLE_ID}.documents`;
    const subscription = client.subscribe(
      channel,
      async (response: RealtimeResponse) => {
        const isCreate = response.events.some((event) =>
          event.includes("create")
        );
        const isUpdate = response.events.some((event) =>
          event.includes("update")
        );
        if (isCreate || isUpdate) {
          await databases.listDocuments(DATABASE_ID, ASPEN_TABLE_ID, [
            Query.orderDesc("date"),
            Query.limit(1),
          ]);
        }
      }
    );
  });

  const handleSubmit = async () => {
    if (!user) return;

    try {
      let newDelta = {
        ...aspenDelta,
        date: new Date(
          dateTime.getFullYear(),
          dateTime.getMonth(),
          dateTime.getDate()
        ),
        time: dateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
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

          // create Aspen Delta from
        }
      }
      if (lastEntry) {
        Object.keys(aspenReadings).forEach((key) => {
          const prevReading = lastEntry[key as keyof AspenData];
          const currentReading = aspenReadings[key as keyof AspenData];
          const rule = rules[key as keyof AspenData];
          if (
            typeof prevReading === "number" &&
            typeof currentReading === "number"
          ) {
            const difference = currentReading - prevReading;

            (newDelta as any)[key] = difference;

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
            }
          }
        });
        setAspenDelta({ ...newDelta });

        console.log("The delta ", newDelta);
        console.log("count", count);

        if (count === 6) {
          await databases.createDocument(
            DATABASE_ID,
            ASPEN_TABLE_ID,
            ID.unique(),
            {
              ...aspenReadings,
            }
          );

          await databases.createDocument(
            DATABASE_ID,
            ASPEN_DELTA_TABLE_ID,
            ID.unique(),
            {
              ...newDelta,
            }
          );

          clearForm();
          Alert.alert("Success", "Aspen readings submitted successfully.");
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
            <View style={[styles.content, isDesktop && styles.desktopWidth]}>
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
                  {dateText
                    ? "Date"
                    : dateTime.toLocaleDateString("default", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
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
                  {timeText
                    ? "Time"
                    : dateTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
                label={"Meter 1"}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                value={meter1.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableMeter1((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setMeter1(Number(text))}
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
                label={"Bypass"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={bypass.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableBypass((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setBypass(Number(text))}
                disabled={editableBypass}
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
                label={"Meter Blue"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={meterBlue.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableBlue((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setMeterBlue(Number(text))}
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
                label={"Meter Red"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={meterRed.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableRed((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setMeterRed(Number(text))}
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
                label={"Steam Flow Meter"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={steamFlowMeter.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableSteamFlowMeter((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setSteamFlowMeter(Number(text))}
                disabled={editableSteamFlowMeter}
              />

              <TextInput
                theme={{
                  colors: {
                    primary: "#304a8fff",
                    outline: "#C7CAD0",
                    text: "#333",
                  },
                }}
                label={"Aspen"}
                mode="outlined"
                style={[styles.input, { backgroundColor: "#F6F7F9" }]}
                keyboardType="numeric"
                value={aspen.toString()}
                right={
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      setEditableAspen((prev) => !prev);
                    }}
                  />
                }
                onChangeText={(text) => setAspen(Number(text))}
                disabled={editableAspen}
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
  desktopWidth: {
    minWidth: 400,
    marginHorizontal: "auto",
  },
});
