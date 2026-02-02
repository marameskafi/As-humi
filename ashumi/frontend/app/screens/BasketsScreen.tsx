import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from '../../components';
import { theme } from '../../theme';

interface BasketAllocation {
  asset: string;
  percentage: number;
}

interface InvestmentBasket {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  expectedReturn: string;
  minInvestment: number;
  allocations: BasketAllocation[];
  icon: string;
}

const mockBaskets: InvestmentBasket[] = [
  {
    id: '1',
    name: 'Conservative Growth',
    description: 'Low-risk portfolio for steady returns',
    riskLevel: 'Low Risk',
    expectedReturn: '5-8%',
    minInvestment: 100.00,
    allocations: [
      { asset: 'BBK', percentage: 40 },
      { asset: 'SEEF', percentage: 30 },
      { asset: 'TAKAFUL', percentage: 20 },
      { asset: 'BATELCO', percentage: 10 },
    ],
    icon: '🛡️',
  },
  {
    id: '2',
    name: 'Balanced Portfolio',
    description: 'Mix of growth and stability',
    riskLevel: 'Medium Risk',
    expectedReturn: '8-12%',
    minInvestment: 200.00,
    allocations: [
      { asset: 'BATELCO', percentage: 25 },
      { asset: 'ALUMINIUM', percentage: 25 },
      { asset: 'SEEF', percentage: 20 },
      { asset: 'GFH', percentage: 15 },
      { asset: 'TAKAFUL', percentage: 15 },
    ],
    icon: '⚖️',
  },
  {
    id: '3',
    name: 'Growth Accelerator',
    description: 'High-growth potential investments',
    riskLevel: 'Medium Risk',
    expectedReturn: '10-15%',
    minInvestment: 300.00,
    allocations: [
      { asset: 'TECH_STOCKS', percentage: 35 },
      { asset: 'GROWTH_FUNDS', percentage: 30 },
      { asset: 'EMERGING_MARKETS', percentage: 20 },
      { asset: 'COMMODITIES', percentage: 15 },
    ],
    icon: '🚀',
  },
  {
    id: '4',
    name: 'High Performance',
    description: 'Maximum growth potential',
    riskLevel: 'High Risk',
    expectedReturn: '15-25%',
    minInvestment: 500.00,
    allocations: [
      { asset: 'GROWTH_STOCKS', percentage: 40 },
      { asset: 'TECH_VENTURES', percentage: 30 },
      { asset: 'CRYPTO_FUNDS', percentage: 20 },
      { asset: 'STARTUPS', percentage: 10 },
    ],
    icon: '📈',
  },
];

export const BasketsScreen: React.FC = () => {
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low Risk':
        return theme.colors.success;
      case 'Medium Risk':
        return theme.colors.warning;
      case 'High Risk':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderBasket = (basket: InvestmentBasket) => (
    <Card key={basket.id} style={styles.basketCard}>
      <View style={styles.basketHeader}>
        <View style={styles.basketIcon}>
          <Text style={styles.iconText}>{basket.icon}</Text>
        </View>
        <View style={styles.riskBadge}>
          <Text style={[styles.riskText, { color: getRiskColor(basket.riskLevel) }]}>
            {basket.riskLevel}
          </Text>
        </View>
      </View>

      <View style={styles.basketInfo}>
        <Text style={styles.basketName}>{basket.name}</Text>
        <Text style={styles.basketDescription}>{basket.description}</Text>
      </View>

      <View style={styles.basketMetrics}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Min Investment</Text>
            <Text style={styles.metricValue}>BHD {basket.minInvestment.toFixed(2)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Expected Return</Text>
            <Text style={[styles.metricValue, { color: theme.colors.success }]}>
              {basket.expectedReturn}
            </Text>
          </View>
        </View>

        <View style={styles.allocationSection}>
          <Text style={styles.allocationTitle}>Portfolio Allocation:</Text>
          {basket.allocations.map((allocation, index) => (
            <View key={index} style={styles.allocationItem}>
              <Text style={styles.allocationAsset}>{allocation.asset}</Text>
              <Text style={styles.allocationPercentage}>{allocation.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>

      <Button
        title="Invest Now"
        onPress={() => console.log('Invest in', basket.name)}
        style={styles.investButton}
      />
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Investment Baskets</Text>
        <Text style={styles.subtitle}>Pre-built stock portfolios designed by our investment experts</Text>
      </View>

      <View style={styles.categorySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          <TouchableOpacity style={[styles.categoryCard, styles.categoryActive]}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>🛡️</Text>
            </View>
            <Text style={styles.categoryTitle}>Diversified</Text>
            <Text style={styles.categorySubtitle}>Spread risk across multiple sectors and companies</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>✅</Text>
            </View>
            <Text style={styles.categoryTitle}>Sharia Compliant</Text>
            <Text style={styles.categorySubtitle}>Options for stock investments that are sharia-compliant</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>📊</Text>
            </View>
            <Text style={styles.categoryTitle}>Expert Managed</Text>
            <Text style={styles.categorySubtitle}>Curated stock baskets by our team of investment professionals</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.basketsList}>
        {mockBaskets.map(renderBasket)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  categorySection: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categories: {
    paddingHorizontal: theme.spacing.lg,
  },
  categoryCard: {
    width: 180,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  categoryActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryIconText: {
    fontSize: 20,
  },
  categoryTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  categorySubtitle: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  basketsList: {
    padding: theme.spacing.lg,
  },
  basketCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  basketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  basketIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  riskBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  basketInfo: {
    marginBottom: theme.spacing.lg,
  },
  basketName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  basketDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  basketMetrics: {
    marginBottom: theme.spacing.lg,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  metricValue: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  allocationSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  allocationTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  allocationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  allocationAsset: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  allocationPercentage: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  investButton: {
    backgroundColor: theme.colors.primary,
  },
});