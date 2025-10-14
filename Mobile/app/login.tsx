import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LogIn } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

const API_URL = "http://localhost:8080"; // ajuste se usar IP real

export default function Login() {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, senha });
      setUser(response.usuario);
      setIsAuthenticated(true);
      router.replace("/(tabs)");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const redirectUri = Linking.createURL("callback");

    const result = await WebBrowser.openAuthSessionAsync(
      `${API_URL}/oauth2/authorization/google`,
      redirectUri
    );

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const token = url.searchParams.get("token");
      const email = url.searchParams.get("email");
      const nome = url.searchParams.get("nome");
      const role = url.searchParams.get("role");

      if (token) {
        setUser({ email, nome, role, token });
        setIsAuthenticated(true);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Erro", "Não foi possível autenticar com o Google.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <LogIn size={64} color="#0066cc" />
          <Text style={styles.title}>AgroSensor</Text>
          <Text style={styles.subtitle}>Sistema de Monitoramento Agrícola</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 48 },
  title: { fontSize: 32, fontWeight: "bold", color: "#0066cc", marginTop: 16 },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8 },
  form: { width: "100%" },
  errorText: { color: "#dc2626", marginBottom: 16, textAlign: "center", fontSize: 14 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#ddd" },
  dividerText: { marginHorizontal: 16, color: "#666", fontSize: 14 },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  googleButtonText: { color: "#333", fontSize: 16, fontWeight: "600" },
});
