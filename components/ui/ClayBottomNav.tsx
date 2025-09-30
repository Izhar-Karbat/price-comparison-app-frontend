import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ClayBottomNavProps {
  onMenuPress?: () => void;
  onScanPress?: () => void;
  onFavoritesPress?: () => void;
  activeTab?: 'menu' | 'scan' | 'favorites';
}

const ClayBottomNav: React.FC<ClayBottomNavProps> = ({
  onMenuPress,
  onScanPress,
  onFavoritesPress,
  activeTab = 'scan',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {/* Menu Button */}
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'menu' && styles.activeButton]}
          onPress={onMenuPress}
          activeOpacity={0.8}
        >
          <Ionicons
            name="menu"
            size={24}
            color={activeTab === 'menu' ? '#8FBF9F' : '#8A8680'}
          />
        </TouchableOpacity>

        {/* Camera/Scan Button - Prominent */}
        <TouchableOpacity
          style={styles.scanButtonContainer}
          onPress={onScanPress}
          activeOpacity={0.9}
        >
          <View style={styles.scanButton}>
            <Ionicons name="camera" size={28} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Favorites Button */}
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'favorites' && styles.activeButton]}
          onPress={onFavoritesPress}
          activeOpacity={0.8}
        >
          <Ionicons
            name="heart-outline"
            size={24}
            color={activeTab === 'favorites' ? '#8FBF9F' : '#8A8680'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#D4A5A5',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  navButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(143, 191, 159, 0.1)',
    borderRadius: 15,
  },
  scanButtonContainer: {
    marginTop: -30,
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F4B2B2',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#F4B2B2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default ClayBottomNav;