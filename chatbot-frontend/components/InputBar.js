import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import sendIcon from '../assets/send-icon.png';

const InputBar = ({handleSendMessage}) => {
  const [message, setMessage] = useState('');


  const handleSend = () => {
    if (message.trim()) {
      handleSendMessage(message);
      setMessage('');
    }
  };
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter your response"
        placeholderTextColor="#9CA3AF"
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Image source={sendIcon} style={styles.sendIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems:"center"
,    padding: 20,
  },
  input: {
    flex: 1,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    padding: 10,
    borderRadius: 14,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#3B82F6',
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,  
    height: 20, 
    resizeMode: 'contain',
  },
});

export default InputBar;
