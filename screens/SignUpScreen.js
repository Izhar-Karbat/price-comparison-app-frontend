import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext'; // Make sure the path is correct

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useContext(AuthContext);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    // The signUp function will handle navigation or show an alert on its own
    await signUp(username, email, password);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Create Account</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#C7C7CC"
          />
          <View style={styles.divider} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#C7C7CC"
          />
          <View style={styles.divider} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#C7C7CC"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Styles adapted from SettingsScreen.js
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 15 : 10,
    paddingBottom: 5,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    padding: 5,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 20,
    marginBottom: 25,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  inputGroup: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  input: {
    fontSize: 17,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#333333',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});