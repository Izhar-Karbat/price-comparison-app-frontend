// screens/CartScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { designTokens } from '../theme/designTokens';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const hasItems = items.length > 0;
  const rawTotal = getCartTotal();
  // Ensure cartTotal is a valid number, fallback to 0 if NaN
  const cartTotal = !isNaN(rawTotal) && rawTotal >= 0 ? rawTotal : 0;
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FFE5EC', '#E8F5E9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
          {hasItems && (
            <Text style={styles.itemCount}>{items.length} items</Text>
          )}
        </View>

        {hasItems ? (
          <>
            <FlatList
              data={items}
              keyExtractor={(item, index) => item.masterproductid || `cart-item-${index}`}
              renderItem={({ item }) => <CartItem {...item} />}
              contentContainerStyle={styles.listContent}
              ListFooterComponent={
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalAmount}>₪{cartTotal.toFixed(2)}</Text>
                </View>
              }
            />
            <View style={styles.bottomButtons}>
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout ₪{cartTotal.toFixed(2)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
                <Text style={styles.clearButtonText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <EmptyState />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A3937',
  },
  itemCount: {
    fontSize: 14,
    color: '#8A8680',
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3937',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3937',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A3937',
  },
  bottomButtons: {
    padding: 20,
    gap: 10,
  },
  checkoutButton: {
    backgroundColor: '#8FBF9F',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    padding: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#F4B2B2',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CartScreen;