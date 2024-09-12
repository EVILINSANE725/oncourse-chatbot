import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Message from './Message';

const ChatContainer = () => {
let PatientPrompt = `Hi, Dr. Shreya. Good to see you.\n\nI've been having a persistent cough lately, and I've noticed I'm losing weight without trying. I'm a bit concerned because I've been a smoker for many years`
  return (
    <ScrollView style={styles.chatContainer}>
      <Message role="patient" text={PatientPrompt}/>
      <Message role="assistant" text="The patient is a 60-year-old male with a history of smoking. He presents with a cough and unintentional weight loss. These symptoms warrant further investigation. Let's go to the lab to diagnose further. What test should we run?" />
      <Message role="user" text="Please run an X-ray test" />
      <Message role="assistant" text="Great choice, Doctor! Here are the results from the report: Shows a mass in the upper lobe of the right lung." points="5/5 points" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 10,
  },
});

export default ChatContainer;
