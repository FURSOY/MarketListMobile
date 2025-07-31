import { colors, darkColors } from './colors';
import { fontSizes, fontWeights, fontFamilies } from './typography';
import { spacing } from './spacing';

// Varsayılan (açık) tema
export const lightTheme = {
    colors: colors,
    fontSizes: fontSizes,
    fontWeights: fontWeights,
    fontFamilies: fontFamilies,
    spacing: spacing,
    // Ek olarak gölge, border radius gibi diğer stil değişkenlerini de ekleyebilirsin
    borderRadius: 8,
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
};

export const darkTheme = {
    colors: darkColors, // Dark renkleri kullan
    fontSizes: fontSizes,
    fontWeights: fontWeights,
    fontFamilies: fontFamilies,
    spacing: spacing,
    borderRadius: 8,
    shadow: {
        shadowColor: '#FFF', // Karanlık temada gölge rengi farklı olabilir
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
};

export const defaultTheme = lightTheme;