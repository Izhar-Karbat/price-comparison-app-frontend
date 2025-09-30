import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { designTokens } from '../theme/designTokens';
import { RootStackParamList } from '../navigation/types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsHeaderItem {
  id: string;
  type: 'header';
  marginTop?: number;
}

interface SettingsActionItem {
  id: string;
  label: string;
  type?: never;
  currentValue?: string;
  hasArrow?: boolean;
  isToggle?: false;
  onPress: () => void;
}

interface SettingsToggleItem {
  id: string;
  label: string;
  type?: never;
  isToggle: true;
  toggleValue: boolean;
  onToggle: () => void;
}

type SettingsItem = SettingsHeaderItem | SettingsActionItem | SettingsToggleItem;

// Mock language - replace with actual i18n or state management later
const MOCK_CURRENT_LANGUAGE = 'English';

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

  const settingsItems: SettingsItem[] = [
    {
      id: 'profileHeader',
      type: 'header',
    },
    {
      id: 'editProfile',
      label: 'Edit Profile',
      onPress: () => Alert.alert('Coming Soon', 'Edit Profile feature is coming soon!'),
    },
    {
      id: 'changePassword',
      label: 'Change Password',
      hasArrow: true,
      onPress: () => Alert.alert('Coming Soon', 'Change Password feature is coming soon!'),
    },
    {
      id: 'languageHeader',
      type: 'header',
      marginTop: 20,
    },
    {
      id: 'language',
      label: 'Language',
      currentValue: MOCK_CURRENT_LANGUAGE,
      hasArrow: true,
      onPress: () => Alert.alert('Coming Soon', 'Language Settings feature is coming soon!'),
    },
    {
      id: 'notifications',
      label: 'Push Notifications',
      isToggle: true,
      toggleValue: notificationsEnabled,
      onToggle: toggleNotifications,
    },
    {
      id: 'moreHeader',
      type: 'header',
      marginTop: 20,
    },
    {
      id: 'about',
      label: 'About PharmMate',
      hasArrow: true,
      onPress: () => Alert.alert('About PharmMate', 'PharmMate helps you find and compare pharmaceutical products across different retailers for the best prices and health-conscious choices.'),
    },
    {
      id: 'help',
      label: 'Help & Support',
      hasArrow: true,
      onPress: () => Alert.alert('Help & Support', 'Need help? Contact us at support@pharmmate.com'),
    },
    {
      id: 'privacyPolicy',
      label: 'Privacy Policy',
      hasArrow: true,
      onPress: () => Alert.alert('Privacy Policy', 'Privacy Policy feature is coming soon!'),
    },
    {
      id: 'termsOfService',
      label: 'Terms of Service',
      hasArrow: true,
      onPress: () => Alert.alert('Terms of Service', 'Terms of Service feature is coming soon!'),
    },
  ];

  const renderSettingsItem = (item: SettingsItem, index: number) => {
    if (item.type === 'header') {
      return <View key={item.id} style={{ height: item.marginTop || 0 }} />;
    }

    const isFirstInGroup = index === 0 || settingsItems[index - 1]?.type === 'header';
    const isLastInGroup = index === settingsItems.length - 1 || settingsItems[index + 1]?.type === 'header';
    const nextItem = settingsItems[index + 1];
    const showDivider = !isLastInGroup && !(nextItem?.type === 'header' && nextItem.marginTop);

    return (
      <View key={item.id}>
        <View style={[
          styles.menuItemGroup,
          isFirstInGroup && styles.menuItemGroupFirst,
          isLastInGroup && styles.menuItemGroupLast,
        ]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={item.isToggle ? undefined : item.onPress}
            disabled={item.isToggle}
            activeOpacity={item.isToggle ? 1 : 0.7}
          >
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRightContainer}>
              {'currentValue' in item && item.currentValue && (
                <Text style={styles.menuValue}>{item.currentValue}</Text>
              )}
              {item.isToggle ? (
                <Switch
                  trackColor={{ false: designTokens.colors.gray.medium, true: designTokens.colors.success }}
                  thumbColor={item.toggleValue ? designTokens.colors.white : designTokens.colors.gray.light}
                  ios_backgroundColor={designTokens.colors.gray.light}
                  onValueChange={item.onToggle}
                  value={item.toggleValue}
                />
              ) : ('hasArrow' in item && item.hasArrow) ? (
                <Ionicons name="chevron-forward-outline" size={22} color={designTokens.colors.gray.medium} />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        {showDivider && (
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={designTokens.colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Settings</Text>

        <View style={styles.settingsContainer}>
          {settingsItems.map(renderSettingsItem)}
        </View>

        {/* App Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>PharmMate v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for your health</Text>
        </View>
      </ScrollView>
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
    padding: designTokens.spacing.xs,
  },
  pageTitle: {
    fontSize: designTokens.typography.size.heading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xl,
    marginTop: designTokens.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: designTokens.spacing.xl,
  },
  settingsContainer: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  menuItemGroup: {
    backgroundColor: designTokens.colors.cardBackground,
    marginBottom: 1, // Small gap between items in same group
    ...designTokens.shadows.sm,
  },
  menuItemGroupFirst: {
    borderTopLeftRadius: designTokens.borderRadius.large,
    borderTopRightRadius: designTokens.borderRadius.large,
    marginTop: designTokens.spacing.md,
  },
  menuItemGroupLast: {
    borderBottomLeftRadius: designTokens.borderRadius.large,
    borderBottomRightRadius: designTokens.borderRadius.large,
    marginBottom: designTokens.spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    minHeight: 48,
  },
  dividerContainer: {
    backgroundColor: designTokens.colors.cardBackground,
    paddingLeft: designTokens.spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: designTokens.colors.gray.light,
  },
  menuLabel: {
    flex: 1,
    fontSize: designTokens.typography.size.button,
    color: designTokens.colors.text,
  },
  menuRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginRight: designTokens.spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.lg,
  },
  versionText: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  versionSubtext: {
    fontSize: designTokens.typography.size.caption,
    color: designTokens.colors.textSecondary,
  },
});