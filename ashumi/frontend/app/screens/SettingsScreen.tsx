import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Card } from '../../components';
import { useAuth } from '../context/AuthContext';
import { theme } from '../../theme';

export const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: signOut
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Name</Text>
            <Text style={styles.profileValue}>{user?.name || 'N/A'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Email</Text>
            <Text style={styles.profileValue}>{user?.email || 'N/A'}</Text>
          </View>
        </Card>

        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            size="large"
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ashumi v1.0.0</Text>
          <Text style={styles.footerText}>Family Contribution Tracker</Text>
        </View>
      </View>
    </View>
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
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  profileCard: {
    marginVertical: theme.spacing.md,
  },
  actionsCard: {
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  profileValue: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});