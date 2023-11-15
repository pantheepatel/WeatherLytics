import { Animated, StyleSheet, Text, View, ImageBackground, TextInput, SafeAreaView, ScrollView, Button, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const Hourly = () => {
    return (
        <View style={tw`m-4 mt-2 border border-2 rounded-xl border-gray-500 p-2`}>
            <View>
                <Text style={tw`text-white text-lg font-black mx-3`}>Hourly :</Text>
                <ScrollView horizontal={true} style={styles.containerScrollHourly}>
                    <View style={styles.containerHourly}>
                        <Ionicons name="cloud" size={24} color="skyblue" />
                        <Text style={tw`text-white`}>32</Text>
                        <Text style={tw`text-white`}>10 am</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Hourly