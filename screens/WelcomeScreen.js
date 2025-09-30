// screens/WelcomeScreen.js1
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// A simple placeholder for the camera icon.
// For a real app, you'd use an actual image asset or an icon library like @expo/vector-icons
const CameraIconPlaceholder = () => (
  <View style={styles.cameraIconCircle}>
    <Text style={styles.cameraIconText}>📷</Text> 
    {/* Or use an <Image source={require('./path/to/your/camera-icon.png')} /> if you have one */}
  </View>
);

export default function WelcomeScreen({ navigation }) {
  const handleContinue = () => {
    navigation.replace('MainApp'); // Navigate to the Tab Navigator
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        <Text style={styles.title}>metriks</Text>

        <View style={styles.iconContainer}>
          <CameraIconPlaceholder />
        </View>

        <Text style={styles.heading}>
          Identify products and find the best prices
        </Text>

        <Text style={styles.description}>
          Search for supermarket, pharma, and electronics products by entering text or uploading an image. Compare local prices and make better shopping decisions.
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around', // Distributes space, pushing button towards bottom
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20, // Adjust as needed
  },
  iconContainer: {
    marginVertical: 30, // Adjust as needed
  },
  cameraIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0', // Light grey background for the circle
    justifyContent: 'center',
    alignItems: 'center',
    // Add shadow if needed, e.g.,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  cameraIconText: {
    fontSize: 60, // Adjust size of emoji/icon
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#007AFF', // A standard blue, adjust to your app's primary color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25, // For a pill shape
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // Ensure some space from the bottom
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});