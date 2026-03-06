import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";

const WEB_APP_URL = "http://192.168.1.100:5173";

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>AuraBoost Mobile Preview</Text>
        <Text style={styles.subtitle}>Point WEB_APP_URL in App.js to your local Vite URL.</Text>
      </View>
      <WebView source={{ uri: WEB_APP_URL }} style={styles.webview} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05050f"
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)"
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },
  subtitle: {
    color: "#9b9ba5",
    fontSize: 12,
    marginTop: 4
  },
  webview: {
    flex: 1,
    backgroundColor: "#05050f"
  }
});
