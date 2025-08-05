import { useEffect } from 'react';
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

    useEffect(() => {
        const join = async () => {
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
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'App',
                            state: {
                                routes: [
                                    {
                                        name: 'Home',
                                        state: {
                                            routes: [{ name: 'HomeMain' }]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                });
                return;
            }

            try {
                const response = await marketListApi.joinListByInviteCode(code);
                const listId = response.data.listId;

                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'App',
                            state: {
                                routes: [
                                    {
                                        name: 'Home',
                                        state: {
                                            routes: [
                                                {
                                                    name: 'MarketListDetail',
                                                    params: { listId }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                });

            } catch (err) {
                Alert.alert("Katılamadı", err.response?.data?.message || "Listeye katılırken hata oluştu.");
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'App',
                            state: {
                                routes: [
                                    {
                                        name: 'Home',
                                        state: {
                                            routes: [{ name: 'HomeMain' }]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                });
            }
        };

        join();
    }, [code, isAuthenticated]);

    return null;
}
