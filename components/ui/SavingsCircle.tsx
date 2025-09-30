// components/ui/SavingsCircle.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface SavingsCircleProps {
  savingsAmount: number;
  currency?: string;
}

const SavingsCircle: React.FC<SavingsCircleProps> = ({
  savingsAmount,
  currency = '₪'
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: theme.colors.savingsGreen }, theme.shadows.savings]}>
        <View style={[styles.innerCircle, { backgroundColor: theme.colors.white }]}>
          <View style={styles.heartContainer}>
            <Ionicons name="heart" size={24} color={theme.colors.savingsGreen} />
          </View>
          <Text style={[styles.amount, { color: theme.colors.savingsGreen }]}>
            {savingsAmount.toLocaleString()}
          </Text>
          <Text style={[styles.label, { color: theme.colors.savingsGreen }]}>
            saved
          </Text>
        </View>
      </View>

      {/* Progress indicators around the circle */}
      <View style={[styles.progressArc, styles.topArc, { borderColor: theme.colors.accent }]} />
      <View style={[styles.progressArc, styles.bottomArc, { borderColor: theme.colors.warning }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
    position: 'relative',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  innerCircle: {
    width: '85%',
    height: '85%',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartContainer: {
    marginBottom: 4,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  progressArc: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
  },
  topArc: {
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    top: -10,
  },
  bottomArc: {
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    bottom: -10,
  },
});

export default SavingsCircle;