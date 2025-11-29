import { useAuth } from "@/lib/auth-context";
import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function Index() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} color={"#26355D"} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/auth" />;
}
