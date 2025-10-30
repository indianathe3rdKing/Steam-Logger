import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  //   const isSignUp = true;
  const { signIn, signUp } = useAuth();

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
      } else {
        const error = await signIn(email, password);
        if (error) {
          setError(error);
          return;
        }
      }
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
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          style={styles.text}
        />
        <TextInput
          label="Password"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.text}
        />
        {error && <Text>{error}</Text>}
        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <Button onPress={handleToggle}>
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
    color: "#1e0033ff",
    textAlign: "center",
  },
  text: {
    marginHorizontal: 12,
    marginTop: 16,
  },
  button: {
    marginTop: 16,
  },
});
