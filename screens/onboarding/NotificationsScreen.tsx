// screens/onboarding/NotificationsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { designTokens } from '../../theme/designTokens';
import { useApp } from '../../context/AppContext'; // Import our new hook

const NotificationsScreen = () => {
  const { completeOnboarding } = useApp(); // Get the function from context

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔔</Text>
        <Text style={styles.title}>Don't miss a deal</Text>
        <Text style={styles.subtitle}>Enable notifications to get alerts on price drops.</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={completeOnboarding}>
          <Text style={styles.buttonText}>Enable Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={completeOnboarding}>
          <Text style={styles.secondaryButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles remain the same...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: designTokens.colors.background, padding: designTokens.spacing.lg, justifyContent: 'space-between', },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', },
    icon: { fontSize: 80, marginBottom: designTokens.spacing.lg, },
    title: { fontSize: designTokens.typography.size.title, fontWeight: designTokens.typography.weight.bold, color: designTokens.colors.primary, textAlign: 'center', marginBottom: designTokens.spacing.md, },
    subtitle: { fontSize: designTokens.typography.size.body, color: designTokens.colors.text, textAlign: 'center', paddingHorizontal: designTokens.spacing.md, },
    button: { backgroundColor: designTokens.colors.primary, padding: designTokens.spacing.md, borderRadius: designTokens.borderRadius.medium, alignItems: 'center', marginBottom: designTokens.spacing.md, },
    buttonText: { color: designTokens.colors.white, fontSize: designTokens.typography.size.button, fontWeight: designTokens.typography.weight.bold, },
    secondaryButton: { alignItems: 'center', },
    secondaryButtonText: { color: designTokens.colors.textSecondary, fontSize: designTokens.typography.size.body, },
});

export default NotificationsScreen;