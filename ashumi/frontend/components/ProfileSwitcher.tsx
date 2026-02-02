import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFamilyProfile } from '../app/context/FamilyProfileContext';
import { theme } from '../theme';

interface ProfileSwitcherProps {
  showName?: boolean;
  compact?: boolean;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ 
  showName = true, 
  compact = false 
}) => {
  const { currentProfile, familyMembers, switchProfile } = useFamilyProfile();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleProfileSwitch = (memberId: string) => {
    switchProfile(memberId);
    setIsModalVisible(false);
  };

  if (compact) {
    return (
      <>
        <TouchableOpacity 
          style={styles.compactContainer}
          onPress={() => setIsModalVisible(true)}
        >
          <View style={styles.compactProfileIcon}>
            <Ionicons name="person" size={14} color="#4A7C59" />
          </View>
          <Text style={styles.compactProfileName}>{currentProfile.name}</Text>
          <View style={styles.switchArrows}>
            <MaterialIcons name="swap-horiz" size={16} color="#4A7C59" />
          </View>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Switch Profile</Text>
              <Text style={styles.modalSubtitle}>Select a family member profile</Text>
              
              {familyMembers.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberOption,
                    member.isActive && styles.memberOptionActive
                  ]}
                  onPress={() => handleProfileSwitch(member.id)}
                >
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>{member.avatar}</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberAge}>Age {member.age}</Text>
                  </View>
                  {member.isActive && (
                    <View style={styles.activeIndicator}>
                      <Text style={styles.activeText}>Active</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={styles.addMemberOption}
                onPress={() => {
                  setIsModalVisible(false);
                  // Navigate to add member screen
                  console.log('Navigate to add family member');
                }}
              >
                <View style={styles.addMemberIcon}>
                  <Text style={styles.addMemberIconText}>+</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.addMemberText}>Add Family Member</Text>
                  <Text style={styles.addMemberSubtext}>Create a new child profile</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentProfile.avatar}</Text>
        </View>
        {showName && (
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentProfile.name}</Text>
            <Text style={styles.profileAge}>Age {currentProfile.age}</Text>
          </View>
        )}
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Profile</Text>
            <Text style={styles.modalSubtitle}>Select a family member profile</Text>
            
            {familyMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberOption,
                  member.isActive && styles.memberOptionActive
                ]}
                onPress={() => handleProfileSwitch(member.id)}
              >
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>{member.avatar}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberAge}>Age {member.age}</Text>
                </View>
                {member.isActive && (
                  <View style={styles.activeIndicator}>
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.addMemberOption}
              onPress={() => {
                setIsModalVisible(false);
                // Navigate to add member screen
                console.log('Navigate to add family member');
              }}
            >
              <View style={styles.addMemberIcon}>
                <Text style={styles.addMemberIconText}>+</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.addMemberText}>Add Family Member</Text>
                <Text style={styles.addMemberSubtext}>Create a new child profile</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8', // Light green background like in screenshot
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    minHeight: 32,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  compactAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  compactAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  compactProfileIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  compactProfileIconText: {
    color: '#4A7C59',
    fontSize: 14,
  },
  compactProfileName: {
    ...theme.typography.body,
    color: '#2E7D32', // Dark green text like in screenshot
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
  switchArrows: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchArrowText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileAge: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
  dropdownIcon: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginLeft: theme.spacing.sm,
  },
  compactDropdownIcon: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  modalSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  memberOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  addMemberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.surface,
  },
  addMemberIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  addMemberIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  addMemberText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  addMemberSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  memberAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberAge: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  activeIndicator: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  activeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});