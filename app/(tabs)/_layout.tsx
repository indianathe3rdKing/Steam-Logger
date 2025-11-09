import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="aspen" options={{ title: "Aspen" }} />
      <Tabs.Screen name="fresenius" options={{ title: "Fresenius" }} />
    </Tabs>
  );
}
