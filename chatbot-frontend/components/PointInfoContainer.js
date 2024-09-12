import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import infoImage from '../assets/info-icon.png'

export default function PointInfoContainer({ points ,isHeader}) {
  return (
    <View style={isHeader ? styles.pointsContainer : styles.pointsContainerMessage}>
      <Text style={styles.pointsText}>{points}</Text>
      <Image source={infoImage}/>
    </View>
  );
}

const styles = StyleSheet.create({
  pointsContainer: {
    flexDirection: 'row',
    backgroundColor: "#3D78EA",
    borderRadius: 50,
    padding: 8,
    gap:4

  },
  pointsContainerMessage: {
    flexDirection: 'row',
    backgroundColor: "#3D78EA",
    borderRadius: 50,
    padding: 6,
    gap:4,

  },
  pointsText: {
    color: "#FFF",
    fontFamily: "Rubik_400Regular",
  },
});
