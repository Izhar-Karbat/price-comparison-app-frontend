import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { designTokens } from '../../theme/designTokens';

interface SmartTableProps {
  comparisonData: {
    retailerName: string;
    total: number;
  }[];
}

const SmartTable: React.FC<SmartTableProps> = ({ comparisonData }) => {
  if (!comparisonData || comparisonData.length === 0) {
    return null;
  }

  // Find the cheapest and most expensive totals to calculate savings
  const sortedData = [...comparisonData].sort((a, b) => a.total - b.total);
  const cheapest = sortedData[0];
  const mostExpensive = sortedData[sortedData.length - 1];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Cart Comparison</Text>
      {sortedData.map((item, index) => {
        const isCheapest = item.retailerName === cheapest.retailerName;
        const savings = mostExpensive.total - item.total;

        return (
          <View key={index} style={[styles.row, isCheapest && styles.cheapestRow]}>
            <Text style={[styles.retailerName, isCheapest && styles.cheapestText]}>{item.retailerName}</Text>
            <View style={styles.priceContainer}>
              {savings > 0 && <Text style={styles.savings}>Save �{savings.toFixed(2)}</Text>}
              <Text style={[styles.total, isCheapest && styles.cheapestText]}>�{item.total.toFixed(2)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.medium,
    padding: designTokens.spacing.md,
    margin: designTokens.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    marginBottom: designTokens.spacing.md,
    color: designTokens.colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.gray.light,
  },
  cheapestRow: {
    backgroundColor: designTokens.colors.successLight,
    borderRadius: designTokens.borderRadius.small,
    marginHorizontal: -designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
  },
  retailerName: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.semibold,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  total: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
  },
  cheapestText: {
    color: designTokens.colors.success,
  },
  savings: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.success,
  },
});

export default SmartTable;