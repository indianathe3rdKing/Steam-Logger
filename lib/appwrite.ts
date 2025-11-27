import { Account, Client, Databases, TablesDB } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!);

export const account = new Account(client);
export const databases = new Databases(client);
export const tableDB = new TablesDB(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const ASPEN_TABLE_ID = process.env.EXPO_PUBLIC_DB_ASPEN_TABLE_ID!;
export const FRESENIUS_TABLE_ID =
  process.env.EXPO_PUBLIC_DB_FRESENIUS_TABLE_ID!;
export const ASPEN_DELTA_TABLE_ID =
  process.env.EXPO_PUBLIC_DB_ASPEN_DELTA_TABLE_ID!;
