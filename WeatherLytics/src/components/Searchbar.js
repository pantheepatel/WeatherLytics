import { Animated,StyleSheet, Text, View, ImageBackground, TextInput, SafeAreaView, ScrollView, Button, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Feather,Ionicons,AntDesign } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const Searchbar = () => {
    return (
        <View>
            <TextInput style={tw`bg-white m-5 p-2 px-4`} >
            <Text>Search here</Text>
            <Ionicons name="search" size={18} color="black" />
            </TextInput>
        </View>
    )
}

export default Searchbar