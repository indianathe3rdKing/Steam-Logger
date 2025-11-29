import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  useEffect(() => {
    FontAwesome.loadFont();
    MaterialCommunityIcons.loadFont();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF8040",
        // tabBarActiveBackgroundColor: "#26355D",
        tabBarStyle: {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      {" "}
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="aspen"
        options={{
          headerShown: false,
          title: "Aspen",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="medkit" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fresenius"
        options={{
          headerShown: false,
          title: "Fresenius",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="factory" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
