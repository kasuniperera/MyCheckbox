import React from 'react';
import { View, Text, StyleSheet, Picker, TextInput, TouchableOpacity, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import database from '@react-native-firebase/database';
import Header from '../Components/Header';
import Icon from 'react-native-vector-icons/Entypo';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

const PlusIcon = () => <Icon name={'plus'} color={'white'} size={20} />

const CreateTask = () => {

    const navigation = useNavigation();

    const [title, setTitle] = React.useState('');
    const [date, setDate] = React.useState('');
    const [assignees, setAssignees] = React.useState([]);
    const [assigneeLoading, setAssigneeLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [dropdownData, setDropdownData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [dropdownValue, setDropdownVale] = React.useState(null);


    React.useEffect(() => {
        onGetAssignees();
    }, [])

    //save a new task
    const onSaveTask = () => {
        setLoading(true);
        let ref = database().ref('tasks');
        let assigneeData = assignees.find(item => item.id === dropdownValue)
        let taskId = ref.push().key;
        ref.child(taskId).set({
            id: taskId,
            title: title,
            assignee: assigneeData,
            date: date,
            status: false
        }).then(() => {
            setLoading(false);
            navigation.navigate('Tabs');
        })
            .catch(() => {
                setLoading(false);
                console.log("Error");
            });
    }

    //get assignees list
    const onGetAssignees = () => {
        setAssigneeLoading(true);
        let ref = database().ref('users');
        ref.once('value')
            .then(snapshot => {
                let data = Object.values(snapshot.val());
                let normalizeData = [];
                for (let i = 0; i < data.length; i++) {
                    let obj = { label: data[i].name, value: data[i].id }
                    normalizeData = [...normalizeData, obj];
                }
                setAssignees(data);
                setDropdownData(normalizeData);
                setAssigneeLoading(false);
            })
            .catch(() => {
                setAssigneeLoading(false);
                OnDisplayErrorAlert();
                console.log('ERROR in get assignees');
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

    //show activity indicator
    if (assigneeLoading) {
        return (
            <View style={styles.loadingAssigneeContainer}>
                <ActivityIndicator color={'#800000'} />
            </View>
        )
    }
    return (

        <View style={styles.container}>
            <Header title={'Create Task'} />
            <Text style={styles.text}>Title</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Task title..."
                placeholderTextColor={'grey'}
                onChangeText={(text) => setTitle(text)}
                value={title}
            />
            <Text style={styles.text}>Assignee</Text>
            <DropDownPicker
                style={styles.dropdown}
                items={dropdownData}
                value={dropdownValue}
                setValue={setDropdownVale}
                textStyle={{ color: 'black' }}
                open={open}
                setOpen={setOpen}
            />
            <Text style={styles.text}>Due Date</Text>
            <TextInput
                style={styles.textInput}
                placeholder="20/07/2021"
                placeholderTextColor={'grey'}
                onChangeText={(text) => setDate(text)}
                value={date} />
            <TouchableOpacity style={styles.button} onPress={onSaveTask}>
                <PlusIcon />
                <Text style={styles.buttonText}>Add the Task</Text>
            </TouchableOpacity>
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
        flex: 1,
        backgroundColor: '#d9d4d4',
    },
    text: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
        paddingRight: '2%',
        paddingTop: '3%',
        marginTop: '2%',
        marginHorizontal: '5%',
        fontWeight: 'bold'
    },
    textInput: {
        borderRadius: 5,
        paddingHorizontal: '2%',
        paddingVertical: '3%',
        marginVertical: '2%',
        marginHorizontal: '5%',
        backgroundColor: 'white',
        color: 'black'
    },
    button: {
        marginTop: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#800000',
        paddingVertical: '3%',
        marginHorizontal: '5%',
        paddingHorizontal: '5%',
        borderRadius: 5,
        justifyContent: 'center'
    },
    buttonText: {
        marginLeft: '4%',
        fontSize: 16,
        color: 'white'
    },
    loadingAssigneeContainer: {
        flex: 1,
        backgroundColor: '#d9d4d4',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dropdown: {
        width: '90%',
        alignSelf: 'center',
        borderColor: 'white',
        marginVertical: '2%',
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

export default CreateTask;