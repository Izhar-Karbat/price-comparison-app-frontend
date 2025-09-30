import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../theme/designTokens';

interface IngredientTagProps {
  name: string;
  type: 'danger' | 'warning' | 'safe';
}

const IngredientTag: React.FC<IngredientTagProps> = ({ name, type }) => {
  const getTagStyle = () => {
    switch (type) {
      case 'danger':
        return {
          backgroundColor: '#FFEBEE',
          borderColor: designTokens.colors.danger,
          iconColor: designTokens.colors.danger,
          iconName: 'close-circle' as const,
        };
      case 'warning':
        return {
          backgroundColor: '#FFF3E0',
          borderColor: designTokens.colors.warning,
          iconColor: designTokens.colors.warning,
          iconName: 'alert-circle' as const,
        };
      case 'safe':
      default:
        return {
          backgroundColor: designTokens.colors.successLight,
          borderColor: designTokens.colors.success,
          iconColor: designTokens.colors.success,
          iconName: 'checkmark-circle' as const,
        };
    }
  };

  const tagStyle = getTagStyle();

  return (
    <View style={[styles.container, { backgroundColor: tagStyle.backgroundColor, borderColor: tagStyle.borderColor }]}>
      <Ionicons name={tagStyle.iconName} size={16} color={tagStyle.iconColor} />
      <Text style={[styles.text, { color: tagStyle.iconColor }]}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.round,
    borderWidth: 1,
    marginRight: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.sm,
  },
  text: {
    fontSize: designTokens.typography.size.small,
    marginLeft: designTokens.spacing.xs,
    fontWeight: designTokens.typography.weight.medium,
  },
});

export default IngredientTag;