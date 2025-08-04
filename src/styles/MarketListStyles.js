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
            paddingLeft: 15,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.border,
            paddingVertical: 15,
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
        addItemContainer: {
            flexDirection: 'row',
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: currentTheme.colors.border,
        },
        input: {
            flex: 1,
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            fontSize: 16,
            borderColor: currentTheme.colors.primary,
            color: currentTheme.colors.textPrimary,
            backgroundColor: currentTheme.colors.background,
        },
        quantityInput: {
            width: 60,
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            textAlign: 'center',
            borderColor: currentTheme.colors.primary,
            color: currentTheme.colors.textPrimary,
            backgroundColor: currentTheme.colors.background,
        },
        addButton: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            padding: 10,
            backgroundColor: currentTheme.colors.primary,
        },
        purchasedHeader: { // Yeni stil: Satın alınanlar başlığı için
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.card,
        },
        purchasedHeaderText: { // Yeni stil: Başlık metni için
            fontSize: 18,
            fontWeight: 'bold',
            color: currentTheme.colors.textPrimary,
        },
        purchasedList: { // Yeni stil: Satın alınanlar listesi için
            // Opsiyonel stiller eklenebilir.
        },
        optionsButton: {
            marginLeft: 10, // Metinden biraz boşluk bırakır
            padding: 5,
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 20,
            color: currentTheme.colors.textSecondary,
        },
    });
};