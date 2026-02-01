import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card } from '../../components';
import { familyService } from '../../services';
import { FamilyMember } from '../../models';
import { theme } from '../../theme';

export const HomeScreen: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMembers = async () => {
    try {
      const response = await familyService.getMembers();
      if (response.success) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMembers();
  };

  const totalContribution = members.reduce((sum, member) => sum + member.contributionAmount, 0);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Family Contribution Overview</Text>
      </View>

      <Card style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Monthly Contribution</Text>
        <Text style={styles.totalAmount}>${totalContribution.toLocaleString()}</Text>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family Members</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : members.length === 0 ? (
          <Text style={styles.emptyText}>No family members added yet</Text>
        ) : (
          members.map((member) => (
            <Card key={member.id} style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberAmount}>
                  ${member.contributionAmount.toLocaleString()}/month
                </Text>
              </View>
            </Card>
          ))
        )}
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
  totalCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  totalLabel: {
    ...theme.typography.body,
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  totalAmount: {
    ...theme.typography.h1,
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  memberCard: {
    marginBottom: theme.spacing.sm,
  },
  memberInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  memberAmount: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
});