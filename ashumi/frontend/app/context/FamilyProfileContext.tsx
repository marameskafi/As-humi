import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  avatar: string;
  isActive: boolean;
}

interface FamilyProfileContextType {
  currentProfile: FamilyMember;
  familyMembers: FamilyMember[];
  switchProfile: (memberId: string) => void;
}

const FamilyProfileContext = createContext<FamilyProfileContextType | undefined>(undefined);

const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Lulwa',
    age: 8,
    avatar: 'L',
    isActive: true,
  },
  {
    id: '2',
    name: 'Salem',
    age: 8,
    avatar: 'S',
    isActive: false,
  },
];

interface FamilyProfileProviderProps {
  children: ReactNode;
}

export const FamilyProfileProvider: React.FC<FamilyProfileProviderProps> = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [currentProfile, setCurrentProfile] = useState<FamilyMember>(
    familyMembers.find(member => member.isActive) || familyMembers[0]
  );

  const switchProfile = (memberId: string) => {
    const newProfile = familyMembers.find(member => member.id === memberId);
    if (newProfile) {
      // Update active status
      const updatedMembers = familyMembers.map(member => ({
        ...member,
        isActive: member.id === memberId,
      }));
      
      setFamilyMembers(updatedMembers);
      setCurrentProfile(newProfile);
    }
  };

  return (
    <FamilyProfileContext.Provider value={{
      currentProfile,
      familyMembers,
      switchProfile,
    }}>
      {children}
    </FamilyProfileContext.Provider>
  );
};

export const useFamilyProfile = (): FamilyProfileContextType => {
  const context = useContext(FamilyProfileContext);
  if (!context) {
    throw new Error('useFamilyProfile must be used within a FamilyProfileProvider');
  }
  return context;
};