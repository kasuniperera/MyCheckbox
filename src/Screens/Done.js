import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import DoneListItem from '../Components/Done/DoneListItem';
import Header from '../Components/Header';
import database from '@react-native-firebase/database';
import { useIsFocused } from '@react-navigation/native'
const Done = () => {

    const isFocused = useIsFocused();

    const [listData, setListData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isFocused) {
            onGetDoneList();
        }
    }, [isFocused])

    //get done list fron database
    const onGetDoneList = () => {
        setLoading(true);
        let ref = database().ref('tasks');
        ref.orderByChild('status').equalTo(true).once('value')
            .then(snapshot => {
                if (snapshot.val() !== null) {
                    let data = Object.values(snapshot.val());
                    setListData(data);
                    setLoading(false);
                } else {
                    setListData([]);
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
                OnDisplayErrorAlert();
                console.log('ERROR');
            });
    }

    //display alert
    const OnDisplayErrorAlert = (message) => {
        Alert.alert(
            '',
            message ? message : 'Something went wrong!',
            [
                {
                    text: 'OK',
                    style: 'cancel'
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <Header title={'Done List'} />{
                (loading) ?
                    <ActivityIndicator color={'#800000'} />
                    : (listData.length === 0) ?
                        <Text style={styles.nodata}>No data to be displayed</Text> :
                        <FlatList
                            style={styles.flatlist}
                            data={listData}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => <DoneListItem item={item} index={index} />}
                        />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d9d4d4'
    },
    flatlist: {
        marginTop: '2.5%'
    },
    nodata: {
        textAlign: 'center',
        marginTop: '5%',
        fontWeight: 'bold'
    }

})
export default Done;