import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button } from '../../components';
import { theme } from '../../theme';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  dividendYield: number;
  peRatio: number;
  sector: string;
  isSharia: boolean;
}

const mockStocks: Stock[] = [
  {
    id: '1',
    symbol: 'ALUMINIUM',
    name: 'Aluminium Bahrain (Alba)',
    price: 0.35,
    change: 0.01,
    changePercent: 3.45,
    volume: '200.0K',
    marketCap: 'BHD 1,200,000,000',
    dividendYield: 5.5,
    peRatio: 10.2,
    sector: 'Industrial',
    isSharia: true,
  },
  {
    id: '2',
    symbol: 'APM',
    name: 'APM Terminals Products',
    price: 0.41,
    change: 0.02,
    changePercent: 5.13,
    volume: '28.0K',
    marketCap: 'BHD 72,000,000,000',
    dividendYield: 3.2,
    peRatio: 14.3,
    sector: 'Transportation',
    isSharia: false,
  },
  {
    id: '3',
    symbol: 'BAHRAIN',
    name: 'Bahrain Family Leisure',
    price: 0.19,
    change: -0.02,
    changePercent: -10.53,
    volume: '45.0K',
    marketCap: 'BHD 45,000,000,000',
    dividendYield: 2.1,
    peRatio: 8.8,
    sector: 'Consumer Services',
    isSharia: true,
  },
];

export const StocksScreen: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [shariaOnly, setShariaOnly] = useState(false);

  const sectors = ['All', 'Industrial', 'Transportation', 'Consumer Services', 'Banking & Finance'];

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    const matchesSharia = !shariaOnly || stock.isSharia;
    
    return matchesSearch && matchesSector && matchesSharia;
  });

  const renderStock = (stock: Stock) => (
    <Card key={stock.id} style={styles.stockCard}>
      <View style={styles.stockHeader}>
        <View style={styles.stockInfo}>
          <View style={styles.symbolContainer}>
            <Text style={styles.stockSymbol}>{stock.symbol.charAt(0)}</Text>
          </View>
          <View style={styles.stockDetails}>
            <Text style={styles.stockName}>{stock.symbol}</Text>
            <Text style={styles.companyName}>{stock.name}</Text>
          </View>
        </View>
        {stock.isSharia && (
          <View style={styles.shariaTag}>
            <Text style={styles.shariaText}>Sharia</Text>
          </View>
        )}
      </View>

      <View style={styles.stockMetrics}>
        <View style={styles.priceSection}>
          <Text style={styles.stockPrice}>BHD {stock.price.toFixed(2)}</Text>
          <Text style={[
            styles.stockChange,
            { color: stock.change >= 0 ? theme.colors.success : theme.colors.error }
          ]}>
            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Volume</Text>
            <Text style={styles.metricValue}>{stock.volume}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Market Cap</Text>
            <Text style={styles.metricValue}>{stock.marketCap}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Dividend Yield</Text>
            <Text style={styles.metricValue}>{stock.dividendYield}%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>P/E Ratio</Text>
            <Text style={styles.metricValue}>{stock.peRatio}</Text>
          </View>
        </View>
      </View>

      <Button
        title="Buy Stock"
        onPress={() => console.log('Buy', stock.symbol)}
        style={styles.buyButton}
        size="small"
      />
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bahrain Stocks</Text>
        <Text style={styles.subtitle}>Invest in top-performing companies listed on the Bahrain Bourse</Text>
      </View>

      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, shariaOnly && styles.filterChipActive]}
            onPress={() => setShariaOnly(!shariaOnly)}
          >
            <Text style={[styles.filterChipText, shariaOnly && styles.filterChipTextActive]}>
              Sharia Compliant Only
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectorFilters}>
          {sectors.map((sector) => (
            <TouchableOpacity
              key={sector}
              style={[
                styles.sectorChip,
                selectedSector === sector && styles.sectorChipActive
              ]}
              onPress={() => setSelectedSector(sector)}
            >
              <Text style={[
                styles.sectorChipText,
                selectedSector === sector && styles.sectorChipTextActive
              ]}>
                {sector}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.stocksList}>
        {filteredStocks.map(renderStock)}
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
  filters: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  filterChipTextActive: {
    color: 'white',
  },
  sectorFilters: {
    flexDirection: 'row',
  },
  sectorChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  sectorChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sectorChipText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  sectorChipTextActive: {
    color: 'white',
  },
  stocksList: {
    padding: theme.spacing.lg,
  },
  stockCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbolContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stockSymbol: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  stockDetails: {
    flex: 1,
  },
  stockName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: 2,
  },
  companyName: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  shariaTag: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  shariaText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stockMetrics: {
    marginBottom: theme.spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stockPrice: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  stockChange: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    marginBottom: theme.spacing.sm,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: theme.colors.primary,
  },
});