import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { designTokens } from '../../theme/designTokens';

// We can use a library like Expo's Vector Icons later
const Icon = ({ name }: { name: string }) => <Text style={styles.icon}>{name}</Text>;

interface ProfileListItemProps {
  label: string;
  icon: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({
  label,
  icon,
  onPress,
  isDestructive = false,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContent}>
        <Icon name={icon} />
        <Text style={[styles.label, isDestructive && styles.destructiveText]}>{label}</Text>
      </View>
      {!isDestructive && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: designTokens.colors.white,
    padding: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.gray.light,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: designTokens.spacing.md,
    color: designTokens.colors.textSecondary,
  },
  label: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.text,
  },
  destructiveText: {
    color: designTokens.colors.danger,
  },
  chevron: {
    fontSize: 24,
    color: designTokens.colors.gray.medium,
  },
});

export default ProfileListItem;