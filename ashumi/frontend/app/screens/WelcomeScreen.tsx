import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../../components';
import { theme } from '../../theme';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Ashumi</Text>
        <Text style={styles.subtitle}>
          Track your family's contributions and build better financial habits together.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')}
          variant="primary"
          size="large"
        />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('SignUp')}
          variant="outline"
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  buttonContainer: {
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
});