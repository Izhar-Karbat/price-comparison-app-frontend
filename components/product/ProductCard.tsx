// components/product/ProductCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import HealthScoreBadge from './HealthScoreBadge';
import { Product } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';

interface ProductCardProps {
  product: Product & {
    retailer_count?: number;
    retailers?: string[];
    store_count?: number;
  };
  onPress: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { theme } = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Blurhash placeholder for smooth loading
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const productId = product.product_id?.toString() || product.masterproductid || '0';
  const isProductFavorite = isFavorite(productId);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation(); // Prevent triggering the main onPress

    if (isProductFavorite) {
      removeFavorite(productId);
    } else {
      addFavorite(product);
    }
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.cardBackground }, theme.shadows.card]} onPress={() => onPress(product)}>
      <Image
        source={{ uri: product.imageUrl || product.image_url }}
        style={[styles.image, { backgroundColor: theme.colors.gray.light }]}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={300}
      />
      {product.promotions && product.promotions.length > 0 && (
        <View style={[styles.promotionIndicator, { backgroundColor: theme.colors.primary }, theme.shadows.floating]}>
          <Ionicons name="pricetag" size={14} color={theme.colors.white} />
        </View>
      )}
      <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: theme.colors.white }, theme.shadows.floating]} onPress={handleFavoritePress}>
        <Ionicons
          name={isProductFavorite ? "heart" : "heart-outline"}
          size={18}
          color={isProductFavorite ? theme.colors.danger : theme.colors.textSecondary}
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={[styles.brand, { color: theme.colors.textSecondary }]} numberOfLines={1}>{product.brand}</Text>
        <Text style={[styles.productName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {product.productName || product.name}
        </Text>

        {/* Multi-retailer badge */}
        {product.retailer_count && product.retailer_count > 1 && (
          <View style={[styles.multiRetailerBadge, { backgroundColor: theme.colors.success }]}>
            <Text style={[styles.multiRetailerText, { color: theme.colors.white }]}>
              Available at {product.retailer_count} retailers
            </Text>
          </View>
        )}

        {/* Retailers list */}
        {product.retailers && product.retailers.length > 0 && (
          <Text style={[styles.retailersList, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {product.retailers.join(' • ')}
          </Text>
        )}

        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            {product.price && !isNaN(product.price) && product.price > 0 ? (
              <Text style={[styles.price, { color: theme.colors.priceTag }]}>
                From ₪{product.price.toFixed(2)}
              </Text>
            ) : product.lowest_price && !isNaN(product.lowest_price) && product.lowest_price > 0 ? (
              <Text style={[styles.price, { color: theme.colors.priceTag }]}>
                From ₪{product.lowest_price.toFixed(2)}
              </Text>
            ) : (
              <Text style={[styles.price, { color: theme.colors.textSecondary, fontStyle: 'italic' }]}>
                Price unavailable
              </Text>
            )}
            {product.store_count && (
              <Text style={[styles.storeCount, { color: theme.colors.textSecondary }]}>
                in {product.store_count} stores
              </Text>
            )}
          </View>
          {(product.healthScore || product.health_score) && (
            <HealthScoreBadge score={product.healthScore || product.health_score} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  promotionIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  storeCount: {
    fontSize: 12,
    marginTop: 2,
  },
  multiRetailerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 6,
    alignSelf: 'flex-start',
  },
  multiRetailerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  retailersList: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
});

export default ProductCard;