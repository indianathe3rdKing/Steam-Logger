import { Models } from "react-native-appwrite";

export interface AspenData extends Models.Document {
  date: string;
  meter_1: number;
  meter_2: number;
  condensate: number;
  meter_blue: number;
  meter_red: number;
  steam_flow_meter: number;
  aspen: number;
}
