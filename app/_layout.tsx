import AuthProvider, { useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthRoute = segments[0] === "auth";

    if (!user && !inAuthRoute && !isLoading) {
      router.replace("/auth");
    } else if (user && inAuthRoute && !isLoading) {
      router.replace("/");
    }
  }, [user, segments]);
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthGuard>
    </AuthProvider>
  );
}
