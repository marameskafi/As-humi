import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FamilyStackParamList } from '../navigation/AppNavigator';
import { Button, TextField } from '../../components';
import { familyService } from '../../services';
import { FamilyMember } from '../../models';
import { theme } from '../../theme';

type AddEditMemberScreenNavigationProp = StackNavigationProp<FamilyStackParamList, 'AddEditMember'>;
type AddEditMemberScreenRouteProp = RouteProp<FamilyStackParamList, 'AddEditMember'>;

interface Props {
  navigation: AddEditMemberScreenNavigationProp;
  route: AddEditMemberScreenRouteProp;
}

export const AddEditMemberScreen: React.FC<Props> = ({ navigation, route }) => {
  const { memberId } = route.params;
  const isEditing = !!memberId;

  const [name, setName] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [errors, setErrors] = useState<{ name?: string; contributionAmount?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMember, setIsLoadingMember] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadMember();
    }
  }, [isEditing, memberId]);

  const loadMember = async () => {
    try {
      const response = await familyService.getMembers();
      if (response.success) {
        const member = response.data.find(m => m.id === memberId);
        if (member) {
          setName(member.name);
          setContributionAmount(member.contributionAmount.toString());
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load member details');
    } finally {
      setIsLoadingMember(false);
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; contributionAmount?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const amount = parseFloat(contributionAmount);
    if (!contributionAmount.trim()) {
      newErrors.contributionAmount = 'Contribution amount is required';
    } else if (isNaN(amount) || amount < 0) {
      newErrors.contributionAmount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const amount = parseFloat(contributionAmount);
      
      if (isEditing) {
        const response = await familyService.updateMember({
          id: memberId!,
          name: name.trim(),
          contributionAmount: amount,
        });
        
        if (response.success) {
          navigation.goBack();
        } else {
          Alert.alert('Error', response.message || 'Failed to update member');
        }
      } else {
        const response = await familyService.createMember({
          name: name.trim(),
          contributionAmount: amount,
        });
        
        if (response.success) {
          navigation.goBack();
        } else {
          Alert.alert('Error', response.message || 'Failed to create member');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingMember) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading member details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Member' : 'Add Family Member'}
        </Text>
        <Text style={styles.subtitle}>
          {isEditing ? 'Update member information' : 'Add a new family member to track contributions'}
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter member's full name"
          error={errors.name}
        />

        <TextField
          label="Monthly Contribution Amount"
          value={contributionAmount}
          onChangeText={setContributionAmount}
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.contributionAmount}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={isEditing ? 'Update Member' : 'Add Member'}
            onPress={handleSave}
            loading={isLoading}
            size="large"
          />
          
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="large"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
});