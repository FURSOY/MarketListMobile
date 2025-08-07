import { useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import marketListApi from '../../api/marketList';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function JoinListScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};
    const code = params.code;
    const { isAuthenticated } = useAuth();

    // Ana sayfaya (HomeMain) yönlendirme fonksiyonu
    const navigateToHomeMain = useCallback(() => {
        // Navigasyon yığınını sıfırla ve AppStack'in varsayılan başlangıç ekranına (HomeMain) git
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'App', // RootNavigator'daki ana AppStack'in adı
                    state: {
                        routes: [
                            {
                                name: 'Home', // AppStack içindeki 'Home' sekmesinin adı (Bottom Tab Navigator)
                                state: {
                                    routes: [
                                        { name: 'HomeMain' } // Home sekmesi içindeki Stack Navigator'ın varsayılan ekranı
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        });
    }, [navigation]);

    useEffect(() => {
        const handleJoinLogic = async () => {
            if (!isAuthenticated) {
                console.log("Kullanıcı oturum açmamış, login ekranına yönlendiriliyor.");
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                });
                return;
            }

            if (!code) {
                console.log("Deep link kodu yok, HomeMain'e yönlendiriliyor.");
                // Deep link kodu yoksa ana sayfaya yönlendir
                navigateToHomeMain();
                return;
            }

            try {
                console.log("Katılma kodu:", code);
                const response = await marketListApi.joinListByInviteCode(code);
                Alert.alert("Başarılı", "Listeye başarıyla katıldınız!");
                navigateToHomeMain();

            } catch (err) {
                // Hata durumunda kullanıcıyı bilgilendir ve ana sayfaya yönlendir
                Alert.alert("Katılamadı", err.response?.data?.message || "Listeye katılırken hata oluştu.");
                console.error("API'den hata yanıtı geldi:", err.response?.data || err.message);
                navigateToHomeMain(); // Hata durumunda ana sayfaya yönlendir
            }
        };

        handleJoinLogic();
    }, [code, isAuthenticated, navigateToHomeMain, navigation]); // Bağımlılıklardan navigateToMarketListDetail kaldırıldı

    return null; // Bu ekran sadece yönlendirme yaptığı için herhangi bir UI render etmez
}
