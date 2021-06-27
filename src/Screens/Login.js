import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Zocial';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { OnSaveUserData } from '../Services/LocalServices';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Axios from 'axios';
import database from '@react-native-firebase/database';

const FaceBookIcon = () => <Icon name={'facebook'} color={'white'} size={20} />
const GoogleIcon = () => <Icon name={'google'} color={'white'} size={20} />

const Login = () => {

    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        LoginManager.logOut();
        GoogleSignin.configure();
    }, []);

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

    //signin with google
    const onUserSignInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            let isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
            }

            const userData = await GoogleSignin.signIn();
            let email = userData.user.email;
            let name = userData.user.name;
            let image = userData.user.photo;
            onSaveUserToFirebase(email, name, image);

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                return null;
            } else if (error.code === statusCodes.IN_PROGRESS) {
                return null;
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                return null;
            } else {
                OnDisplayErrorAlert();
            }
        }
    }

    //signin iwth facebook
    const onUserSignInWithFacebook = () => {
        LoginManager
            .logInWithPermissions(['public_profile', 'email'])
            .then((result) => {
                if (result.isCancelled) {
                }
                else {
                    onGetFacebookAccessToken();
                }
            })
            .catch(error => {
                OnDisplayErrorAlert('Please ask admin to add your facebook profile to facebook developer console.');

            });
    }

    //get facebook access token
    const onGetFacebookAccessToken = () => {
        AccessToken
            .getCurrentAccessToken()
            .then(token => {
                let access_token = token.accessToken;
                onGetFacebookProfileData(access_token);
            })
            .catch(error => {
            });
    }

    //get facebook profile data
    const onGetFacebookProfileData = (token) => {
        Axios.get('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
            .then(response => {
                let email = response.data.email.toLowerCase();
                let name = response.data.name;
                let image = null;
                onSaveUserToFirebase(email, name, image);
            })
            .catch(error => {

            });
    }

    //navigate to home
    const onNavigateToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }]
        });
    }


    //check already registered users 
    const onSaveUserToFirebase = (email, name, image) => {
        setLoading(true);
        let ref = database().ref('users');
        ref.orderByChild('email').equalTo(email).once('value')
            .then(snapshot => {
                if (snapshot.val()) {
                    onRegisterUserLocally(email, name, image);
                }
                else {
                    onRegisterUserInFirebase(email, name, image)
                }
            })
            .catch(() => {
                console.log('ERROR');
            });
    }

    //save user in the database
    const onRegisterUserInFirebase = (email, name, image) => {
        let ref = database().ref('users');
        let userId = ref.push().key;
        ref.child(userId).set({
            id: userId,
            email: email,
            name: name,
            image: image
        })
            .then(() => {
                onRegisterUserLocally(email, name, image);
            })
            .catch(() => {
                OnDisplayErrorAlert();
            });
    }

    //save currently logged user in local storage
    const onRegisterUserLocally = (email, name, image) => {
        OnSaveUserData(email, name, image)
            .then(() => {
                setLoading(false);
                onNavigateToHome();
            })
            .catch(() => {
                setLoading(false);
                console.log('Error');
            });

    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Register or Signin to Simple Todo Manager</Text>
            <TouchableOpacity onPress={onUserSignInWithFacebook} style={styles.button}>
                <FaceBookIcon />
                <Text style={styles.buttonText}>Login with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onUserSignInWithGoogle}
                style={{ ...styles.button, backgroundColor: 'red' }}>
                <GoogleIcon />
                <Text style={styles.buttonText}>Login with Google</Text>
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
        justifyContent: 'center',
        backgroundColor: '#d9d4d4'
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
        paddingHorizontal: '2%',
        marginHorizontal: '10%',
        paddingHorizontal: '4%',
        color: '#800000',
        fontWeight: 'bold'
    },
    button: {
        marginTop: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'blue',
        paddingVertical: '1%',
        marginHorizontal: '10%',
        paddingHorizontal: '4%',
        borderRadius: 5
    },
    buttonText: {
        marginLeft: '4%',
        fontSize: 16,
        color: 'white'
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

export default Login;