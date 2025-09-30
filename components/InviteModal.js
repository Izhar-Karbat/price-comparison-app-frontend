import React, { useState, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

// Assume you have a way to get the current cart ID.
// For now, we will mock it. Later, this will come from your CartContext.
const MOCK_CURRENT_CART_ID = 1;

// Note: This component is being default exported correctly for its own file.
export default function InviteModal({ visible, onClose }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useContext(AuthContext);

  const handleInvite = async () => {
    if (!email) {
      Alert.alert('No Email', 'Please enter an email address to send an invitation.');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/carts/${MOCK_CURRENT_CART_ID}/invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': userToken,
          },
          body: JSON.stringify({ email: email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invitation.');
      }

      Alert.alert(
        'Invitation Sent',
        data.message,
        [{ text: 'OK', onPress: onClose }]
      );
      setEmail('');
      Keyboard.dismiss();

    } catch (error) {
      Alert.alert('Invite Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={inviteModalStyles.centeredView} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={inviteModalStyles.modalView} onPress={() => Keyboard.dismiss()}>
          <View style={inviteModalStyles.modalHeader}>
            <Text style={inviteModalStyles.modalTitle}>Invite to Cart</Text>
            <TouchableOpacity onPress={onClose} style={inviteModalStyles.closeButton}>
              <Ionicons name="close-circle" size={28} color="#E5E7EB" />
            </TouchableOpacity>
          </View>

          <Text style={inviteModalStyles.modalText}>
            Enter the email of the person you want to share this shopping cart with.
          </Text>

          <TextInput
            style={inviteModalStyles.input}
            placeholder="friend@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <TouchableOpacity style={inviteModalStyles.button} onPress={handleInvite} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={inviteModalStyles.buttonText}>Send Invite</Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// Renamed 'styles' to 'inviteModalStyles' to avoid conflicts
const inviteModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
