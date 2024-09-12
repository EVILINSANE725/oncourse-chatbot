import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Message from './Message';

const ChatContainer = ({patientPrompt,messages}) => {
  return (
    <ScrollView style={styles.chatContainer}>
      <Message role="patient" content={patientPrompt}/>
      {
        messages.filter((message)=> message.role!=="system").map((message)=>(
          <Message role={message.role} content={message.content} message={message} points={message.points}/>
        ))
      }
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
