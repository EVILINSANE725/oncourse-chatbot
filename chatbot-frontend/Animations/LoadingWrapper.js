import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const ReactNativeSpinner = ({ size = 'large', spinning = true, tip = 'Loading...', children, color }) => {
  return (
    <View style={styles.container}>
      {spinning && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={size} color={ color ? color : "#2A52BB"} />
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  tipText: {
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
});



export default ReactNativeSpinner;
