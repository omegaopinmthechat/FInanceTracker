import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, shadows, radii, spacing } from '@/theme/colors';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'default',
  padding = 'lg',
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.card, 
        variant === 'elevated' && styles.elevated,
        { padding: spacing[padding] },
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    ...shadows.medium,
    borderWidth: 0,
  },
});
