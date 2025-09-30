import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../theme/designTokens';

interface InviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', `Invitation sent to ${email}!`);
      setEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Share Your Cart</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={designTokens.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Ionicons name="share-outline" size={60} color={designTokens.colors.primary} />
              </View>
              
              <Text style={styles.description}>
                Invite someone to collaborate on your shopping cart. They'll be able to add, remove, and modify items.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter email address"
                  placeholderTextColor={designTokens.colors.gray.dark}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Message (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.messageInput]}
                  placeholder="Add a personal message..."
                  placeholderTextColor={designTokens.colors.gray.dark}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.sendButton]}
                onPress={handleSendInvite}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={designTokens.colors.white} />
                ) : (
                  <Text style={styles.sendButtonText}>Send Invitation</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: designTokens.colors.cardBackground,
    borderRadius: designTokens.borderRadius.large,
    overflow: 'hidden',
    ...designTokens.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.gray.light,
  },
  headerTitle: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  content: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  description: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: designTokens.spacing.xl,
  },
  inputContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  inputLabel: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.medium,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: designTokens.colors.gray.light,
    borderRadius: designTokens.borderRadius.medium,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.text,
    backgroundColor: designTokens.colors.white,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.gray.light,
    gap: designTokens.spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: designTokens.colors.gray.light,
  },
  cancelButtonText: {
    fontSize: designTokens.typography.size.button,
    fontWeight: designTokens.typography.weight.medium,
    color: designTokens.colors.text,
  },
  sendButton: {
    backgroundColor: designTokens.colors.primary,
  },
  sendButtonText: {
    fontSize: designTokens.typography.size.button,
    fontWeight: designTokens.typography.weight.semibold,
    color: designTokens.colors.white,
  },
});

export default InviteModal;