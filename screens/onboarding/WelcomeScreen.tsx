// screens/onboarding/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { designTokens } from '../../theme/designTokens';
import { OnboardingStackParamList } from '../../navigation/types';

type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* <Image source={require('../../assets/icon.png')} style={styles.logo} /> */}
        <Text style={styles.logo}>💊</Text>
        <Text style={styles.title}>Welcome to PharmMate</Text>
        <Text style={styles.subtitle}>
          Your smart companion for fighting overpricing and making informed choices.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Preferences')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: designTokens.colors.background, padding: designTokens.spacing.lg, justifyContent: 'space-between', },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', },
  logo: { fontSize: 80, marginBottom: designTokens.spacing.lg, },
  title: { fontSize: designTokens.typography.size.title, fontWeight: designTokens.typography.weight.bold, color: designTokens.colors.primary, textAlign: 'center', marginBottom: designTokens.spacing.md, },
  subtitle: { fontSize: designTokens.typography.size.body, color: designTokens.colors.text, textAlign: 'center', paddingHorizontal: designTokens.spacing.md, },
  button: { backgroundColor: designTokens.colors.primary, padding: designTokens.spacing.md, borderRadius: designTokens.borderRadius.medium, alignItems: 'center', },
  buttonText: { color: designTokens.colors.white, fontSize: designTokens.typography.size.button, fontWeight: designTokens.typography.weight.bold, },
});

export default WelcomeScreen;