import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Card, ProfileSwitcher } from '../../components';
import { useAuth } from '../context/AuthContext';
import { useFamilyProfile } from '../context/FamilyProfileContext';
import { theme } from '../../theme';

export const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { currentProfile, familyMembers } = useFamilyProfile();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: signOut
        },
      ]
    );
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleEditChild = (childName: string) => {
    console.log('Edit child:', childName);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile Settings</Text>
        <Text style={styles.subtitle}>Manage your profile and your children's information</Text>
      </View>

      <View style={styles.content}>
        {/* Current Profile Display */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Current Profile</Text>
            <Text style={styles.sectionSubtitle}>Currently viewing {currentProfile.name}'s profile</Text>
          </View>
          
          <View style={styles.currentProfileContainer}>
            <ProfileSwitcher showName={true} />
          </View>
        </Card>

        {/* User Information */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 User Information</Text>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>Maram</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>maram@gmail.com</Text>
            </View>
          </View>

          <Button
            title="✏️ Edit"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
          />
        </Card>

        {/* Family Members */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👨‍👩‍👧‍👦 Family Members</Text>
            <Text style={styles.sectionSubtitle}>Click on a family member to switch their profile or edit their information</Text>
          </View>

          <View style={styles.childrenList}>
            {familyMembers.map((member) => (
              <TouchableOpacity 
                key={member.id}
                style={[styles.childCard, member.isActive && styles.childCardActive]}
                onPress={() => handleEditChild(member.name)}
              >
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>{member.avatar}</Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{member.name}</Text>
                  <Text style={styles.childAge}>Age {member.age}</Text>
                </View>
                {member.isActive && (
                  <View style={styles.activeIndicator}>
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.editIcon}>
                  <Text style={styles.editIconText}>✏️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.addChildCard}
              onPress={() => console.log('Add new family member')}
            >
              <View style={styles.addChildIcon}>
                <Text style={styles.addChildIconText}>+</Text>
              </View>
              <View style={styles.childInfo}>
                <Text style={styles.addChildText}>Add Family Member</Text>
                <Text style={styles.addChildSubtext}>Create a new child profile</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Bank Account Information */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏦 Bank Account Information</Text>
            <Text style={styles.sectionSubtitle}>Your linked bank account for automatic investments</Text>
          </View>

          <View style={styles.bankInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bank</Text>
              <Text style={styles.infoValue}>National Bank of Bahrain</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Number</Text>
              <Text style={styles.infoValue}>****7890</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Monthly Contribution</Text>
              <Text style={[styles.infoValue, { color: theme.colors.primary }]}>BHD 55</Text>
            </View>
          </View>
        </Card>

        {/* Account Actions */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <Text style={styles.sectionSubtitle}>Manage your account and session</Text>
          </View>

          <Button
            title="🚪 Logout"
            onPress={handleSignOut}
            variant="outline"
            size="large"
          />
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
  sectionHeader: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  profileInfo: {
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  currentProfileContainer: {
    alignItems: 'center',
  },
  childrenList: {
    gap: theme.spacing.md,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  childCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  addChildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  addChildIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  addChildIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  addChildText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  addChildSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  childAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  childAge: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  activeIndicator: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  activeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  editIcon: {
    padding: theme.spacing.sm,
  },
  editIconText: {
    fontSize: 16,
  },
  bankInfo: {
    marginBottom: theme.spacing.lg,
  },
});