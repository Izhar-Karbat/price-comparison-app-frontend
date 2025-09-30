import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; // Import the context

// --- GUEST VIEW COMPONENT ---
// This is shown when the user is not logged in
const GuestView = ({ navigation }) => (
  <View style={styles.guestContainer}>
    <Ionicons name="person-circle-outline" size={80} color="#E5E7EB" style={{ marginBottom: 15 }} />
    <Text style={styles.guestTitle}>Your Account</Text>
    <Text style={styles.guestSubtitle}>Log in or create an account to save your lists and get personalized deals.</Text>
    <TouchableOpacity
      style={[styles.button, { marginBottom: 15 }]}
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.buttonText}>Log In</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, styles.secondaryButton]}
      onPress={() => navigation.navigate('SignUp')}
    >
      <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
    </TouchableOpacity>
  </View>
);

// --- LOGGED-IN VIEW COMPONENT ---
// This is the view you already designed
const LoggedInView = ({ username, onLogout }) => {
  const navigation = useNavigation();
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: 'person-outline', onPress: () => navigation.navigate('Profile') },
    { id: 'invitations', label: 'Invitations', icon: 'mail-unread-outline', onPress: () => navigation.navigate('Invitations') },
    { id: 'settings', label: 'Settings', icon: 'settings-outline', onPress: () => navigation.navigate('Settings') },
    { id: 'history', label: 'Transaction History', icon: 'time-outline', onPress: () => Alert.alert('Navigate', 'Not implemented')},
  ];

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', onPress: onLogout, style: 'destructive' },
    ]);
  };

  return (
    <ScrollView>
      <Text style={styles.pageTitle}>Account</Text>
      <View style={styles.profileCard}>
        <Image source={{ uri: `https://via.placeholder.com/100/007AFF/FFFFFF?Text=${username.charAt(0).toUpperCase()}` }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{username}</Text>
        </View>
      </View>
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={item.id} style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]} onPress={item.onPress}>
            <Ionicons name={item.icon} size={24} color="#007AFF" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward-outline" size={22} color="#C7C7CC" />
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


export default function AccountScreen() {
  const { userToken, username, signOut } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {userToken ? (
        <LoggedInView username={username} onLogout={signOut} />
      ) : (
        <GuestView navigation={navigation} />
      )}
    </SafeAreaView>
  );
}

// Combine and adapt styles
const styles = StyleSheet.create({
  // --- Shared Styles ---
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  pageTitle: { fontSize: 30, fontWeight: 'bold', color: '#333333', paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
  // --- Guest View Styles ---
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 25 },
  guestTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  guestSubtitle: { fontSize: 16, color: '#666666', textAlign: 'center', marginBottom: 30 },
  button: { width: '100%', backgroundColor: '#007AFF', borderRadius: 10, paddingVertical: 15, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#E5E7EB' },
  secondaryButtonText: { color: '#007AFF' },
  // --- Logged-In View Styles (from your original file) ---
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginHorizontal: 20, marginBottom: 25, borderWidth: 1, borderColor: '#E5E7EB' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: '#E5E7EB' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600', color: '#333333' },
  menuSection: { backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 20, marginBottom: 25, borderWidth: 1, borderColor: '#E5E7EB' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  menuItemLast: { borderBottomWidth: 0 },
  menuIcon: { marginRight: 18 },
  menuLabel: { flex: 1, fontSize: 17, color: '#333333' },
  logoutSection: { marginHorizontal: 20 },
  logoutButton: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  logoutButtonText: { fontSize: 17, color: '#FF3B30', fontWeight: '500' },
});