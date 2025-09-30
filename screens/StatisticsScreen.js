// screens/StatisticsScreen.js
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';

// Generic Insight Card Component
const InsightCard = ({ insight }) => {
  if (!insight || !insight.id) { // Added a check for insight.id for a valid key
      console.warn("InsightCard received an invalid insight object:", insight);
      return null;
  }

  const renderIcon = () => {
    if (!insight.icon) return <Ionicons name="information-circle-outline" size={24} color="#FFF" />;
    if (insight.icon.length <= 2 && insight.icon.charCodeAt(0) > 255) { // Basic emoji check (might need refinement)
      return <Text style={styles.insightCardEmojiIcon}>{insight.icon}</Text>;
    }
    return <Ionicons name={insight.icon} size={24} color="#FFF" />;
  };

  return (
    <View style={[styles.insightCardBase, { borderColor: insight.color || '#E0E0E0' }]}>
      <View style={styles.insightCardHeader}>
        <View style={[styles.insightCardIconBackground, { backgroundColor: insight.color || '#4A90E2' }]}>
          {renderIcon()}
        </View>
        <Text style={styles.insightCardTitle}>{insight.title || 'תובנה'}</Text>
      </View>
      {insight.value && <Text style={styles.insightCardValue}>{insight.value}</Text>}
      <Text style={styles.insightCardDescription}>{insight.description || 'אין מידע נוסף.'}</Text>
      {insight.type === 'price_trend_item' && insight.changePercentage !== undefined && (
        <Text style={[
            styles.insightCardMeta,
            insight.changePercentage > 0 ? styles.priceUp : (insight.changePercentage < 0 ? styles.priceDown : {})
          ]}
        >
          שינוי: {insight.changePercentage > 0 ? '+' : ''}{insight.changePercentage}%
        </Text>
      )}
    </View>
  );
};

const StatisticsScreen = () => {
  const [insights, setInsights] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTimestamp, setFetchTimestamp] = useState(Date.now()); // For forcing refresh

  const fetchStats = useCallback(async () => { // useCallback to memoize
    console.log("fetchStats called");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/statistics?timestamp=${Date.now()}`); // Cache buster
      if (!response.ok) {
        let errorData = { error: `שגיאת שרת: ${response.status}` };
        try { 
            const textError = await response.text();
            console.error("Server error response text:", textError);
            errorData = JSON.parse(textError); // Try to parse as JSON
        } catch (e) { 
            console.error("Could not parse error response as JSON:", e);
            // errorData remains as defined above
        }
        console.error("Error response from server (object):", errorData);
        throw new Error(errorData.error || errorData.details || `שגיאת HTTP! סטטוס: ${response.status}`);
      }
      const data = await response.json();
      console.log("Statistics data received from backend:", JSON.stringify(data, null, 2));
      
      if (data && Array.isArray(data.insights)) {
        setInsights(data.insights);
        if (data.insights.length === 0) {
            console.log("Backend returned an empty 'insights' array.");
        }
      } else {
        console.warn("Received data is not in the expected format (missing or non-array 'insights'):", data);
        setInsights([]); 
      }
    } catch (e) {
      console.error("Failed to fetch statistics:", e);
      setError(`לא ניתן לטעון סטטיסטיקות: ${e.message}`);
      setInsights([]);
    } finally {
      setLoading(false);
      console.log("fetchStats finished");
    }
  }, []); // Empty dependency array for useCallback, fetchStats itself doesn't depend on props/state

  useEffect(() => {
    console.log("useEffect for fetchStats triggered, timestamp:", fetchTimestamp);
    fetchStats();
  }, [fetchStats, fetchTimestamp]); // Depend on fetchStats (memoized) and fetchTimestamp

  const handleRefresh = () => {
    console.log("handleRefresh called");
    setFetchTimestamp(Date.now()); // Trigger a new fetch by updating timestamp
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>טוען נתונים סטטיסטיים...</Text>
      </SafeAreaView>
    );
  }

  // Error display should come before checking insights length
  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Ionicons name="cloud-offline-outline" size={60} color="#FF3B30" style={{ marginBottom: 10 }} />
        <Text style={styles.errorText}>שגיאה בטעינת סטטיסטיקות</Text>
        <Text style={styles.errorDetailText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  // Now check insights length
  if (!insights || insights.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>תובנות וסטטיסטיקות</Text>
                <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                    <Ionicons name="refresh-circle-outline" size={30} color="#007AFF" />
                </TouchableOpacity>
            </View>
            <View style={styles.centeredContent}>
                <Ionicons name="information-circle-outline" size={50} color="#8A8A8E" style={{ marginBottom: 10 }} />
                <Text style={styles.noInsightsText}>אין תובנות זמינות כרגע.</Text>
                <Text style={styles.noInsightsSubText}>נסה לרענן או בדוק שוב מאוחר יותר.</Text>
            </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  // If we have insights, render them
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>תובנות וסטטיסטיקות</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                <Ionicons name="refresh-circle-outline" size={30} color="#007AFF" />
            </TouchableOpacity>
        </View>

        {insights.map((insight, index) => (
            // Ensure insight is not null and has a unique key
            insight && insight.id ? 
            <InsightCard key={insight.id} insight={insight} /> :
            <InsightCard key={`insight-fallback-${index}`} insight={insight} /> // Fallback key if id is missing
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F8' },
  scrollView: { flex: 1 },
  scrollContentContainer: { paddingHorizontal: 16, paddingTop:10, paddingBottom: 30 }, // Added paddingTop
  container: { flex: 1, backgroundColor: '#F4F4F8' },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 20, flex: 1 },
  centeredContent: {
    paddingTop: 50, // Give some space from header if content is centered
    alignItems: 'center',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4, // Align with card horizontal padding effectively
  },
  pageTitle: {
    fontSize: 26, // Slightly larger
    fontWeight: 'bold',
    color: '#1A1A1A', // Darker
  },
  refreshButton: {
    padding: 8, // Easier to tap
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { fontSize: 18, fontWeight: '600', color: '#D92C2C', textAlign: 'center', marginBottom: 8 },
  errorDetailText: { fontSize: 14, color: '#4B4B4B', textAlign: 'center', marginBottom: 25, paddingHorizontal: 10, lineHeight: 20 },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // More rounded
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2,},
    shadowOpacity: 0.20,
    shadowRadius: 2.62,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noInsightsText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  noInsightsSubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
  },
  insightCardBase: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1, 
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, // Softer shadow
    shadowRadius: 3,
    elevation: 2,
  },
  insightCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightCardIconBackground: {
    width: 38, // Slightly smaller
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Adjusted margin
  },
  insightCardEmojiIcon: {
    fontSize: 18, 
  },
  insightCardTitle: {
    fontSize: 16,
    fontWeight: '600', // Semi-bold
    color: '#222',
    flex: 1,
  },
  insightCardValue: {
    fontSize: 17, 
    fontWeight: 'bold',
    color: '#0062CC', // Darker blue
    marginBottom: 6,
  },
  insightCardDescription: {
    fontSize: 13.5, 
    color: '#454545', 
    lineHeight: 19,
  },
  insightCardMeta: {
    fontSize: 12,
    color: '#767676', 
    marginTop: 8,
  },
  priceUp: { color: '#D9534F', fontWeight: '500' },
  priceDown: { color: '#5CB85C', fontWeight: '500' }
});

export default StatisticsScreen;
