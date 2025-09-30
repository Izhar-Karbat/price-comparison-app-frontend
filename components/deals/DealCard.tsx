import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Deal } from '../../services/api';

interface DealCardProps {
  deal: Deal;
  onPress?: (deal: Deal) => void;
  style?: any;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress?.(deal)}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      {/* Deal Image */}
      {deal.image_url ? (
        <Image
          source={{ uri: deal.image_url }}
          style={styles.dealImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.dealImage, styles.placeholderImage]}>
          <Ionicons name="pricetag" size={40} color="#F4B2B2" />
        </View>
      )}

      {/* Deal Content */}
      <View style={styles.content}>
        {/* Retailer Badge */}
        <View style={styles.retailerBadge}>
          <Ionicons name="storefront-outline" size={12} color="#8A8680" />
          <Text style={styles.retailerName} numberOfLines={1}>
            {deal.retailer_name}
          </Text>
        </View>

        {/* Deal Title */}
        <Text style={styles.dealTitle} numberOfLines={2}>
          {deal.title}
        </Text>

        {/* Deal Description */}
        <Text style={styles.dealDescription} numberOfLines={2}>
          {deal.description}
        </Text>

        {/* CTA Arrow */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>View Deal</Text>
          <Ionicons name="chevron-forward" size={16} color="#F4B2B2" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#D4A5A5',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dealImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F7F5F3',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  retailerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  retailerName: {
    fontSize: 11,
    color: '#8A8680',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
    fontWeight: '600',
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3937',
    marginBottom: 6,
    lineHeight: 22,
  },
  dealDescription: {
    fontSize: 13,
    color: '#6B6864',
    lineHeight: 18,
    marginBottom: 12,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F4B2B2',
    marginRight: 4,
  },
});

export default DealCard;