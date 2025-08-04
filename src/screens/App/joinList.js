import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import marketListApi from '../../api/marketList';
import { Alert } from 'react-native';

export default function JoinListScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { code } = route.params;

    useEffect(() => {
        const join = async () => {
            try {
                const response = await marketListApi.joinListByInviteCode(code);
                const listId = response.data.listId;
                navigation.replace('MarketListDetail', { listId });
            } catch (err) {
                Alert.alert("Katılamadı", err.response?.data?.message || "Listeye katılırken hata oluştu.");
                navigation.replace('HomeMain');
            }
        };

        if (code) join();
    }, [code]);

    return null;
}
