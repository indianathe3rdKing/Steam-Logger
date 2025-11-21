import { AspenOverview } from "@/components/(dashboard)/aspen-overview";
import FreseniusOverview from "@/components/(dashboard)/fresenius-overview";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function homePage() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Aspen" component={AspenOverview} />
      <Tab.Screen name="Fresenius" component={FreseniusOverview} />
    </Tab.Navigator>
  );
}
