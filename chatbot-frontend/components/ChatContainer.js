import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Message from './Message';

const ChatContainer = ({ patientPrompt, messages, waitingForResponse }) => {
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to the last message
  }, [messages]);

  return (
    <ScrollView
      style={styles.chatContainer}
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      <Message role="patient" content={patientPrompt} />
      {
        messages.filter((message) => message.role !== "system").map((message, index) => (
          <Message 
            key={index} 
            role={message.role} 
            content={message.content} 
            message={message} 
            is_correct={message.is_correct} 
            test_results={message.test_results} 
            test_name={message.test_name} 
            points={message.points}
          />
        ))
      }
      {waitingForResponse && <Message role="assistant" content="Doctor is typing..." />}
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
