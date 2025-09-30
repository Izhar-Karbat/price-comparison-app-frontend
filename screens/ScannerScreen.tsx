// screens/ScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { designTokens } from '../theme/designTokens';
import { RootStackParamList } from '../App';
import { getProductByBarcode, ApiError } from '../services/api';
import { Product } from '../types';

type ScannerScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ScannerScreen = () => {
  const navigation = useNavigation<ScannerScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (isLoading) return; // Prevent multiple scans while processing

    setScanned(true);
    setIsLoading(true);

    try {
      console.log('Barcode scanned:', { type, data });

      // Use the new API service
      const apiProduct = await getProductByBarcode(data);

      // Transform API response to match our Product interface
      const product: Product = {
        product_id: parseInt(apiProduct.product_id) || 0,
        masterproductid: apiProduct.product_id,
        name: apiProduct.name,
        productName: apiProduct.name,
        brand: apiProduct.brand || '',
        image_url: apiProduct.image_url || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(apiProduct.name.substring(0, 10)),
        imageUrl: apiProduct.image_url || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(apiProduct.name.substring(0, 10)),
        description: apiProduct.description || apiProduct.name,
        price: apiProduct.lowest_price ? parseFloat(apiProduct.lowest_price.toString()) : undefined,
        health_score: Math.floor(Math.random() * 20) + 80,
        healthScore: Math.floor(Math.random() * 20) + 80,
        category: apiProduct.category,
        ingredients: undefined,
        prices: apiProduct.lowest_price ? [{
          retailer_name: 'Best Price',
          store_name: 'Available Store',
          price: parseFloat(apiProduct.lowest_price.toString()),
          updated_at: new Date().toISOString()
        }] : [],
        promotions: undefined,
      };

      // Success - navigate to product details
      navigation.navigate('ProductDetails', {
        productId: product.product_id.toString(),
        productData: product,
      });
    } catch (error) {
      console.error('Error looking up barcode:', error);
      if (error instanceof ApiError) {
        console.log('API Error:', error.message);
      }
      showProductNotFoundAlert(data);
    } finally {
      setIsLoading(false);
    }
  };

  const showProductNotFoundAlert = (barcode: string) => {
    Alert.alert(
      'Product Not Found',
      `We couldn't find a product with barcode: ${barcode}\n\nTry searching by product name instead.`,
      [
        {
          text: 'Search by Name',
          onPress: () => {
            navigation.navigate('ProductSearch', { searchQuery: '' });
          },
        },
        {
          text: 'Scan Again',
          onPress: () => setScanned(false),
          style: 'cancel',
        },
      ]
    );
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>No access to camera</Text>
        <Text style={styles.instructionText}>
          Please enable camera permissions in your device settings
        </Text>
        <TouchableOpacity style={styles.scanButton} onPress={requestPermission}>
          <Text style={styles.scanButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'code128', 'code39', 'code93', 'codabar', 'itf14', 'upc_a', 'upc_e', 'aztec', 'datamatrix'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructionText}>
          Position the barcode within the frame
        </Text>
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={designTokens.colors.white} />
          <Text style={styles.loadingText}>Looking up product...</Text>
        </View>
      )}
      {scanned && !isLoading && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.medium,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.body,
    marginTop: designTokens.spacing.lg,
    textAlign: 'center',
    paddingHorizontal: designTokens.spacing.lg,
  },
  noPermissionText: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.md,
  },
  scanButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: designTokens.colors.primary,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.medium,
  },
  scanButtonText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.button,
    fontWeight: designTokens.typography.weight.bold,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.medium,
  },
  loadingText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.body,
    marginTop: designTokens.spacing.sm,
    fontWeight: designTokens.typography.weight.semibold,
  },
});

export default ScannerScreen;