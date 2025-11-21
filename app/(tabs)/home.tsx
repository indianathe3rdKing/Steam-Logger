import { AspenOverview } from "@/components/(dashboard)/aspen-overview";
import FreseniusOverview from "@/components/(dashboard)/fresenius-overview";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

export default function homePage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Aspen" component={AspenOverview} />
        <Tab.Screen name="Fresenius" component={FreseniusOverview} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
