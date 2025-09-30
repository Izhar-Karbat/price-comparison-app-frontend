// screens/VisualSearchScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { designTokens } from '../theme/designTokens';
import { RootStackParamList } from '../App';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type VisualSearchNavigationProp = StackNavigationProp<RootStackParamList, 'VisualSearch'>;

interface SearchResult {
  productId: string;
  productName: string;
  brand: string;
  confidence: number;
  price: number;
  imageUrl: string;
}

const VisualSearchScreen: React.FC = () => {
  const navigation = useNavigation<VisualSearchNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMode, setSearchMode] = useState<'camera' | 'gallery' | 'results'>('camera');
  
  const cameraRef = useRef<CameraView | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }

    // Pulse animation for capture button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      setCapturedImage(photo.uri);
      analyzeImage(photo.uri, photo.base64);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri, result.assets[0].base64 || undefined);
    }
  };

  const analyzeImage = async (uri: string, base64: string | undefined) => {
    setIsAnalyzing(true);
    setSearchMode('results');

    // Animate results panel
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      // TODO: Replace with your actual AI API endpoint
      const response = await fetch('YOUR_AI_API_ENDPOINT/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          mode: 'product_recognition',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          setSearchResults([
            {
              productId: '1',
              productName: 'Identified Product',
              brand: 'Brand Name',
              confidence: 0.92,
              price: 25.90,
              imageUrl: 'https://via.placeholder.com/150',
            },
            {
              productId: '2',
              productName: 'Similar Product',
              brand: 'Brand Name',
              confidence: 0.78,
              price: 22.50,
              imageUrl: 'https://via.placeholder.com/150',
            },
          ]);
        }, 2000);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Analysis Error',
        'Unable to analyze image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setSearchResults([]);
    setSearchMode('camera');
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>
          Camera permission is required to use visual search
        </Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose from Gallery Instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {searchMode === 'camera' && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
        >
          <View style={styles.cameraOverlay}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={28} color={designTokens.colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Visual Search</Text>
              <TouchableOpacity
                onPress={() => {
                  setCameraType(
                    cameraType === 'back'
                      ? 'front'
                      : 'back'
                  );
                }}
              >
                <Ionicons name="camera-reverse" size={28} color={designTokens.colors.white} />
              </TouchableOpacity>
            </View>

            {/* Scan Frame */}
            <View style={styles.scanFrame}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              
              <Text style={styles.scanHint}>
                Point camera at product or prescription
              </Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                <Ionicons name="images" size={28} color={designTokens.colors.white} />
              </TouchableOpacity>

              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.placeholder} />
            </View>
          </View>
        </CameraView>
      )}

      {/* Results Panel */}
      {searchMode === 'results' && (
        <Animated.View
          style={[
            styles.resultsPanel,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Captured Image Preview */}
            {capturedImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                  <Ionicons name="camera" size={20} color={designTokens.colors.white} />
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* AI Analysis Status */}
            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <ActivityIndicator size="large" color={designTokens.colors.primary} />
                <Text style={styles.analyzingText}>AI is analyzing image...</Text>
                <Text style={styles.analyzingSubtext}>
                  Identifying products and comparing prices
                </Text>
              </View>
            )}

            {/* Search Results */}
            {!isAnalyzing && searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Found {searchResults.length} matches</Text>
                
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={result.productId}
                    style={styles.resultCard}
                    onPress={() => {
                      navigation.navigate('ProductDetails', {
                        productId: result.productId,
                      });
                    }}
                  >
                    <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
                    <View style={styles.resultInfo}>
                      <View style={styles.confidenceBadge}>
                        <Text style={styles.confidenceText}>
                          {Math.round(result.confidence * 100)}% match
                        </Text>
                      </View>
                      <Text style={styles.resultName}>{result.productName}</Text>
                      <Text style={styles.resultBrand}>{result.brand}</Text>
                      <Text style={styles.resultPrice}>₪{result.price.toFixed(2)}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={designTokens.colors.gray.medium}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* No Results */}
            {!isAnalyzing && searchResults.length === 0 && capturedImage && (
              <View style={styles.noResultsContainer}>
                <Ionicons
                  name="search"
                  size={48}
                  color={designTokens.colors.gray.medium}
                />
                <Text style={styles.noResultsText}>
                  No products found in this image
                </Text>
                <TouchableOpacity style={styles.tryAgainButton} onPress={retakePhoto}>
                  <Text style={styles.tryAgainText}>Try Another Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.black,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerTitle: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.white,
  },
  scanFrame: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: designTokens.colors.primary,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scanHint: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.body,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: designTokens.spacing.xl,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: designTokens.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: designTokens.colors.primary,
  },
  placeholder: {
    width: 50,
  },
  resultsPanel: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
    paddingTop: 50,
  },
  previewContainer: {
    position: 'relative',
    marginHorizontal: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: designTokens.borderRadius.large,
  },
  retakeButton: {
    position: 'absolute',
    top: designTokens.spacing.sm,
    right: designTokens.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.medium,
    gap: 4,
  },
  retakeText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.small,
    fontWeight: designTokens.typography.weight.semibold,
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xl,
  },
  analyzingText: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginTop: designTokens.spacing.md,
  },
  analyzingSubtext: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xs,
  },
  resultsContainer: {
    paddingHorizontal: designTokens.spacing.md,
  },
  resultsTitle: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.md,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.medium,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: designTokens.borderRadius.small,
    marginRight: designTokens.spacing.md,
  },
  resultInfo: {
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: designTokens.colors.success,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  confidenceText: {
    color: designTokens.colors.white,
    fontSize: 10,
    fontWeight: designTokens.typography.weight.bold,
  },
  resultName: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
  },
  resultBrand: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
  },
  resultPrice: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.primary,
    marginTop: 4,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xl * 2,
  },
  noResultsText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.md,
  },
  tryAgainButton: {
    marginTop: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.primary,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.medium,
  },
  tryAgainText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
  },
  noPermissionText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  button: {
    backgroundColor: designTokens.colors.primary,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.medium,
  },
  buttonText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
  },
});

export default VisualSearchScreen;