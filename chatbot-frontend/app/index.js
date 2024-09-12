import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { useFonts } from "expo-font";
import { Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";
import Header from "../components/Header";
import ChatContainer from "../components/ChatContainer";
import InputBar from "../components/InputBar";
import io from "socket.io-client";
import _ from 'lodash';

const HomeScreen = () => {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_700Bold,
  });
  const [messages, setMessages] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});
  const [patientId, setPatientId] = useState("2");
  const [user, setUser] = useState({});
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(true);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [treatment_points,setTreatmentPoint] = useState(0)
  const [diagnoses_points,setDiagnosesPoints] = useState(0)
  const [socket, setSocket] = useState(null);

  const patientPrompt = `Hi, Dr. Shreya. Good to see you. \n \n${patientDetails?.initialPrompt}`;

  useEffect(() => {
    const newSocket = io.connect(`http://192.168.1.4:8080`, { reconnect: true });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("patient_details", (patientDetails) => {
      setPatientDetails(patientDetails);
      newSocket.emit("start_game", { messages: [], patientId: patientDetails.id });
      setWaitingForResponse(true);
      setLoading(false);
    });

    newSocket.on("assistant_message", (message) => {
      handleAssistantMessages(message);
    });

    newSocket.emit("get_new_patient", patientId);

    return () => {
      console.log("disconnected");
      newSocket.disconnect();
    };
  }, [patientId]);

  const handleAssistantMessages = (message) => {
    console.log(message);
    const user = message?.user;
    const stage = message?.STAGE;
    const messages = message?.messages;
    const treatment_points = message?.treatment_points;
    const diagnosis_points = message?.diagnosis_points;
    if (user) setUser(user);
    if (stage) setStage(stage);
    if (messages) setMessages(messages);
    if (treatment_points) setTreatmentPoint(treatment_points);
    if (diagnosis_points) setDiagnosesPoints(diagnosis_points);
    setWaitingForResponse(false); 
  };

  const handleSendMessage = (text) => {
    if (socket) {
      let latestmessage = { role: 'user', content: text };
      setMessages((prevMessages) => ([...prevMessages, latestmessage]));
      socket.emit(`user_message_${stage}`, { message: latestmessage, messages: messages });
      setWaitingForResponse(true);
      Keyboard.dismiss(); 
    }
  };

  if (!fontsLoaded || loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Header name={`MR. ${_.upperCase(patientDetails.name)} (${patientDetails.age} Y/O)`} points={`${treatment_points + diagnoses_points} points`} />
      <ChatContainer messages={messages} patientPrompt={patientPrompt} waitingForResponse={waitingForResponse} />
      <InputBar handleSendMessage={handleSendMessage} />
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
