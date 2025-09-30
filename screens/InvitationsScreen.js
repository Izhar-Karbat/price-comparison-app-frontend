import React, { useState, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const InvitationItem = ({ invitation, onAccept, onDecline, isProcessing }) => {
  return (
    <View style={styles.invitationCard}>
      <View style={styles.iconContainer}>
        <Ionicons name="cart" size={24} color="#007AFF" />
      </View>
      <View style={styles.invitationDetails}>
        <Text style={styles.cartName}>{invitation.cart_name}</Text>
        <Text style={styles.ownerText}>From: {invitation.owner_username}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {isProcessing ? (
          <ActivityIndicator color="#007AFF" />
        ) : (
          <>
            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAccept}>
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.declineButton]} onPress={onDecline}>
              <Text style={[styles.actionButtonText, styles.declineButtonText]}>Decline</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default function InvitationsScreen({ navigation }) {
  const { userToken } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchInvitations = useCallback(async () => {
    if (!userToken) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/invitations`, {
        headers: { 'x-access-token': userToken },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch invitations.');
      }
      setInvitations(data.invitations || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // CORRECTED an error here: The useFocusEffect hook is now structured correctly.
  useFocusEffect(
    useCallback(() => {
      fetchInvitations();
    }, [fetchInvitations])
  );

  const handleInvitationAction = async (cartId, action) => {
    setProcessingId(cartId);
    try {
        const response = await fetch(`${API_URL}/api/invitations/${cartId}/${action}`, {
            method: 'POST',
            headers: { 'x-access-token': userToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        Alert.alert('Success', data.message);
        fetchInvitations(); // Refresh the list after the action is complete

    } catch (error) {
        Alert.alert('Error', error.message);
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Invitations</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={invitations}
        keyExtractor={(item) => item.cart_id.toString()}
        renderItem={({ item }) => (
          <InvitationItem 
            invitation={item} 
            onAccept={() => handleInvitationAction(item.cart_id, 'accept')}
            onDecline={() => handleInvitationAction(item.cart_id, 'decline')}
            isProcessing={processingId === item.cart_id}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.centeredContainer, { marginTop: 100 }]}>
            <Ionicons name="mail-open-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No pending invitations.</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchInvitations}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
    centeredContainer: { justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    closeButton: { padding: 4 },
    listContainer: { padding: 16, flexGrow: 1 },
    invitationCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, flexDirection: 'row', alignItems: 'center' },
    iconContainer: { marginRight: 12 },
    invitationDetails: { flex: 1 },
    cartName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    ownerText: { fontSize: 14, color: '#666' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
    actionButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginLeft: 10 },
    acceptButton: { backgroundColor: '#34C759' },
    declineButton: { backgroundColor: '#F0F0F0' },
    actionButtonText: { color: '#FFF', fontWeight: 'bold' },
    declineButtonText: { color: '#FF3B30' },
    emptyText: { fontSize: 16, color: '#A0A0A0', marginTop: 10 },
});