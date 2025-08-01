import { StyleSheet } from 'react-native';

export const createMarketListStyles = (currentTheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: currentTheme.colors.background,
        }
    })
}