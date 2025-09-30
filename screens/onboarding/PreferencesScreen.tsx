// screens/onboarding/PreferencesScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { designTokens } from '../../theme/designTokens';
import { OnboardingStackParamList } from '../../navigation/types';

type PreferencesScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Preferences'>;

const PHARMACY_OPTIONS = [
  { id: 'super_pharm', name: 'Super Pharm', emoji: '🏥' },
  { id: 'be_pharm', name: 'Be Pharm', emoji: '💊' },
  { id: 'good_pharm', name: 'Good Pharm', emoji: '🩺' }
];

const PreferencesScreen = () => {
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('');

  const selectPharmacy = async (pharmacyId: string) => {
    setSelectedPharmacy(pharmacyId);
    try {
      await AsyncStorage.setItem('@preferredPharmacy', pharmacyId);
    } catch (error) {
      console.error('Failed to save preferred pharmacy:', error);
    }
  };

  const handleNext = () => {
    if (selectedPharmacy) {
      navigation.navigate('Notifications');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Which pharmacy retailer do you usually shop at?</Text>
        <Text style={styles.subtitle}>We'll use this to calculate your savings when you find better deals!</Text>

        <View style={styles.optionsContainer}>
          {PHARMACY_OPTIONS.map((pharmacy) => (
            <TouchableOpacity
              key={pharmacy.id}
              style={[
                styles.pharmacyOption,
                selectedPharmacy === pharmacy.id && styles.pharmacyOptionSelected
              ]}
              onPress={() => selectPharmacy(pharmacy.id)}
            >
              <Text style={styles.pharmacyEmoji}>{pharmacy.emoji}</Text>
              <Text style={[
                styles.pharmacyText,
                selectedPharmacy === pharmacy.id && styles.pharmacyTextSelected
              ]}>
                {pharmacy.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !selectedPharmacy && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!selectedPharmacy}
      >
        <Text style={[styles.buttonText, !selectedPharmacy && styles.buttonTextDisabled]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designTokens.colors.background,
        padding: designTokens.spacing.lg,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: designTokens.typography.size.title,
        fontWeight: designTokens.typography.weight.bold,
        color: designTokens.colors.primary,
        textAlign: 'center',
        marginTop: designTokens.spacing.xl,
        marginBottom: designTokens.spacing.md
    },
    subtitle: {
        fontSize: designTokens.typography.size.body,
        color: designTokens.colors.text,
        textAlign: 'center',
        marginBottom: designTokens.spacing.xl,
        paddingHorizontal: designTokens.spacing.md
    },
    optionsContainer: {
        gap: designTokens.spacing.md
    },
    pharmacyOption: {
        backgroundColor: designTokens.colors.gray.light,
        borderRadius: designTokens.borderRadius.medium,
        padding: designTokens.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent'
    },
    pharmacyOptionSelected: {
        backgroundColor: designTokens.colors.accent,
        borderColor: designTokens.colors.primary
    },
    pharmacyEmoji: {
        fontSize: 32,
        marginRight: designTokens.spacing.md
    },
    pharmacyText: {
        fontSize: designTokens.typography.size.body,
        fontWeight: designTokens.typography.weight.medium,
        color: designTokens.colors.text
    },
    pharmacyTextSelected: {
        color: designTokens.colors.white,
        fontWeight: designTokens.typography.weight.bold
    },
    button: {
        backgroundColor: designTokens.colors.primary,
        padding: designTokens.spacing.md,
        borderRadius: designTokens.borderRadius.medium,
        alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: designTokens.colors.gray.light
    },
    buttonText: {
        color: designTokens.colors.white,
        fontSize: designTokens.typography.size.button,
        fontWeight: designTokens.typography.weight.bold
    },
    buttonTextDisabled: {
        color: designTokens.colors.gray.dark
    }
});

export default PreferencesScreen;