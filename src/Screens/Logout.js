import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { onRemoveUser } from '../Services/LocalServices';
import { useNavigation} from '@react-navigation/native';

const Logout = () => {

    const navigation = useNavigation();

    //navigate to login screen
    const onNavigateToLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    }

    //logout
    const onSignOutUser = () => {
        onRemoveUser()
            .then(() => {

                onNavigateToLogin();
            })
            .catch(() => {
                console.log('Error');
            });
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onSignOutUser}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d9d4d4',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#800000',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default Logout;