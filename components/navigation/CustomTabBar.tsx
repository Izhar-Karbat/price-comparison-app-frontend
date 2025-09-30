import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Text,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { claymorphismTheme } from '../../themes/claymorphism';
import { useCart } from '../../context/CartContext';

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const theme = claymorphismTheme;
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  const getIconName = (routeName: string): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case 'Home':
        return 'list-outline';
      case 'Scanner':
        return 'camera';
      case 'Favorites':
        return 'heart-outline';
      case 'Cart':
        return 'cart-outline';
      case 'Account':
        return 'person-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const handlePress = (routeName: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeName,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const renderButton = (
    routeName: string,
    index: number,
    isFocused: boolean,
    isCenter: boolean = false
  ) => {
    const iconName = getIconName(routeName);
    const buttonStyle = isCenter
      ? styles.centerButton
      : styles.sideButton;
    const showBadge = routeName === 'Cart' && cartCount > 0;

    return (
      <TouchableOpacity
        onPress={() => handlePress(routeName, isFocused)}
        activeOpacity={0.9}
        style={styles.touchable}
      >
        <View style={buttonStyle}>
          <Ionicons
            name={iconName}
            size={isCenter ? 24 : 20}
            color={
              isCenter
                ? '#FFFFFF'
                : isFocused
                  ? '#8FBF9F'
                  : '#8A8680'
            }
          />
          {showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Get current route
  const currentRoute = state.routes[state.index].name;

  const buttons = [
    { route: 'Home', isCenter: false },
    { route: 'Cart', isCenter: false },
    { route: 'Scanner', isCenter: true },
    { route: 'Favorites', isCenter: false },
    { route: 'Account', isCenter: false },
  ];

  return (
    <View style={styles.absoluteContainer}>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {buttons.map((button, index) => {
            const isFocused = currentRoute === button.route;
            if (button.isCenter) {
              return (
                <View key={button.route} style={styles.centerButtonWrapper}>
                  {renderButton(button.route, index, isFocused, true)}
                </View>
              );
            }
            return (
              <View key={button.route} style={{ flex: 0 }}>
                {renderButton(button.route, index, isFocused, false)}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  container: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  centerButtonWrapper: {
    marginTop: -20,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F4B2B2',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#F4B2B2',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

export default CustomTabBar;