import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Swipeable } from 'react-native-gesture-handler';
import Swiper from './Swiper';
import { useNavigation } from '@react-navigation/native';

const DateIcon = () => <Icon name={'calendar-week'} color={'grey'} size={20} />

const TodoListItem = ({ item, index, markAsDone }) => {
    const navigation = useNavigation();

    return (
        <Swipeable
            renderRightActions={() => <Swiper markAsDone={markAsDone} id={item.id} />}
        >
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    navigation.navigate('UpdateTask', {
                        existTitle: item.title,
                        existDate: item.date.toString(),
                        id: item.id,
                        existAssignee: item.assignee.id
                    });
                }}>
                <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.dateContainer}>
                        <DateIcon />
                        <Text style={styles.date}>{item.date.toString()}</Text>
                    </View>
                </View>
                {
                    (item.assignee.image) ?
                        <View style={styles.assignee}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.assignee.image }}
                            />
                            <Text>
                                {item.assignee.name}
                            </Text>
                        </View>
                        :
                        <View>
                            <Image
                                style={styles.image}
                                source={require('../../Assets/user.png')}
                            />
                            <Text>
                                {item.assignee.name}
                            </Text>
                        </View>
                }
            </TouchableOpacity>
        </Swipeable>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginVertical: '2%',
        marginHorizontal: '5%',
        paddingHorizontal: '2%',
        paddingVertical: '3%',
        elevation: 5,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '4%'
    },
    date: {
        fontSize: 12,
        color: 'black',
        marginLeft: '5%'
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 100,
        alignSelf: 'flex-end'
    },
    assignee: {
        flexDirection: 'column'
    }
});

export default TodoListItem;