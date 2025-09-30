import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import InviteModal from '../components/InviteModal';
import { designTokens } from '../theme/designTokens';
import { MainAppScreenProps } from '../navigation/types';
import { CartItem } from '../types';

type ShoppingCartScreenProps = MainAppScreenProps<'Cart'>;

const ShoppingCartScreen: React.FC = () => {
  const { cartItems, updateItemQuantity, removeItemFromCart, getCartTotal } = useCart();
  const authContext = useContext(AuthContext);
  const userToken = authContext?.userToken;
  const username = authContext?.username;
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const navigation = useNavigation<ShoppingCartScreenProps['navigation']>();

  const handleQuantityChange = (id: string, change: number) => {
    const item = cartItems.find(item => item.masterproductid === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateItemQuantity(id, newQuantity);
      } else {
        Alert.alert('Remove Item', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Remove', onPress: () => removeItemFromCart(id), style: 'destructive' }]);
      }
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>₪{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleQuantityChange(item.masterproductid, -1)}><Ionicons name="remove-circle-outline" size={28} color={designTokens.colors.primary} /></TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleQuantityChange(item.masterproductid, 1)}><Ionicons name="add-circle-outline" size={28} color={designTokens.colors.primary} /></TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#C7C7CC" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <InviteModal visible={isInviteModalVisible} onClose={() => setInviteModalVisible(false)} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{userToken ? `${username}'s Cart` : 'Shopping Cart'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {userToken && (
            <TouchableOpacity onPress={() => setInviteModalVisible(true)} style={{ marginRight: 15 }}>
              <Ionicons name="share-outline" size={26} color={designTokens.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.masterproductid}
        ListFooterComponent={
          <>
            {/* We will restore the price comparison and Hahishuk logic once backend is connected */}
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout (₪{getCartTotal().toFixed(2)})</Text>
            </TouchableOpacity>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: designTokens.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: designTokens.colors.gray.light },
  headerTitle: { fontSize: designTokens.typography.size.title, fontWeight: designTokens.typography.weight.bold },
  cartItem: { flexDirection: 'row', padding: 16, backgroundColor: designTokens.colors.white, alignItems: 'center' },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  productDetails: { flex: 1 },
  productName: { fontSize: designTokens.typography.size.body, fontWeight: designTokens.typography.weight.medium, marginBottom: 4 },
  productPrice: { fontSize: designTokens.typography.size.small, color: designTokens.colors.textSecondary },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { fontSize: designTokens.typography.size.body, fontWeight: designTokens.typography.weight.semibold, marginHorizontal: 12 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyCartText: { fontSize: designTokens.typography.size.large, color: designTokens.colors.textSecondary, textAlign: 'center', marginTop: 20, marginBottom: 30 },
  shopButton: { backgroundColor: designTokens.colors.primary, paddingHorizontal: 30, paddingVertical: 14, borderRadius: designTokens.borderRadius.round },
  shopButtonText: { color: designTokens.colors.white, fontSize: designTokens.typography.size.button, fontWeight: designTokens.typography.weight.semibold },
  checkoutButton: { backgroundColor: designTokens.colors.primary, margin: 16, padding: 16, borderRadius: designTokens.borderRadius.large, alignItems: 'center' },
  checkoutButtonText: { color: designTokens.colors.white, fontSize: designTokens.typography.size.button, fontWeight: designTokens.typography.weight.semibold },
});

export default ShoppingCartScreen;