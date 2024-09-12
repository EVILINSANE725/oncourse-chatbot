import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Rubik_400Regular, Rubik_700Bold, useFonts } from '@expo-google-fonts/rubik';
import labTestLogo from '../assets/lab-test-icon.png';
import doctorIcon from '../assets/doctor-icon.png';
import tickIcon from '../assets/win-tick.png';
import Header from '../components/Header';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WinScreen = () => {
  const router = useRouter();
  const { points ,patientDetails} = useLocalSearchParams();
  const [fontsLoaded] = useFonts({ Rubik_400Regular, Rubik_700Bold });
  const [loading, isLoading] = useState(true);

  let parsedPoints = { lab: 0, diagnosis: 0 };

  console.log(patientDetails,"detailss")


  try {
    if (points) {
      parsedPoints = JSON.parse(points);
    }
  } catch (error) {
    console.error('Error parsing points:', error);
  }

  const handleNextPatient = () => {
    router.push('/', { params: { newPatient: "new-patient" } });
  };

  if (!fontsLoaded || loading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      {patientDetails && (
        <Header 
          name={`MR. ARJUN SHARMA 28 Y/O)`}  
          points={`10 points`} 
        />
      )}
      
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Image source={tickIcon} />
          <Text style={styles.yourScore}>Your Score</Text>
          <Text style={styles.score}>{parsedPoints.lab + parsedPoints.diagnosis}/10 Points</Text>
        </View>

        <View style={styles.scoreDetails}>
          <View style={styles.column}>
            <Image source={labTestLogo} style={styles.icon} />
            <Text style={styles.label}>Lab Test</Text>
            <Text style={styles.points}>{parsedPoints.lab}/5 Points</Text>
          </View>

          <View style={styles.column}>
            <Image source={doctorIcon} style={styles.icon} />
            <Text style={styles.label}>Diagnosis</Text>
            <Text style={styles.points}>{parsedPoints.diagnosis}/5 Points</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNextPatient}>
          <Text style={styles.buttonText}>Next Patient</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: "Rubik_400Regular",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    marginVertical: 30,
    gap: 8,
  },
  yourScore: {
    fontSize: 18,
    fontWeight: '500',
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreDetails: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 80,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 28,
    height: 28,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  points: {
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WinScreen;
