import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { testConnection } from "../appwrite";
import { AppwriteException } from "react-native-appwrite";

export default function DebugScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString();

    try {
      const result = await testConnection();
      const status = result ? "✅ SUCCESS" : "❌ FAILED";
      setLogs((prev) => [...prev, `${timestamp} - ${status}`]);
    } catch (error: unknown) {
      // ✅ Type explicite pour éviter TS18046
      let errorMessage = "Erreur inconnue";

      // ✅ Vérification du type d'erreur
      if (error instanceof AppwriteException) {
        errorMessage = `Appwrite Error: ${error.message} (Code: ${error.code})`;
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }

      setLogs((prev) => [...prev, `${timestamp} - ❌ ERROR: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏓 Debug Appwrite</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Test en cours..." : "🏓 Test Ping"}
          onPress={runTest}
          disabled={isLoading}
        />

        <Button title="🗑️ Clear Logs" onPress={clearLogs} color="#FF6B6B" />
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Test en cours...</Text>
        </View>
      )}

      <View style={styles.logsHeader}>
        <Text style={styles.logsTitle}>📋 Logs ({logs.length})</Text>
      </View>

      <ScrollView style={styles.logs} showsVerticalScrollIndicator={true}>
        {logs.length === 0 ? (
          <Text style={styles.noLogsText}>Aucun log pour le moment</Text>
        ) : (
          logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logText}>{log}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    gap: 10,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: "#007AFF",
    fontWeight: "500",
  },
  logsHeader: {
    backgroundColor: "#333",
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  logsTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  logs: {
    flex: 1,
    backgroundColor: "#000",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
  },
  logItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  logText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#00FF00",
    lineHeight: 16,
  },
  noLogsText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },
});
