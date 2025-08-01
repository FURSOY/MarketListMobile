import { StyleSheet } from 'react-native';
import { fontWeights } from '../config/typography';

export const createAuthStyles = (currentTheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            padding: currentTheme.spacing.lg,
            backgroundColor: currentTheme.colors.background,
        },
        title: {
            fontSize: currentTheme.fontSizes.xxl,
            fontWeight: currentTheme.fontWeights.bold,
            marginBottom: currentTheme.spacing.lg,
            color: currentTheme.colors.textPrimary,
        },
        input: {
            width: '100%',
            padding: currentTheme.spacing.md,
            borderWidth: 1,
            borderRadius: currentTheme.borderRadius,
            marginBottom: currentTheme.spacing.sm,
            color: currentTheme.colors.textPrimary,
            fontSize: currentTheme.fontSizes.large,
        },
        errorText: {
            color: currentTheme.colors.error,
            marginBottom: currentTheme.spacing.sm,
            textAlign: 'center',
            fontSize: currentTheme.fontSizes.small,
        },
        spacer: {
            height: currentTheme.spacing.sm,
        },
        infoText: {
            marginBottom: currentTheme.spacing.lg,
            textAlign: 'center',
            fontSize: currentTheme.fontSizes.medium,
            color: currentTheme.colors.textPrimary,
        },
        Button: {
            backgroundColor: currentTheme.colors.accent,
            color: currentTheme.colors.textPrimary,
            width: '100%',
            padding: currentTheme.spacing.md,
            borderRadius: currentTheme.borderRadius,
        },
        ButtonText: {
            fontSize: currentTheme.fontSizes.large,
            textAlign: 'center',
            color: currentTheme.colors.textPrimary,
            fontWeight: currentTheme.fontWeights.bold
        },
        navButton: {
            background: 'transparent'
        },
        navButtonText: {
            color: currentTheme.colors.textPrimary,
            fontSize: currentTheme.fontSizes.medium,
        }
    });
};