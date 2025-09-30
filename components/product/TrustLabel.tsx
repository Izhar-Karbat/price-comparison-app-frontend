import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { designTokens } from '../../theme/designTokens';

type TrustLabelType = 'identical' | 'similar' | 'relevant';

interface TrustLabelProps {
  type: TrustLabelType;
}

const LABELS = {
  identical: {
    icon: '✅',
    text: 'Identical Product',
    color: designTokens.colors.success,
  },
  similar: {
    icon: '🔁',
    text: 'Similar Ingredients',
    color: designTokens.colors.warning,
  },
  relevant: {
    icon: '💡',
    text: 'Relevant Alternative',
    color: designTokens.colors.info,
  },
};

const TrustLabel: React.FC<TrustLabelProps> = ({ type }) => {
  const label = LABELS[type];

  if (!label) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: label.color }]}>
      <Text style={styles.icon}>{label.icon}</Text>
      <Text style={styles.text}>{label.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.large,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: designTokens.spacing.sm,
    fontSize: 14,
  },
  text: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.small,
    fontWeight: designTokens.typography.weight.bold,
  },
});

export default TrustLabel;