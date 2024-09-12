import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import assistantlogo from "../assets/assistant-logo.png";
import userlogo from "../assets/user-logo.png";
import PointInfoContainer from "./PointInfoContainer";
import TypingDots from "../Animations/TypingDots";

const AssistantTitle = "SENIOR DOCTOR";
const UserTitle = "YOU";

const Message = ({ role, content, points, message, is_correct, test_results, test_name, waitingForResponse }) => {
  const isUser = role === "user";
  const isPatient = role === "patient";

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.doctorMessage,
      ]}
    >
      {!isPatient && (
        <View
          style={[
            styles.messageHeader,
            isUser ? styles.userHeader : styles.doctorHeader,
          ]}
        >
          {!isUser && (
            <Image source={assistantlogo} style={styles.assistantLogo} />
          )}

          <Text style={styles.roleTitle}>
            {isUser ? UserTitle : AssistantTitle}
          </Text>

          {points && (
            <View style={styles.doctorPointContainer}>
              <PointInfoContainer points={`${points}/5 points`} />
            </View>
          )}

          {isUser && <Image source={userlogo} style={styles.userLogo} />}
        </View>
      )}

      {waitingForResponse && role === "assistant" ? (
        <TypingDots /> 
      ) : (
        <>
          <Text style={styles.messageText}>{content}</Text>

          {is_correct === true && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Test: {test_name}</Text>
              <Text style={styles.resultText}>{test_results}</Text>
            </View>
          )}
        </>
      )}
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
  resultContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB", 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginTop: 10,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 5,
    fontFamily: "Rubik_400Regular",
  },
  resultText: {
    fontSize: 14,
    color: "#4B5563",
    fontFamily: "Rubik_400Regular",
  },
});

export default Message;
