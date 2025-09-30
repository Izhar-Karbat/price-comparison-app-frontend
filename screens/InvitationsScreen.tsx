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
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { designTokens } from '../theme/designTokens';
import { RootStackParamList } from '../navigation/types';
import { API_URL } from '../config';

type Props = StackScreenProps<RootStackParamList, 'Invitations'>;

interface Invitation {
  cart_id: number;
  cart_name: string;
  owner_username: string;
}

interface InvitationItemProps {
  invitation: Invitation;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing: boolean;
}

const InvitationItem: React.FC<InvitationItemProps> = ({ 
  invitation, 
  onAccept, 
  onDecline, 
  isProcessing 
}) => {
  return (
    <View style={styles.invitationCard}>
      <View style={styles.iconContainer}>
        <Ionicons name="cart" size={24} color={designTokens.colors.primary} />
      </View>
      <View style={styles.invitationDetails}>
        <Text style={styles.cartName}>{invitation.cart_name}</Text>
        <Text style={styles.ownerText}>From: {invitation.owner_username}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {isProcessing ? (
          <ActivityIndicator color={designTokens.colors.primary} />
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]} 
              onPress={onAccept}
              activeOpacity={0.7}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.declineButton]} 
              onPress={onDecline}
              activeOpacity={0.7}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default function InvitationsScreen({ navigation }: Props) {
  const authContext = useContext(AuthContext);
  const userToken = authContext?.userToken;
  
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

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
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useFocusEffect(
    useCallback(() => {
      fetchInvitations();
    }, [fetchInvitations])
  );

  const handleInvitationAction = async (cartId: number, action: 'accept' | 'decline') => {
    setProcessingId(cartId);
    try {
      const response = await fetch(`${API_URL}/api/invitations/${cartId}/${action}`, {
        method: 'POST',
        headers: { 'x-access-token': userToken || '' },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} invitation`);
      }
      
      Alert.alert('Success', data.message);
      fetchInvitations(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={designTokens.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Invitations</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color={designTokens.colors.primary} />
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
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="mail-open-outline" 
              size={60} 
              color={designTokens.colors.gray.medium} 
            />
            <Text style={styles.emptyText}>No pending invitations</Text>
            <Text style={styles.emptySubtext}>
              When someone invites you to join their cart, it will appear here
            </Text>
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
  safeArea: { 
    flex: 1, 
    backgroundColor: designTokens.colors.background,
  },
  centeredContainer: { 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: designTokens.spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: designTokens.colors.gray.light,
    backgroundColor: designTokens.colors.cardBackground,
  },
  headerTitle: { 
    fontSize: designTokens.typography.size.large, 
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
  },
  closeButton: { 
    padding: designTokens.spacing.xs,
  },
  listContainer: { 
    padding: designTokens.spacing.md, 
    flexGrow: 1,
  },
  invitationCard: { 
    backgroundColor: designTokens.colors.cardBackground, 
    borderRadius: designTokens.borderRadius.large, 
    padding: designTokens.spacing.md, 
    marginBottom: designTokens.spacing.md, 
    flexDirection: 'row', 
    alignItems: 'center',
    ...designTokens.shadows.sm,
  },
  iconContainer: { 
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: designTokens.colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
  },
  invitationDetails: { 
    flex: 1,
  },
  cartName: { 
    fontSize: designTokens.typography.size.body, 
    fontWeight: designTokens.typography.weight.semibold, 
    marginBottom: designTokens.spacing.xs,
    color: designTokens.colors.text,
  },
  ownerText: { 
    fontSize: designTokens.typography.size.small, 
    color: designTokens.colors.textSecondary,
  },
  actionsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  actionButton: { 
    paddingVertical: designTokens.spacing.sm, 
    paddingHorizontal: designTokens.spacing.md, 
    borderRadius: designTokens.borderRadius.medium, 
    marginLeft: designTokens.spacing.sm,
  },
  acceptButton: { 
    backgroundColor: designTokens.colors.success,
  },
  declineButton: { 
    backgroundColor: designTokens.colors.gray.light,
  },
  acceptButtonText: { 
    color: designTokens.colors.white, 
    fontWeight: designTokens.typography.weight.semibold,
    fontSize: designTokens.typography.size.small,
  },
  declineButtonText: { 
    color: designTokens.colors.danger, 
    fontWeight: designTokens.typography.weight.semibold,
    fontSize: designTokens.typography.size.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: designTokens.spacing.xxl * 2,
    paddingHorizontal: designTokens.spacing.xl,
  },
  emptyText: { 
    fontSize: designTokens.typography.size.large, 
    color: designTokens.colors.text,
    fontWeight: designTokens.typography.weight.medium,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
  },
  emptySubtext: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});