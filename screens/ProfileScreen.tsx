// screens/ProfileScreen.tsx
// (Using the full code from our previous implementation)
import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { designTokens } from '../theme/designTokens';
import ProfileListItem from '../components/profile/ProfileListItem';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const handlePress = (action: string) => Alert.alert('Navigate', `This would navigate to ${action}.`);
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}><Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar}/><Text style={styles.name}>Izhar Karbat</Text></View>
      <View style={styles.menuSection}><ProfileListItem label="Saved Items" icon="💾" onPress={() => navigation.navigate('SavedItems')} /><ProfileListItem label="Manage Preferences" icon="⚙️" onPress={() => handlePress('Preferences')} /></View>
      <View style={styles.menuSection}><ProfileListItem label="Logout" icon="🚪" onPress={() => Alert.alert('Logout', 'Are you sure?')} isDestructive={true} /></View>
    </View>
  );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: designTokens.colors.background, },
    profileHeader: { backgroundColor: designTokens.colors.white, alignItems: 'center', padding: designTokens.spacing.xl, borderBottomWidth: 1, borderBottomColor: designTokens.colors.gray.light, },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: designTokens.spacing.md, },
    name: { fontSize: designTokens.typography.size.title, fontWeight: designTokens.typography.weight.bold, color: designTokens.colors.text, },
    menuSection: { marginTop: designTokens.spacing.lg, backgroundColor: designTokens.colors.white, },
});
export default ProfileScreen;