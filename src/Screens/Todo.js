import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import Header from '../Components/Header';
import Icon from 'react-native-vector-icons/AntDesign';
import TodoListItem from '../Components/Todo/TodoListItem';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import database from '@react-native-firebase/database';

const PlusIcon = () => <Icon name={'pluscircle'} color={'#800000'} size={45} />

const Todo = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [listData, setListData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isFocused) {
            onGetTodos();
        }
    }, [isFocused]);

    //navigate to create task screen
    const onNavigateToCreateTask = () => {
        navigation.navigate('CreateTask');
    }

    //get todo list from database
    const onGetTodos = () => {
        setLoading(true);
        let ref = database().ref('tasks');
        ref.orderByChild('status').equalTo(false).once('value')
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

    //show alert
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

    //Mark as done a task by task id
    const markAsDoneTask = (taskId) => {
        let ref = database().ref('tasks');
        ref.child(taskId).update({
            status: true
        })
            .then(() => {
                onGetTodos();
            })
            .catch(() => {
                console.log("Error");
            });
    }

    return (
        <View style={styles.container}>
            <Header title={'Todos'} />
            {
                (loading) ?
                    <ActivityIndicator color={'#800000'} />
                    : (listData.length === 0) ?
                        <Text style={styles.nodata}>No data to be displayed</Text> :
                        <FlatList
                            style={styles.flatlist}
                            data={listData}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => <TodoListItem item={item} index={index}
                                markAsDone={markAsDoneTask} />}
                        />
            }
            <TouchableOpacity
                onPress={onNavigateToCreateTask}
                style={styles.plusIconContainer}>
                <PlusIcon />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d9d4d4'
    },
    plusIconContainer: {
        position: 'absolute',
        bottom: '2.5%',
        right: '5%'
    },
    flatlist: {
        marginTop: '2.5%'
    },
    nodata: {
        textAlign: 'center',
        marginTop: '5%',
        fontWeight: 'bold'
    }
});

export default Todo;