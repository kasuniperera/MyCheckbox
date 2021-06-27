import React from 'react';
import {Text, StyleSheet, TouchableOpacity } from 'react-native';

const Swiper = ({ markAsDone, id }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => markAsDone(id)}>
            <Text style={styles.text}>Mark as</Text>
            <Text style={styles.text}>Done</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#800000',
        marginVertical: '2%',
        marginRight: '5%',
        paddingHorizontal: '2%',
        paddingRight: '4%',
        marginLeft: '-50%',
        paddingLeft: '50%',
        paddingVertical: '3%',
        elevation: 5,
        borderRadius: 5,
    },
    text: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold'
    }
});

export default Swiper;