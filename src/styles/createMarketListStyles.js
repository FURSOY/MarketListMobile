import { StyleSheet } from 'react-native';

export const createMarketListStyles = (currentTheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: currentTheme.colors.background,
        },
        listItemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 15,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.border,
        },
        listItem: {
            flex: 1,
            padding: 15,
        },
        listItemText: {
            fontSize: 18,
            color: currentTheme.colors.textPrimary,
        },
        optionsButton: {
            padding: 10,
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 20,
            color: currentTheme.colors.textSecondary,
        },
    });
};