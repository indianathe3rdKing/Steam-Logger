import AuthProvider, { useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const inAuthRoute = segments[0] === "auth";
    const inTabsRoute = segments[0] === "(tabs)";

    if (!user && !inAuthRoute && inTabsRoute) {
      router.replace("/auth");
    } else if (user && inAuthRoute && !inTabsRoute) {
      router.replace("/(tabs)/home");
    }
  }, [user, segments, isLoading]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AuthGuard>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
        </AuthGuard>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
