import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { designTokens } from '../theme/designTokens';
import { MainAppScreenProps, RootStackParamList } from '../navigation/types';

type Props = MainAppScreenProps<'Account'>;

// --- GUEST VIEW COMPONENT ---
// This is shown when the user is not logged in
const GuestView = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={styles.guestContainer}>
      <Ionicons 
        name="person-circle-outline" 
        size={80} 
        color={designTokens.colors.gray.medium} 
        style={styles.guestIcon} 
      />
      <Text style={styles.guestTitle}>Your Account</Text>
      <Text style={styles.guestSubtitle}>
        Log in or create an account to save your lists and get personalized deals.
      </Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.secondaryButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- LOGGED-IN VIEW COMPONENT ---
// This is the view shown when the user is authenticated
const LoggedInView = ({ username, onLogout }: { username: string; onLogout: () => void }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const menuItems = [
    { 
      id: 'invitations', 
      label: 'Invitations', 
      icon: 'mail-unread-outline' as const, 
      onPress: () => navigation.navigate('Invitations') 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: 'settings-outline' as const, 
      onPress: () => navigation.navigate('Settings') 
    },
    { 
      id: 'history', 
      label: 'Transaction History', 
      icon: 'time-outline' as const, 
      onPress: () => Alert.alert('Coming Soon', 'Transaction history is coming soon!')
    },
  ];

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', onPress: onLogout, style: 'destructive' },
    ]);
  };

  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Account</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{username}</Text>
        </View>
      </View>
      
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.menuItem, 
              index === menuItems.length - 1 && styles.menuItemLast
            ]} 
            onPress={item.onPress}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={designTokens.colors.primary} 
              style={styles.menuIcon} 
            />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons 
              name="chevron-forward-outline" 
              size={22} 
              color={designTokens.colors.gray.medium} 
            />
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default function AccountScreen({ }: Props) {
  const authContext = useContext(AuthContext);
  const userToken = authContext?.userToken;
  const username = authContext?.username;
  const signOut = authContext?.signOut;

  return (
    <SafeAreaView style={styles.safeArea}>
      {userToken ? (
        <LoggedInView username={username || 'User'} onLogout={signOut || (() => {})} />
      ) : (
        <GuestView />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- Shared Styles ---
  safeArea: { 
    flex: 1, 
    backgroundColor: designTokens.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  pageTitle: { 
    fontSize: designTokens.typography.size.heading, 
    fontWeight: designTokens.typography.weight.bold, 
    color: designTokens.colors.text, 
    paddingHorizontal: designTokens.spacing.lg, 
    paddingTop: designTokens.spacing.lg, 
    marginBottom: designTokens.spacing.lg,
  },
  
  // --- Guest View Styles ---
  guestContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: designTokens.spacing.xl,
  },
  guestIcon: {
    marginBottom: designTokens.spacing.md,
  },
  guestTitle: { 
    fontSize: designTokens.typography.size.title, 
    fontWeight: designTokens.typography.weight.bold, 
    marginBottom: designTokens.spacing.sm,
    color: designTokens.colors.text,
  },
  guestSubtitle: { 
    fontSize: designTokens.typography.size.body, 
    color: designTokens.colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: designTokens.spacing.xl,
    lineHeight: 22,
  },
  primaryButton: { 
    width: '100%', 
    backgroundColor: designTokens.colors.primary, 
    borderRadius: designTokens.borderRadius.medium, 
    paddingVertical: designTokens.spacing.md, 
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  primaryButtonText: { 
    color: designTokens.colors.white, 
    fontSize: designTokens.typography.size.button, 
    fontWeight: designTokens.typography.weight.semibold,
  },
  secondaryButton: { 
    width: '100%',
    backgroundColor: designTokens.colors.cardBackground, 
    borderRadius: designTokens.borderRadius.medium, 
    paddingVertical: designTokens.spacing.md, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: designTokens.colors.accent,
  },
  secondaryButtonText: { 
    color: designTokens.colors.primary,
    fontSize: designTokens.typography.size.button, 
    fontWeight: designTokens.typography.weight.semibold,
  },
  
  // --- Logged-In View Styles ---
  profileCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: designTokens.colors.cardBackground, 
    borderRadius: designTokens.borderRadius.large, 
    padding: designTokens.spacing.lg, 
    marginHorizontal: designTokens.spacing.lg, 
    marginBottom: designTokens.spacing.xl, 
    ...designTokens.shadows.sm,
  },
  avatarContainer: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: designTokens.spacing.md, 
    backgroundColor: designTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: designTokens.typography.size.title,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.white,
  },
  profileInfo: { 
    flex: 1,
  },
  profileName: { 
    fontSize: designTokens.typography.size.large, 
    fontWeight: designTokens.typography.weight.semibold, 
    color: designTokens.colors.text,
  },
  menuSection: { 
    backgroundColor: designTokens.colors.cardBackground, 
    borderRadius: designTokens.borderRadius.large, 
    marginHorizontal: designTokens.spacing.lg, 
    marginBottom: designTokens.spacing.xl, 
    ...designTokens.shadows.sm,
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: designTokens.spacing.md, 
    paddingHorizontal: designTokens.spacing.lg, 
    borderBottomWidth: 1, 
    borderBottomColor: designTokens.colors.gray.light,
  },
  menuItemLast: { 
    borderBottomWidth: 0,
  },
  menuIcon: { 
    marginRight: designTokens.spacing.md,
  },
  menuLabel: { 
    flex: 1, 
    fontSize: designTokens.typography.size.button, 
    color: designTokens.colors.text,
  },
  logoutSection: { 
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xl,
  },
  logoutButton: { 
    backgroundColor: designTokens.colors.cardBackground, 
    borderRadius: designTokens.borderRadius.large, 
    paddingVertical: designTokens.spacing.md, 
    alignItems: 'center', 
    ...designTokens.shadows.sm,
  },
  logoutButtonText: { 
    fontSize: designTokens.typography.size.button, 
    color: designTokens.colors.danger, 
    fontWeight: designTokens.typography.weight.medium,
  },
});