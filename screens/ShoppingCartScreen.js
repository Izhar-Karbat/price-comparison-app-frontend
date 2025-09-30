// screens/ShoppingCartScreen.js
import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useCart } from '../src/hooks/useCart';
import { AuthContext } from '../context/AuthContext'; // <-- IMPORT NEW
import InviteModal from '../src/components/InviteModal'; // <-- IMPORT NEW
import { API_URL } from '../config';

const ShoppingCartScreen = ({ navigation }) => {
  const {
    cartItems,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    loading: cartLoading
  } = useCart();

  // --- NEW STATE & CONTEXT ---
  const { userToken, username } = useContext(AuthContext);
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  
  // --- EXISTING STATE ---
  const [selectedStores, setSelectedStores] = useState(['rami-levy', 'shufersal', 'victory']);
  const [priceComparisons, setPriceComparisons] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [hahishukCheckoutLoading, setHahishukCheckoutLoading] = useState(false);
  const [currentHahishukItemIndex, setCurrentHahishukItemIndex] = useState(0);
  const [hahishukItemsToProcess, setHahishukItemsToProcess] = useState([]);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchPriceComparisons();
    } else {
      setPriceComparisons({});
    }
  }, [cartItems, selectedStores]);

  const fetchPriceComparisons = async () => {
    setLoadingPrices(true);
    try {
      const mockPrices = { /* ... your mock price logic ... */ };
      setPriceComparisons(mockPrices);
    } catch (error) {
      console.error('Error fetching price comparisons:', error);
    } finally {
      setLoadingPrices(false);
    }
  };
  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateItemQuantity(id, newQuantity);
      } else {
        Alert.alert('Remove Item','Are you sure you want to remove this item?',
          [{ text: 'Cancel', style: 'cancel' },{ text: 'Remove', onPress: () => removeItemFromCart(id), style: 'destructive' }]
        );
      }
    }
  };
  const handleClearCart = () => {
     Alert.alert('Clear Cart', 'Are you sure you want to remove all items?',
      [{ text: 'Cancel', style: 'cancel' },{ text: 'Clear', onPress: clearCart, style: 'destructive' }]
    );
  };
  const storeInfo = {
    'rami-levy': { name: 'Rami Levy', logo: 'https://upload.wikimedia.org/wikipedia/he/thumb/5/5f/Rami_levy_hashikma_marketing_logo.svg/200px-Rami_levy_hashikma_marketing_logo.svg.png', color: '#E31E24' },
    'shufersal': { name: 'Shufersal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Shufersal_logo.svg/200px-Shufersal_logo.svg.png', color: '#00A859' },
    'victory': { name: 'Victory', logo: 'https://www.victory.co.il/media/logo/stores/1_1.png', color: '#FF6B00' },
    'yohananof': { name: 'Yohananof', logo: 'https://www.yohananof.co.il/images/logo.png', color: '#004B87' },
  };


  const handleHahishukCheckout = async () => {
    const itemsForHahishuk = cartItems.filter(item => item.retailer === 'Hahishuk' && item.productId);
    if (itemsForHahishuk.length === 0) {
      Alert.alert("No Hahishuk Items", "There are no items from Hahishuk in your cart to check out.");
      return;
    }
    setHahishukItemsToProcess(itemsForHahishuk);
    setCurrentHahishukItemIndex(0);
    await processHahishukItem(itemsForHahishuk[0]);
  };

  const processHahishukItem = async (item) => {
    if (!item) {
      setHahishukCheckoutLoading(false);
      Alert.alert("Hahishuk Checkout Complete", "All Hahishuk items processed. You can view your Hahishuk cart on their website or use the button in the cart.");
      return;
    }

    setHahishukCheckoutLoading(true);

    const payload = {
      items: [{ productId: item.productId, quantity: item.quantity }]
    };

    try {
      const response = await fetch(`${API_URL}/api/hahishuk/prepare-cart-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || !result.redirectUrl) {
        throw new Error(result.error || `Failed to get Hahishuk URL for ${item.name}`);
      }
      setWebViewUrl(result.redirectUrl);
      setIsWebViewVisible(true);
    } catch (error) {
      console.error("Error processing Hahishuk item:", error);
      Alert.alert("Error", `Could not prepare to add ${item.name}: ${error.message}`);
      setHahishukCheckoutLoading(false);
      promptForNextActionAfterError(item);
    }
  };
  
  const promptForNextActionAfterError = (currentItem) => {
     Alert.alert(
        "Problem with Item",
        `There was an issue preparing to add "${currentItem?.name}" to Hahishuk.`,
        [
          { text: "Skip this item", onPress: () => { setIsWebViewVisible(false); proceedToNextHahishukItem(); } },
          { text: "Retry", onPress: () => { setIsWebViewVisible(false); processHahishukItem(currentItem); } },
          { text: "Cancel Hahishuk Checkout", onPress: () => { setIsWebViewVisible(false); setHahishukCheckoutLoading(false); }  }
        ],
        { cancelable: false }
      );
  };

  const proceedToNextHahishukItem = () => {
    const nextIndex = currentHahishukItemIndex + 1;
    if (nextIndex < hahishukItemsToProcess.length) {
      setCurrentHahishukItemIndex(nextIndex);
      processHahishukItem(hahishukItemsToProcess[nextIndex]);
    } else {
      setHahishukCheckoutLoading(false);
      Alert.alert("Hahishuk Checkout Finished", "All selected Hahishuk items have been processed. Please verify your cart on Hahishuk's website.");
    }
  };

  const handleWebViewModalUserAction = (action) => {
    setIsWebViewVisible(false);
    setHahishukCheckoutLoading(false);
    
    const currentItem = hahishukItemsToProcess[currentHahishukItemIndex];

    if (action === 'proceed') {
      proceedToNextHahishukItem();
    } else if (action === 'retry') {
      processHahishukItem(currentItem);
    } else if (action === 'cancel') {
      Alert.alert("Hahishuk Checkout Cancelled", "You can continue later.");
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₪{item.price.toFixed(2)}</Text>
        {item.retailer === 'Hahishuk' && item.productId && (
          <Text style={styles.hahishukIndicator}>Hahishuk (ID: {item.productId})</Text>
        )}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)} style={styles.quantityButton}><Ionicons name="remove-circle-outline" size={24} color="#007AFF" /></TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)} style={styles.quantityButton}><Ionicons name="add-circle-outline" size={24} color="#007AFF" /></TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeItemFromCart(item.id)} style={styles.removeButton}><Ionicons name="trash-outline" size={20} color="#FF3B30" /></TouchableOpacity>
    </View>
  );

  const renderPriceComparison = () => {
     if (loadingPrices) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Comparing prices...</Text></View>;
    const sortedStores = Object.entries(priceComparisons).filter(([storeId]) => selectedStores.includes(storeId)).sort(([, a], [, b]) => a - b);
    if (sortedStores.length === 0 || cartItems.length === 0) return null;
    const currentCartTotal = parseFloat(getCartTotal().toFixed(2));
    const cheapestPrice = sortedStores[0][1];
    const savings = currentCartTotal - cheapestPrice;
    return (
      <View style={styles.priceComparisonSection}>
        <Text style={styles.sectionTitle}>Price Comparison</Text>
        <TouchableOpacity style={styles.storeSelector} onPress={() => navigation.navigate('StoreSelector', { selectedStores, onStoresSelected: setSelectedStores })}>
          <Text style={styles.storeSelectorText}>Comparing {selectedStores.length} stores</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        {sortedStores.map(([storeId, price], index) => {
          const store = storeInfo[storeId];
          if (!store) return null;
          const isCheapest = index === 0;
          return (
            <View key={storeId} style={[styles.storePrice, isCheapest && styles.cheapestStore]}>
              <Image source={{ uri: store.logo }} style={styles.storeLogo} />
              <View style={styles.storePriceDetails}><Text style={styles.storeName}>{store.name}</Text><Text style={[styles.storeTotal, { color: store.color }]}>₪{price.toFixed(2)}</Text></View>
              {isCheapest && savings > 0 && (<View style={styles.cheapestBadge}><Text style={styles.cheapestText}>Cheapest!</Text><Text style={styles.savingsText}>Save ₪{savings.toFixed(2)}</Text></View>)}
            </View>
          );
        })}
      </View>
    );
  };

  if (cartLoading) {
    return <SafeAreaView style={[styles.container, styles.centered]}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Loading cart...</Text></SafeAreaView>;
  }
  if (cartItems.length === 0) {
    return <SafeAreaView style={styles.container}><View style={styles.emptyCart}><Ionicons name="cart-outline" size={80} color="#C7C7CC" /><Text style={styles.emptyCartText}>Your cart is empty</Text><TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('SupermarketHome')}><Text style={styles.shopButtonText}>Start Shopping</Text></TouchableOpacity></View></SafeAreaView>;
  }

  const hasHahishukItems = cartItems.some(item => item.retailer === 'Hahishuk' && item.productId);
  const currentItemBeingProcessed = hahishukItemsToProcess[currentHahishukItemIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* --- NEW INVITE MODAL --- */}
      <InviteModal
        visible={isInviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isWebViewVisible}
        onRequestClose={() => handleWebViewModalUserAction('cancel')}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Adding: {currentItemBeingProcessed?.name || 'Item'}
            </Text>
            <TouchableOpacity onPress={() => handleWebViewModalUserAction('cancel')}>
              <Ionicons name="close-circle" size={30} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          {webViewUrl ? (
            <WebView
              source={{ uri: webViewUrl }}
              style={{ flex: 1 }}
              onLoadStart={() => console.log('WebView loading started for:', webViewUrl)}
              onLoadEnd={() => console.log('WebView loading finished for current item.')}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                Alert.alert("WebView Error", `Could not load page: ${nativeEvent.description || nativeEvent.code}`);
                handleWebViewModalUserAction('retry');
              }}
            />
          ) : <ActivityIndicator size="large" style={{flex: 1, justifyContent: 'center'}}/>}
          <View style={styles.modalFooter}>
            <Text style={styles.modalFooterText}>After Hahishuk confirms the item is added, choose an option:</Text>
            <TouchableOpacity style={[styles.modalButton, styles.modalProceedButton]} onPress={() => handleWebViewModalUserAction('proceed')}>
              <Text style={styles.modalButtonText}>Item Added - Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalRetryButton]} onPress={() => handleWebViewModalUserAction('retry')}>
              <Text style={styles.modalButtonText}>Try This Item Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- UPDATED HEADER --- */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>
                {userToken ? `${username}'s Cart` : 'Shopping Cart'}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {userToken && cartItems.length > 0 && (
                    <TouchableOpacity onPress={() => setInviteModalVisible(true)} style={{marginRight: 15}}>
                        <Ionicons name="share-outline" size={26} color="#007AFF" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleClearCart}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.cartSummary}><Text style={styles.itemCount}>{getCartItemCount()} items</Text><Text style={styles.totalPrice}>₪{getCartTotal().toFixed(2)}</Text></View>
        <FlatList data={cartItems} renderItem={renderCartItem} keyExtractor={item => item.id.toString()} scrollEnabled={false} ItemSeparatorComponent={() => <View style={styles.separator} />} />
        {renderPriceComparison()}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('StoresNearYou')}><Ionicons name="map-outline" size={20} color="#007AFF" style={{marginRight: 8}} /><Text style={styles.secondaryButtonText}>View Stores Nearby</Text></TouchableOpacity>


        {hasHahishukItems && (
          <TouchableOpacity
            style={[styles.checkoutButton, styles.hahishukButton]}
            onPress={handleHahishukCheckout}
            disabled={hahishukCheckoutLoading}
          >
            {hahishukCheckoutLoading && currentHahishukItemIndex < hahishukItemsToProcess.length ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ActivityIndicator color="#FFF" style={{marginRight: 10}} />
                <Text style={styles.checkoutButtonText}>Processing {currentHahishukItemIndex + 1}/{hahishukItemsToProcess.length}...</Text>
              </View>
            ) : (
              <>
                <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeILzA356SJO6OsV1Yk26yQT7SYr1qS0E3ug&s'}} style={styles.hahishukButtonIcon} />
                <Text style={styles.checkoutButtonText}>Smart Check Out Hahishuk</Text>
              </>
            )}
          </TouchableOpacity>
        )}

         <TouchableOpacity
            style={[styles.checkoutButton, {backgroundColor: '#4CAF50', marginTop: 8}]}
            onPress={() => {
                setWebViewUrl("https://hahishook.com/cart/");
                setIsWebViewVisible(true);
            }}
          >
            <Ionicons name="eye-outline" size={20} color="#FFF" style={{marginRight: 8}}/>
            <Text style={styles.checkoutButtonText}>View Hahishuk Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  clearText: { color: '#FF3B30', fontSize: 16 },
  cartSummary: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E5EA', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  itemCount: { fontSize: 16, color: '#666' },
  totalPrice: { fontSize: 20, fontWeight: 'bold' },
  cartItem: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF', alignItems: 'center' },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  productDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  productPrice: { fontSize: 14, color: '#666' },
  hahishukIndicator: { fontSize: 12, color: '#f09b3c', fontStyle: 'italic' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  quantityButton: { padding: 4 },
  quantityText: { fontSize: 16, fontWeight: '600', marginHorizontal: 12, minWidth: 24, textAlign: 'center' },
  removeButton: { padding: 8, marginLeft: 8 },
  separator: { height: 1, backgroundColor: '#E5E5EA', marginLeft: 16 + 60 + 12 },
  priceComparisonSection: { marginHorizontal: 16, marginTop: 20, padding: 16, backgroundColor: '#FFF', borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  storeSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#F0F0F0', borderRadius: 8, marginBottom: 16 },
  storeSelectorText: { fontSize: 16, color: '#333', fontWeight: '500' },
  storePrice: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, marginVertical: 6, backgroundColor: '#F9F9F9', borderRadius: 8, borderWidth: 1, borderColor: '#EEE' },
  cheapestStore: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50', borderWidth: 1.5 },
  storeLogo: { width: 36, height: 36, marginRight: 12, resizeMode: 'contain', borderRadius: 18 },
  storePriceDetails: { flex: 1 },
  storeName: { fontSize: 16, fontWeight: '600', color: '#444' },
  storeTotal: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  cheapestBadge: { alignItems: 'flex-end', marginLeft: 10 },
  cheapestText: { fontSize: 12, color: '#388E3C', fontWeight: 'bold', backgroundColor: '#C8E6C9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  savingsText: { fontSize: 13, color: '#388E3C', marginTop: 2, fontWeight: '500' },
  loadingContainer: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#555' },
  checkoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#007AFF', marginHorizontal: 16, marginTop: 16, marginBottom: 8, paddingVertical: 16, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
  checkoutButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600', marginRight: 8 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyCartText: { fontSize: 20, color: '#555', textAlign: 'center', marginTop: 20, marginBottom: 30 },
  shopButton: { backgroundColor: '#007AFF', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 },
  shopButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  secondaryButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 12, marginBottom: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#007AFF' },
  secondaryButtonText: { color: '#007AFF', fontSize: 17, fontWeight: '600' },
  hahishukButton: { backgroundColor: '#f09b3c', marginTop: 8 },
  hahishukButtonIcon: { width: 24, height: 24, marginRight: 8, tintColor: '#FFFFFF' },
  // Modal Styles
  modalContainer: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#F8F8F8',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: -30,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#F8F8F8',
  },
  modalFooterText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 12,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalProceedButton: {
    backgroundColor: '#4CD964',
  },
  modalRetryButton: {
    backgroundColor: '#FF9500',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShoppingCartScreen;