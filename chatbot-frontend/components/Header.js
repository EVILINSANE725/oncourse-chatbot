import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PointInfoContainer from './PointInfoContainer';
import headerLogo from '../assets/header-logo.png'

const Header = ({ name, points }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLogo}>
      <Image source={headerLogo}/>  
      <Text style={styles.patientName}>{name}</Text>
      </View>
      <PointInfoContainer points={points}/>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1C91F2',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Rubik_700Bold',
  },
  headerLogo:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:6

  },
  patientName: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
  },
  pointsContainer: {
    backgroundColor: '#3D78EA',
    borderRadius: 50,
    padding: 8,
  },
  pointsText: {
    color: '#FFF',
    fontFamily: 'Rubik_400Regular',
  },
});

export default Header;
