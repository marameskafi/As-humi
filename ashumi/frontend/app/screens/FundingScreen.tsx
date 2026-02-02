import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Card, Button } from '../../components';
import { theme } from '../../theme';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'card' | 'mobile';
  title: string;
  subtitle: string;
  description: string;
  isActive: boolean;
  status: 'Active' | 'Coming Soon';
}

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'bank',
    title: 'Bank Transfer',
    subtitle: 'Direct from your bank',
    description: 'Transfer funds directly from your bank account. Processing time: 1-2 business days.',
    isActive: true,
    status: 'Active',
  },
  {
    id: '2',
    type: 'card',
    title: 'Credit Card',
    subtitle: 'Instant funding',
    description: 'Fund your account instantly with your credit card. Available 24/7.',
    isActive: false,
    status: 'Coming Soon',
  },
  {
    id: '3',
    type: 'mobile',
    title: 'Mobile Payment',
    subtitle: 'BenefitPay, STC Pay',
    description: 'Use popular mobile payment apps for quick and easy funding.',
    isActive: false,
    status: 'Coming Soon',
  },
];

export const FundingScreen: React.FC = () => {
  const [monthlyContribution, setMonthlyContribution] = useState(55.00);
  const [bankDetails, setBankDetails] = useState({
    bank: 'National Bank of Bahrain',
    accountNumber: '****7890',
    iban: 'BHD7808088888123456789',
  });
  const [autoInvest, setAutoInvest] = useState(true);

  const calculateProjections = () => {
    const monthly = monthlyContribution;
    const annual = monthly * 12;
    const byAge21 = annual * (21 - 18); // Assuming current age is 18
    
    return {
      monthly,
      annual,
      byAge21,
    };
  };

  const projections = calculateProjections();

  const renderPaymentMethod = (method: PaymentMethod) => (
    <Card key={method.id} style={[
      styles.paymentCard,
      method.isActive && styles.paymentCardActive
    ]}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentIcon}>
          <Text style={styles.paymentIconText}>
            {method.type === 'bank' ? '🏦' : method.type === 'card' ? '💳' : '📱'}
          </Text>
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>{method.title}</Text>
          <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: method.status === 'Active' ? theme.colors.success : theme.colors.warning }
        ]}>
          <Text style={styles.statusText}>{method.status}</Text>
        </View>
      </View>
      <Text style={styles.paymentDescription}>{method.description}</Text>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Funding Settings</Text>
        <Text style={styles.subtitle}>Manage your bank account and automatic investment settings</Text>
      </View>

      <View style={styles.content}>
        {/* Bank Account Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🏦 Bank Account</Text>
          <View style={styles.bankInfo}>
            <View style={styles.bankField}>
              <Text style={styles.fieldLabel}>Bank</Text>
              <Text style={styles.fieldValue}>{bankDetails.bank}</Text>
            </View>
            <View style={styles.bankField}>
              <Text style={styles.fieldLabel}>Account Number</Text>
              <Text style={styles.fieldValue}>{bankDetails.accountNumber}</Text>
            </View>
            <View style={styles.bankField}>
              <Text style={styles.fieldLabel}>IBAN</Text>
              <Text style={styles.fieldValue}>{bankDetails.iban}</Text>
            </View>
          </View>
          <Button
            title="Update Bank Details"
            onPress={() => console.log('Update bank details')}
            variant="outline"
            size="small"
          />
        </Card>

        {/* Monthly Contribution Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Monthly Contribution</Text>
          
          <View style={styles.contributionSlider}>
            <Text style={styles.contributionLabel}>Amount (BHD)</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>BHD 0</Text>
              <View style={styles.slider}>
                <View style={[styles.sliderTrack, { width: `${(monthlyContribution / 250) * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${(monthlyContribution / 250) * 100}%` }]} />
              </View>
              <Text style={styles.sliderValue}>BHD 250</Text>
            </View>
            <Text style={styles.currentAmount}>BHD {monthlyContribution.toFixed(2)}</Text>
            <Text style={styles.contributionNote}>per month</Text>
          </View>

          <View style={styles.projectionSection}>
            <Text style={styles.projectionTitle}>Investment Projection</Text>
            <View style={styles.projectionGrid}>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Monthly Investment</Text>
                <Text style={styles.projectionValue}>BHD {projections.monthly.toFixed(2)}</Text>
              </View>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Annual Investment</Text>
                <Text style={styles.projectionValue}>BHD {projections.annual.toFixed(2)}</Text>
              </View>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>By Age 21 (18 years)</Text>
                <Text style={[styles.projectionValue, { color: theme.colors.success }]}>
                  BHD {projections.byAge21.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <Button
            title="Save Settings"
            onPress={() => console.log('Save settings')}
            style={styles.saveButton}
          />
        </Card>

        {/* Payment Methods Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <Text style={styles.sectionSubtitle}>Manage how you fund your investments</Text>
          
          <View style={styles.paymentMethods}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        </Card>

        {/* Security Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Secure & Sharia Compliant</Text>
          <Text style={styles.securityText}>
            All transactions are processed through secure, sharia-compliant banking channels. 
            Your funds are protected by bank-level security and sharia finance principles.
          </Text>
        </Card>
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
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  bankInfo: {
    marginBottom: theme.spacing.lg,
  },
  bankField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  fieldLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  fieldValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  contributionSlider: {
    marginBottom: theme.spacing.lg,
  },
  contributionLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  slider: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    marginHorizontal: theme.spacing.md,
    position: 'relative',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    backgroundColor: theme.colors.primary,
    borderRadius: 9,
    marginLeft: -9,
  },
  sliderValue: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  currentAmount: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contributionNote: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  projectionSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  projectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  projectionGrid: {
    gap: theme.spacing.md,
  },
  projectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  projectionLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  projectionValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  paymentMethods: {
    gap: theme.spacing.md,
  },
  paymentCard: {
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  paymentCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  paymentIconText: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  securityText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
});