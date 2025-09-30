import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TEST: Claymorphism Theme Loaded</Text>
      <View style={styles.testBox}>
        <Text>3D Shadow Test</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F3',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#3A3937',
    marginBottom: 20,
  },
  testBox: {
    width: 200,
    height: 100,
    backgroundColor: '#F7F5F3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4D0CC',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
});