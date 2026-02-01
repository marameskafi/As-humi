import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FamilyStackParamList } from '../navigation/AppNavigator';
import { Button, Card } from '../../components';
import { familyService } from '../../services';
import { FamilyMember } from '../../models';
import { theme } from '../../theme';

type FamilyMembersScreenNavigationProp = StackNavigationProp<FamilyStackParamList, 'FamilyMembers'>;

interface Props {
  navigation: FamilyMembersScreenNavigationProp;
}

export const FamilyMembersScreen: React.FC<Props> = ({ navigation }) => {
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
    const unsubscribe = navigation.addListener('focus', () => {
      loadMembers();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMembers();
  };

  const handleDeleteMember = (member: FamilyMember) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await familyService.deleteMember(member.id);
              if (response.success) {
                loadMembers();
              } else {
                Alert.alert('Error', response.message || 'Failed to delete member');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete member');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : members.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No family members added yet</Text>
            <Text style={styles.emptySubtext}>
              Add your first family member to start tracking contributions
            </Text>
          </View>
        ) : (
          members.map((member) => (
            <Card key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberAmount}>
                    ${member.contributionAmount.toLocaleString()}/month
                  </Text>
                </View>
              </View>
              
              <View style={styles.memberActions}>
                <Button
                  title="Edit"
                  onPress={() => navigation.navigate('AddEditMember', { memberId: member.id })}
                  variant="outline"
                  size="small"
                />
                <Button
                  title="Delete"
                  onPress={() => handleDeleteMember(member)}
                  variant="outline"
                  size="small"
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.addButtonContainer}>
        <Button
          title="Add Family Member"
          onPress={() => navigation.navigate('AddEditMember', {})}
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  memberCard: {
    marginVertical: theme.spacing.sm,
  },
  memberHeader: {
    marginBottom: theme.spacing.md,
  },
  memberInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  memberAmount: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  memberActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  addButtonContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
});