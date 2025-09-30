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
      case 'Deals':
        return 'pricetag-outline';
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
    { route: 'Deals', isCenter: false },
    { route: 'Scanner', isCenter: true },
    { route: 'Favorites', isCenter: false },
    { route: 'Cart', isCenter: false },
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
    backgroundColor: '#F7F5F3',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    // Enhanced claymorphism shadow
    ...Platform.select({
      ios: {
        shadowColor: '#D4D0CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
    // Inner light border for clay effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(212, 208, 204, 0.3)',
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
    // Enhanced clay shadow
    ...Platform.select({
      ios: {
        shadowColor: '#E19D9D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    // Inner light for 3D effect
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(225, 157, 157, 0.3)',
    borderRightColor: 'rgba(225, 157, 157, 0.3)',
  },
});

export default CustomTabBar;