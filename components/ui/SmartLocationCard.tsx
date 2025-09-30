// components/ui/SmartLocationCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';
import { useLocation } from '../../hooks/useLocation';
import { storeService } from '../../services/storeService';

interface StoreLocation {
  storeName: string;
  retailerName: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // in km
  price: number;
}

interface SmartLocationCardProps {
  store: StoreLocation;
  onNavigate?: () => void;
  showMap?: boolean;
}

const SmartLocationCard: React.FC<SmartLocationCardProps> = ({
  store,
  onNavigate,
  showMap = true,
}) => {
  const { location } = useLocation();
  const [walkingTime, setWalkingTime] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Calculate distance if we have both locations
    if (location && store.latitude && store.longitude) {
      const distance = storeService.calculateDistance(
        location.latitude,
        location.longitude,
        store.latitude,
        store.longitude
      );
      setCalculatedDistance(distance);

      // Calculate walking time (average walking speed: 5 km/h)
      const timeInMinutes = Math.round((distance / 5) * 60);
      setWalkingTime(`${timeInMinutes} min walk`);
    } else if (store.distance) {
      // Use provided distance if available
      const timeInMinutes = Math.round((store.distance / 5) * 60);
      setWalkingTime(`${timeInMinutes} min walk`);
    }

    // Entrance animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Pulse animation for nearest store
    const distanceToUse = calculatedDistance ?? store.distance;
    if (distanceToUse && distanceToUse < 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [calculatedDistance, store.distance, location]);

  const handleNavigate = () => {
    if (store.latitude && store.longitude) {
      const scheme = Platform.select({
        ios: 'maps:',
        android: 'geo:',
      });
      const url = Platform.select({
        ios: `${scheme}${store.latitude},${store.longitude}?q=${encodeURIComponent(store.storeName)}`,
        android: `${scheme}${store.latitude},${store.longitude}?q=${encodeURIComponent(store.storeName)}`,
      });
      
      Linking.openURL(url!);
      onNavigate?.();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getDistanceColor = () => {
    const distance = calculatedDistance ?? store.distance;
    if (!distance) return designTokens.colors.textSecondary;
    if (distance < 0.5) return designTokens.colors.success;
    if (distance < 2) return designTokens.colors.primary;
    return designTokens.colors.textSecondary;
  };

  const expandHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.9}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="location"
              size={24}
              color={designTokens.colors.white}
            />
          </View>
          
          <View style={styles.info}>
            <Text style={styles.label}>Nearest Store</Text>
            <Text style={styles.storeName} numberOfLines={1}>
              {store.retailerName} - {store.storeName}
            </Text>
            <View style={styles.distanceRow}>
              {(calculatedDistance || store.distance) && (
                <>
                  <Text style={[styles.distance, { color: getDistanceColor() }]}>
                    {(() => {
                      const distance = calculatedDistance ?? store.distance!;
                      return distance < 1
                        ? `${(distance * 1000).toFixed(0)}m`
                        : `${distance.toFixed(1)}km`;
                    })()}
                  </Text>
                  {walkingTime && (
                    <>
                      <Text style={styles.separator}>•</Text>
                      <Ionicons
                        name="walk"
                        size={14}
                        color={designTokens.colors.textSecondary}
                      />
                      <Text style={styles.walkTime}>{walkingTime}</Text>
                    </>
                  )}
                </>
              )}
              <Text style={styles.separator}>•</Text>
              <Text style={styles.price}>₪{store.price.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.navigateButton}
            onPress={handleNavigate}
          >
            <Ionicons
              name="navigate"
              size={20}
              color={designTokens.colors.white}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.expandedContent, { height: expandHeight }]}>
        {showMap && store.latitude && store.longitude && (
          <TouchableOpacity onPress={handleNavigate}>
            <View style={styles.mapPreview}>
              <Text style={styles.mapPlaceholder}>Map Preview</Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.addressContainer}>
          <Ionicons
            name="business"
            size={14}
            color={designTokens.colors.textSecondary}
          />
          <Text style={styles.address}>
            {store.address}, {store.city}
          </Text>
        </View>
      </Animated.View>

      {(calculatedDistance ?? store.distance) && (calculatedDistance ?? store.distance!) < 0.5 && (
        <View style={styles.nearbyBadge}>
          <Text style={styles.nearbyText}>Very Close!</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: designTokens.colors.cardBackground,
    borderRadius: designTokens.borderRadius.card,
    marginHorizontal: designTokens.spacing.md,
    marginTop: designTokens.spacing.md,
    borderWidth: 1,
    borderColor: designTokens.colors.cardBorder,
    ...designTokens.shadows.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
    ...designTokens.shadows.sm,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: designTokens.typography.size.caption,
    color: designTokens.colors.textSecondary,
    marginBottom: 2,
    fontWeight: designTokens.typography.weight.medium,
    letterSpacing: designTokens.typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  storeName: {
    fontSize: designTokens.typography.size.subheading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginBottom: 4,
    lineHeight: designTokens.typography.lineHeight.tight * designTokens.typography.size.subheading,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distance: {
    fontSize: designTokens.typography.size.small,
    fontWeight: designTokens.typography.weight.semibold,
  },
  separator: {
    color: designTokens.colors.gray.medium,
    fontSize: designTokens.typography.size.small,
  },
  walkTime: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
  },
  price: {
    fontSize: designTokens.typography.size.small,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.primary,
  },
  navigateButton: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.button,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.shadows.primary,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  mapPreview: {
    width: '100%',
    height: 100,
    backgroundColor: designTokens.colors.gray.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    paddingTop: designTokens.spacing.sm,
    gap: 6,
  },
  address: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
    flex: 1,
  },
  nearbyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: designTokens.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: designTokens.borderRadius.button,
    ...designTokens.shadows.success,
  },
  nearbyText: {
    color: designTokens.colors.white,
    fontSize: 10,
    fontWeight: designTokens.typography.weight.bold,
  },
});

export default SmartLocationCard;