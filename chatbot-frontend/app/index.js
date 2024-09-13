import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";
import Header from "../components/Header";
import ChatContainer from "../components/ChatContainer";
import InputBar from "../components/InputBar";
import io from "socket.io-client";
import _ from "lodash";
import ReactNativeSpinner from "../Animations/LoadingWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = () => {
  const [fontsLoaded] = useFonts({ Rubik_400Regular, Rubik_700Bold });
  const [messages, setMessages] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});
  const [patientId, setPatientId] = useState("2");
  const [user, setUser] = useState({});
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(true);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [treatment_points, setTreatmentPoint] = useState(0);
  const [diagnoses_points, setDiagnosesPoints] = useState(0);
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  const { newPatient } = useLocalSearchParams();

  const patientPrompt = `Hi, Dr. Shreya. Good to see you. \n \n${
    patientDetails?.initialPrompt || ""
  }`;

  useEffect(() => {
    const newSocket = io.connect(`http://192.168.83.31:8080`, {
      reconnect: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("patient_details", (patientDetails) => {
      setPatientDetails(patientDetails);
      newSocket.emit("start_game", {
        messages: [],
        patientId: patientDetails.id,
      });
      setWaitingForResponse(true);
      setLoading(false);
    });

    newSocket.on("assistant_message", (message) => {
      handleAssistantMessages(message);
    });
    newSocket.emit("get_new_patient_from_gpt", patientId);

    return () => {
      console.log("disconnected");
      newSocket.disconnect();
    };
  }, [patientId]);

  const handleAssistantMessages = async (message) => {
    console.log(message);
    const user = message?.user;
    const stage = message?.STAGE;
    const messages = message?.messages;
    const treatment_points_new = message?.treatment_points;
    const diagnosis_points_new = message?.diagnosis_points;

    if (user) setUser(user);
    if (stage) setStage(stage);
    if (messages) setMessages(messages);
    if (treatment_points_new) setTreatmentPoint(treatment_points_new);
    if (diagnosis_points_new) setDiagnosesPoints(diagnosis_points_new);

    let transferPatient = { ...patientDetails };

    await AsyncStorage.setItem(
      "patientDetails",
      JSON.stringify(transferPatient)
    );
    if (stage === "GAME_OVER" && message?.REASON === "WIN") {
      setNavigating(true);
      setTimeout(() => {
        router.push({
          pathname: "/win-screen",
          params: {
            points: JSON.stringify({
              lab: treatment_points_new,
              diagnosis: diagnosis_points_new,
            }),
            patientDetails: JSON.stringify(_.cloneDeep(transferPatient)),
          },
        });        
        setNavigating(false);
      }, 5000);
    }

    setWaitingForResponse(false);
  };

  const handleSendMessage = (text) => {
    if (socket) {
      let latestmessage = { role: "user", content: text };
      setMessages((prevMessages) => [...prevMessages, latestmessage]);
      socket.emit(`user_message_${stage}`, {
        message: latestmessage,
        messages: messages,
      });
      setWaitingForResponse(true);
      Keyboard.dismiss();
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <ReactNativeSpinner spinning={loading || navigating}>
      <View style={styles.container}>
        <Header
          name={`MR. ${_.upperCase(patientDetails?.name || "")} (${
            patientDetails.age || ""
          } Y/O)`}
          points={`${treatment_points + diagnoses_points} points`}
        />
        <ChatContainer
          messages={messages}
          patientPrompt={patientPrompt}
          waitingForResponse={waitingForResponse}
        />
        <InputBar handleSendMessage={handleSendMessage} />
      </View>
    </ReactNativeSpinner>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
});

export default ChatScreen;
