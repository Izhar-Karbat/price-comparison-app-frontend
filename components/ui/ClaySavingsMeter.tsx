import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { claymorphismTheme } from '../../themes/claymorphism';

interface ClaySavingsMeterProps {
  totalSavings: number;
  maxValue?: number;
  size?: number;
}

const ClaySavingsMeter: React.FC<ClaySavingsMeterProps> = ({
  totalSavings = 3345,
  maxValue = 5000,
  size = 200,
}) => {
  const theme = claymorphismTheme;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(totalSavings / maxValue, 1);
  const strokeDashoffset = circumference - (progress * circumference);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.meterContainer, styles.outerShadowLight, styles.outerShadowDark]}>
        <Svg width={size} height={size} style={styles.svg}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.gray.light}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.savingsGreen}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            {/* Inner decorative ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius - strokeWidth - 8}
              stroke={theme.colors.pillCream}
              strokeWidth={2}
              fill="none"
              opacity={0.3}
            />
          </G>
        </Svg>

        <View style={styles.innerContent}>
          <View style={styles.heartContainer}>
            <Ionicons
              name="heart"
              size={24}
              color={theme.colors.white}
            />
          </View>
          <Text style={styles.savingsNumber}>
            {formatNumber(totalSavings)}
          </Text>
          <Text style={styles.savingsLabel}>
            saved
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: claymorphismTheme.colors.background,
    borderRadius: 999,
  },
  svg: {
    position: 'absolute',
  },
  innerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  heartContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: claymorphismTheme.colors.savingsGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: claymorphismTheme.colors.savingsGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  savingsNumber: {
    fontSize: claymorphismTheme.typography.size.huge,
    fontWeight: claymorphismTheme.typography.weight.bold,
    color: claymorphismTheme.colors.textPrimary,
    letterSpacing: claymorphismTheme.typography.letterSpacing.tight,
  },
  savingsLabel: {
    fontSize: claymorphismTheme.typography.size.large,
    fontWeight: claymorphismTheme.typography.weight.medium,
    color: claymorphismTheme.colors.textSecondary,
    marginTop: 4,
  },
  outerShadowLight: {
    shadowColor: claymorphismTheme.colors.shadowLight,
    shadowOffset: { width: -10, height: -10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  outerShadowDark: {
    shadowColor: claymorphismTheme.colors.shadowDark,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
});

export default ClaySavingsMeter;