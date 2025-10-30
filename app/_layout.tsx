import { Stack, useRouter } from "expo-router";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = false;

  if (!isAuth) {
    setTimeout(() => {
      router.replace("/auth");
    }, 10);
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}
