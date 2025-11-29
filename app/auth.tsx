import { useAuth } from "@/lib/auth-context";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  //   const isSignUp = true;
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  let [fontsLoaded] = useFonts({
    "Raleway-Bold": Raleway_700Bold,
  });

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
      // Sign up automatically signs in, so navigation will be handled by AuthGuard
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
      // Navigation will be handled by AuthGuard
    }
  };

  const handleToggle = () => {
    setIsSignUp((prev: boolean) => !prev);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create an Account" : "Welcome Back!"}
        </Text>
        <TextInput
          theme={{
            colors: {
              primary: "#304a8fff",
              outline: "#C7CAD0",
              text: "#304a8fff",
            },
          }}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          style={styles.text}
          mode="outlined"
        />
        <TextInput
          theme={{
            colors: {
              primary: "#304a8fff",
              outline: "#C7CAD0",
              text: "#304a8fff",
            },
          }}
          label="Password"
          //   secureTextEntry
          onChangeText={setPassword}
          style={styles.text}
          mode="outlined"
        />
        {error && (
          <Text style={[{ color: theme.colors.error }, styles.errors]}>
            {error}
          </Text>
        )}
        <Button
          theme={{
            colors: {
              primary: "#26355D",
              outline: "#C7CAD0",
              text: "#fff",
            },
          }}
          mode="contained"
          style={styles.submitButton}
          onPress={handleAuth}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <Button
          theme={{
            colors: {
              primary: "#304a8fff",
              outline: "#C7CAD0",
              text: "#304a8fff",
            },
          }}
          onPress={handleToggle}
        >
          {isSignUp
            ? "Already have an account?"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    // fontSize: 24,
    // fontWeight: "bold",
    marginBottom: 16,
    color: "#26355D",
    textAlign: "center",
    fontFamily: "Sans-serif",
    fontWeight: "500",
  },
  text: {
    marginHorizontal: 12,
    marginTop: 16,
  },
  button: {
    marginTop: 16,
  },
  errors: {
    paddingLeft: 24,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 12,
    height: 50,
    justifyContent: "center",
  },
});
