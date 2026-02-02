import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  style 
}) => {
  const logoSize = {
    small: 32,
    medium: 48,
    large: 64,
  }[size];

  const textSize = {
    small: theme.typography.body,
    medium: theme.typography.h3,
    large: theme.typography.h2,
  }[size];

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.logoContainer, { width: logoSize, height: logoSize }]}>
        <Image
          source={require('../images/ashumi.png')}
          style={[styles.logoImage, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
      </View>
      {showText && (
        <Text style={[styles.logoText, textSize]}>As-humi</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  logoImage: {
    borderRadius: 8,
  },
  logoText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});