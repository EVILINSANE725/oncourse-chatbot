import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import assistantlogo from "../assets/assistant-logo.png";
import userlogo from "../assets/user-logo.png";
import PointInfoContainer from "./PointInfoContainer";

const AssistantTitle = "SENIOR DOCTOR";
const UserTitle = "YOU";

const Message = ({ role, text, points }) => {
  const isUser = role === "user";
  const isPatient = role === "patient"

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.doctorMessage,
      ]}
    >
     { !isPatient && <View
        style={[
          styles.messageHeader,
          isUser ? styles.userHeader : styles.doctorHeader,
        ]}
      >
        {!isUser && <Image source={assistantlogo} style={styles.assistantLogo} />}
        
        <Text style={styles.roleTitle}>
          {isUser ? UserTitle : AssistantTitle}
        </Text>

        {points && (
          <View
            style={[
              styles.doctorPointContainer
            ]}
          >
            <PointInfoContainer points={points} />
          </View>
        )}
        
        {isUser && <Image source={userlogo} style={styles.userLogo} />}
      </View>}
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: 10,
    marginVertical: 15,
    padding: 10,
    maxWidth: "90%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  doctorMessage: {
    alignSelf: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userHeader: {
    justifyContent: "flex-end",
  },
  doctorHeader: {
    justifyContent: "flex-start",
  },
  assistantLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  userLogo: {
    width: 30,
    height: 30,
    marginLeft: 8,
  },
  roleTitle: {
    fontSize: 16,
    color: "rgba(16, 24, 40, 0.5)",
    fontFamily: "Rubik_400Regular",
  },
  messageText: {
    fontSize: 16,
    fontFamily: "Rubik_400Regular",
    color: "#333",
  },
  doctorPointContainer: {
    marginLeft: 50,
  },
});

export default Message;
