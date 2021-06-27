import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_DATA } from './LocalKeys';

//save currently logged user in local storage
export const OnSaveUserData = async (email, name, image) => {
    let userData = { email, name, image };
    let data = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA, data);
}

//get currently logged user from local storage
export const onGetUserData = async () => {
    let userData = await AsyncStorage.getItem(USER_DATA);
    userData = JSON.parse(userData);
    return userData;
}

//remove currently logged user from local storage
export const onRemoveUser = async () => {
    await AsyncStorage.removeItem(USER_DATA);
}
