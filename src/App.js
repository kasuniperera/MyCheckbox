import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './Screens/Login';
import Todo from './Screens/Todo';
import Done from './Screens/Done';
import Logout from './Screens/Logout';
import CreateTask from './Screens/CreateTask';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { onGetUserData } from './Services/LocalServices';
import Loading from './Screens/Loading';
import firebase from '@react-native-firebase/app';
import UpdateTask from './Screens/UpdateTask';


var firebaseConfig = {
    apiKey: "AIzaSyCHHLchGBI76zbkIL7OQgIybFhdRV-6yvM",
    authDomain: "react-native-todo-4085b.firebaseapp.com",
    databaseURL: "https://react-native-todo-4085b-default-rtdb.firebaseio.com",
    projectId: "react-native-todo-4085b",
    storageBucket: "react-native-todo-4085b.appspot.com",
    messagingSenderId: "813408476475",
    appId: "1:813408476475:web:af3ce19880c121f616ab1e"
};

//firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();


const TabNavigator = () => {
    return (
        <Tabs.Navigator
            tabBarOptions={{
                keyboardHidesTabBar: true,
                activeTintColor: '#800000',
                inactiveTintColor: 'black',
                labelStyle: { fontSize: 12, marginBottom: '2%', fontWeight: 'bold' },
            }}
        >
            <Tabs.Screen
                name={'Todo'}
                component={Todo}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name={'th-list'} color={color} size={20} />
                    ),
                }}
            />
            <Tabs.Screen
                name={'Done'}
                component={Done}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name={'clipboard-check'} color={color} size={20} />
                    ),
                }}
            />
            <Tabs.Screen
                name={'Logout'}
                component={Logout}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name={'power-off'} color={color} size={20} />
                    ),
                }}
            />
        </Tabs.Navigator>
    )
}

const Root = () => {

    const [userData, setUserData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    //get user from local storage
    const onSetUserData = () => {
        onGetUserData()
            .then((data) => {
                setUserData(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                console.log('Something went wrong!');
            })
    }

    React.useEffect(() => {
        onSetUserData();
    }, []);


    return (
        <Stack.Navigator headerMode={'none'}>
            {
                (loading) ? <Stack.Screen name={'Loading'} component={Loading} />
                    : (userData) ?
                        <>
                            <Stack.Screen name={'Tabs'} component={TabNavigator} />
                            <Stack.Screen name={'CreateTask'} component={CreateTask} />
                            <Stack.Screen name={'UpdateTask'} component={UpdateTask} />
                            <Stack.Screen name={'Login'} component={Login} />
                        </>
                        :
                        <>
                            <Stack.Screen name={'Login'} component={Login} />
                            <Stack.Screen name={'Tabs'} component={TabNavigator} />
                            <Stack.Screen name={'CreateTask'} component={CreateTask} />
                            <Stack.Screen name={'UpdateTask'} component={UpdateTask} />
                        </>

            }
        </Stack.Navigator>
    )

}

const App = () => {
    return (
        <NavigationContainer>
            <Root />
        </NavigationContainer>
    )
}

export default App;