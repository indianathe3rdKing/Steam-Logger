import { AspenOverview } from "@/components/(dashboard)/aspen-overview";
import FreseniusOverview from "@/components/(dashboard)/fresenius-overview";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

export default function homePage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider theme={{ ...DefaultTheme }}>
        <Tab.Navigator>
          <Tab.Screen name="Aspen" component={AspenOverview} />
          <Tab.Screen name="Fresenius" component={FreseniusOverview} />
        </Tab.Navigator>
      </PaperProvider>
    </SafeAreaView>
  );
}
