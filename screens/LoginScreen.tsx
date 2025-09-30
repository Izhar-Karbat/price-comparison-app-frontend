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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { designTokens } from '../theme/designTokens';
import { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const signIn = authContext?.signIn;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    
    if (!signIn) {
      Alert.alert('Error', 'Authentication service is not available.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Mock authentication - in a real app, you'd validate credentials with your backend
      await signIn('mock-token', email.split('@')[0] || 'User');
      // Navigation will happen automatically when userToken is set in AuthContext
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <View style={styles.headerSection}>
            <Text style={styles.pageTitle}>Welcome Back!</Text>
            <Text style={styles.subTitle}>Log in to your PharmMate account</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
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
              <View style={styles.divider} />
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

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={designTokens.colors.white} />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={() => Alert.alert('Coming Soon', 'Password reset functionality is coming soon!')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpLink}>Sign Up</Text>
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
  headerSection: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: designTokens.spacing.xxl,
  },
  pageTitle: {
    fontSize: designTokens.typography.size.heading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.sm,
  },
  subTitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: designTokens.spacing.xl,
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
  input: {
    fontSize: designTokens.typography.size.body,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    color: designTokens.colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: designTokens.colors.gray.light,
    marginLeft: designTokens.spacing.lg,
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
  forgotPassword: {
    alignItems: 'center',
    marginTop: designTokens.spacing.lg,
  },
  forgotPasswordText: {
    color: designTokens.colors.primary,
    fontSize: designTokens.typography.size.small,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: designTokens.spacing.xxl,
  },
  footerText: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.size.body,
    marginRight: designTokens.spacing.xs,
  },
  signUpLink: {
    color: designTokens.colors.primary,
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.semibold,
  },
});