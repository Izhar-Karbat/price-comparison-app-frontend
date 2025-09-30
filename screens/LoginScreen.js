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
import { AuthContext } from '../context/AuthContext'; // Make sure the path is correct

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    await signIn(email, password);
    // In the AuthContext, signIn doesn't need to return anything.
    // The navigation will change automatically when userToken is set.
    // We just need to handle the loading state.
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Welcome!</Text>
        <Text style={styles.subTitle}>Log in to your Metriks account</Text>

        <View style={styles.inputGroup}>
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

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.secondaryButtonText}>Don't have an account? Sign Up</Text>
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
  pageTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 50,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
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
  secondaryButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});