import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { onGetUserData } from '../Services/LocalServices';

const Header = ({ title }) => {

    const [userImage, setUserImage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        onSetUserData();
    }, [])

    const onSetUserData = () => {
        setLoading(true);
        onGetUserData()
            .then((data) => {
                setUserImage(data.image);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                console.log('Something went wrong!');
            })
    }


    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            {
                (userImage) ?
                    <View>
                        <Image
                            style={styles.image}
                            source={{ uri: userImage }}
                        />
                    </View>
                    :
                    <View>
                        <Image
                            style={styles.image}
                            source={require('../Assets/user.png')}
                        />
                    </View>
            }
            {
                (loading) &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={'#800000'} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#800000',
        justifyContent: 'space-between',
        paddingHorizontal: '2.5%',
        paddingVertical: '3%',
        elevation: 5
    },
    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 100,
        alignSelf: 'flex-end'
    },
    loadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        fontSize: 14,
        color: 'black'
    }
});

export default Header;