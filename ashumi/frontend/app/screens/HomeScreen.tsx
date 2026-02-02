import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Card, Button } from '../../components';
import { useFamilyProfile } from '../context/FamilyProfileContext';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

interface PortfolioMetric {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  iconName: string;
  iconLibrary: 'Ionicons' | 'MaterialIcons';
}

const mockMetrics: PortfolioMetric[] = [
  {
    label: 'Total Invested',
    value: 'BHD 800.00',
    iconName: 'wallet',
    iconLibrary: 'Ionicons',
  },
  {
    label: 'Current Value',
    value: 'BHD 920.00',
    change: '+15.00%',
    changeType: 'positive',
    iconName: 'trending-up',
    iconLibrary: 'Ionicons',
  },
  {
    label: 'Total Returns',
    value: 'BHD 120.00',
    change: '+15.00%',
    changeType: 'positive',
    iconName: 'bar-chart',
    iconLibrary: 'Ionicons',
  },
  {
    label: 'Dividends Earned',
    value: 'BHD 20.80',
    iconName: 'diamond',
    iconLibrary: 'Ionicons',
  },
];

// Mock data for line chart (portfolio growth over time)
const portfolioGrowthData = {
  labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [
    {
      data: [400, 450, 520, 580, 650, 720],
      color: (opacity = 1) => `rgba(74, 124, 89, ${opacity})`, // Primary green color
      strokeWidth: 3,
    },
    {
      data: [400, 440, 500, 560, 620, 680],
      color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`, // Success green color
      strokeWidth: 2,
    },
  ],
};

// Mock data for pie chart (portfolio allocation)
const portfolioAllocationData = [
  {
    name: 'BATELCO',
    population: 25,
    color: '#4A7C59',
    legendFontColor: '#2C3E50',
    legendFontSize: 12,
  },
  {
    name: 'BBK',
    population: 20,
    color: '#6B8E23',
    legendFontColor: '#2C3E50',
    legendFontSize: 12,
  },
  {
    name: 'ALUMINIUM',
    population: 18,
    color: '#34C759',
    legendFontColor: '#2C3E50',
    legendFontSize: 12,
  },
  {
    name: 'SEEF',
    population: 15,
    color: '#8FBC8F',
    legendFontColor: '#2C3E50',
    legendFontSize: 12,
  },
  {
    name: 'TAKAFUL',
    population: 12,
    color: '#90EE90',
    legendFontColor: '#2C3E50',
    legendFontSize: 12,
  },
  {
    name: 'Others',
    population: 10,
    color: '#98FB98',
    legendFontColor: '#2C3E50',
    legendFontSize: 12,
  },
];

const chartConfig = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 124, 89, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#4A7C59',
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: '#F8F9FA',
    strokeWidth: 1,
  },
  fillShadowGradient: '#4A7C59',
  fillShadowGradientOpacity: 0.1,
};

export const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { currentProfile } = useFamilyProfile();
  const [userName] = useState('Maram'); // Parent name - this would come from auth context

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderMetricCard = (metric: PortfolioMetric, index: number) => {
    const IconComponent = metric.iconLibrary === 'Ionicons' ? Ionicons : MaterialIcons;
    
    return (
      <Card key={index} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <IconComponent name={metric.iconName as any} size={24} color={theme.colors.primary} />
          <Text style={styles.metricLabel}>{metric.label}</Text>
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        {metric.change && (
          <Text style={[
            styles.metricChange,
            { color: metric.changeType === 'positive' ? theme.colors.success : theme.colors.error }
          ]}>
            {metric.change}
          </Text>
        )}
      </Card>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userName}!</Text>
        <Text style={styles.subtitle}>Here's how {currentProfile.name}'s investment portfolio is performing</Text>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {mockMetrics.map(renderMetricCard)}
      </View>

      {/* Portfolio Performance Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Portfolio Performance</Text>
        <Text style={styles.chartSubtitle}>Track {currentProfile.name}'s investment growth over time</Text>
        
        <View style={styles.chartContainer}>
          <LineChart
            data={portfolioGrowthData}
            width={width - theme.spacing.lg * 4} // Adjust for card padding
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={true}
            withHorizontalLines={true}
            fromZero={false}
            withShadow={true}
            withDots={true}
          />
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4A7C59' }]} />
              <Text style={styles.legendText}>Portfolio Value - BHD 720.00</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
              <Text style={styles.legendText}>Amount Invested - BHD 680.00</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Portfolio Allocation */}
      <Card style={styles.allocationCard}>
        <Text style={styles.allocationTitle}>Portfolio Allocation</Text>
        <View style={styles.allocationChart}>
          <PieChart
            data={portfolioAllocationData}
            width={width - theme.spacing.lg * 4}
            height={220}
            chartConfig={{
              ...chartConfig,
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
            }}
            accessor="population"
            backgroundColor="#ffffff"
            paddingLeft="15"
            center={[10, 10]}
            absolute
          />
        </View>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Buy Stocks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trending-down" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Sell Stocks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Add Funds</Text>
          </TouchableOpacity>
        </View>
      </Card>
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
  greeting: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  metricCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  metricHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  metricValue: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  metricChange: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  chartCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  chartSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'transparent',
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  chartLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  chartLegend: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  legendText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  allocationCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  allocationTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  allocationChart: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  actionsTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});