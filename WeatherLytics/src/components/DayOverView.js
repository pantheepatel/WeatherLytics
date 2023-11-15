import { Animated, StyleSheet, Text, View, ImageBackground, TextInput, SafeAreaView, ScrollView, Button, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Feather, Ionicons,AntDesign } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const DayOverView = () => {
    return (
        <View>
            <View style={tw`m-4 mt-2 border border-2 rounded-xl border-gray-500 p-2`}>
                <View>
                    <Text style={tw`text-white text-lg font-black mx-3`}>Next Week :</Text>
                    <ScrollView horizontal={true} style={styles.containerScroll}>
                        <View style={styles.card}>
                            <Text style={styles.cardText}>Tomorrow</Text>
                            <AntDesign name="cloud" size={48} color="white" />
                            <Text style={[styles.cardText, tw`text-4xl`]}>32</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <View style={tw`m-4 mt-2 border border-2 rounded-xl border-gray-500 p-2`}>
                <View>
                    <Text style={tw`text-white text-lg font-black mx-3`}>Previous Week :</Text>
                    <ScrollView horizontal={true} style={styles.containerScroll}>
                        <View style={styles.card}>
                            <Text style={styles.cardText}>Tomorrow</Text>
                            <AntDesign name="cloud" size={48} color="white" />
                            <Text style={[styles.cardText, tw`text-4xl`]}>32</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

export default DayOverView