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
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { designTokens } from '../theme/designTokens';
import { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const signIn = authContext?.signIn; // Using signIn since signUp doesn't exist in AuthContext

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
      return;
    }

    if (!signIn) {
      Alert.alert('Error', 'Authentication service is not available.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Mock signup - in a real app, you'd create account with your backend
      // For now, we'll just sign them in directly after "creating" the account
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      await signIn('mock-token', username);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Sign Up Failed', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={designTokens.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Create Account</Text>
          <Text style={styles.subTitle}>Join PharmMate to start your wellness journey</Text>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={designTokens.colors.gray.dark} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={designTokens.colors.gray.dark}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={designTokens.colors.gray.dark} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={designTokens.colors.gray.dark}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={designTokens.colors.gray.dark} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={designTokens.colors.gray.dark}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={designTokens.colors.gray.dark} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={designTokens.colors.gray.dark}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleSignUp} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={designTokens.colors.white} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.termsSection}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink} onPress={() => Alert.alert('Terms', 'Terms of Service')}>
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text style={styles.termsLink} onPress={() => Alert.alert('Privacy', 'Privacy Policy')}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.sm,
    paddingTop: Platform.OS === 'android' ? 15 : 10,
    paddingBottom: 5,
    backgroundColor: designTokens.colors.background,
  },
  backButton: {
    padding: designTokens.spacing.sm,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: designTokens.spacing.xl,
  },
  pageTitle: {
    fontSize: designTokens.typography.size.heading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
    marginTop: designTokens.spacing.sm,
  },
  subTitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xl,
  },
  formSection: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  inputGroup: {
    backgroundColor: designTokens.colors.cardBackground,
    borderRadius: designTokens.borderRadius.large,
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadows.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
  },
  inputIcon: {
    marginRight: designTokens.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: designTokens.typography.size.body,
    paddingVertical: designTokens.spacing.md,
    color: designTokens.colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: designTokens.colors.gray.light,
    marginLeft: designTokens.spacing.lg + 28, // Align with input text
  },
  button: {
    backgroundColor: designTokens.colors.primary,
    borderRadius: designTokens.borderRadius.medium,
    paddingVertical: designTokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: designTokens.spacing.sm,
    ...designTokens.shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.button,
    fontWeight: designTokens.typography.weight.semibold,
  },
  termsSection: {
    marginTop: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.md,
  },
  termsText: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.typography.weight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: designTokens.spacing.xl,
  },
  footerText: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.size.body,
    marginRight: designTokens.spacing.xs,
  },
  loginLink: {
    color: designTokens.colors.primary,
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.semibold,
  },
});