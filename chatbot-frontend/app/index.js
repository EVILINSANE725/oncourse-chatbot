import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import { Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";
import Header from "../components/Header";
import ChatContainer from "../components/ChatContainer";
import InputBar from "../components/InputBar";

const HomeScreen = () => {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <Header name="MR. AMIT (45 Y/O)" points="0 points" />
      <ChatContainer />
      <InputBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
});

export default HomeScreen;
