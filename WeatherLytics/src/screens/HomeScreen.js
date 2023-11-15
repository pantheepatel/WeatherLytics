import { Animated, StyleSheet, Text, View, ImageBackground, TextInput, SafeAreaView, ScrollView, Button, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect,useState } from 'react'
import tw from 'twrnc'
import { Feather, Ionicons } from '@expo/vector-icons';
import Searchbar from '../components/Searchbar';
import DayOverView from '../components/DayOverView';
import Hourly from '../components/Hourly';
import { styles } from '../styles/styles';
import { loadData } from '../services/mainService';
export default function HomeScreen() {

    const [weatherData, setWeatherData] = useState('')
    useEffect(() => {
        loadData('ahmedabad')
            .then(response => {
                // console.log('response.data',response.data)
                setWeatherData(response.data) 
                // console.log(weatherData.location.name)
            }
            )
    },[])

    return (
        <ScrollView>
            <ImageBackground source={require('../assets/images/bg5.jpeg')} style={tw`h-full w-full `} resizeMode="cover" blurRadius={10}>
                {/* main card */}
                <View style={tw`m-4 mt-10 border border-2 rounded-xl border-gray-500`}>
                    <Searchbar />
                    <View style={styles.containerDateTime}>
                        {/* <Text style={tw`text-white font-black mx-auto`}> {weatherData.location.localtime.split(' ')[0]} </Text> */}
                        {/* <Text style={tw`text-white font-black mx-auto`}> 7:30 AM</Text> */}
                    </View>
                    <Text style={tw`text-white font-semibold text-lg mx-auto mt-5`}>{weatherData.location.name} , {weatherData.location.region}</Text>
                    <View style={tw``}>
                        <View>
                            {/* <Animated className="timing"></Animated> */}
                            <Ionicons name='sunny' color='#FDB813' size={78} style={[tw`mx-auto my-4 shadow shadow-black shadow-lg`]} />
                            <Text style={tw`text-white font-black text-4xl mx-auto`}> It's Sunny </Text>
                        </View>
                        <Text style={tw`text-white font-black text-7xl mx-auto mt-5`}>{weatherData.condition.feelslike_c}</Text>
                        {/* overview (3) */}
                        <View style={styles.containerSubdetails}>
                            <View style={styles.containerSubdetailsText}>
                                {/* <FontAwesomeIcon name='wind' style={tw`text-white text-8xl mx-auto`} /> */}
                                <Text style={tw`text-white font-bold text-lg`}>feels</Text>
                                <Text style={tw`text-white font-bold text-lg`}>32</Text>
                            </View>
                            <View style={styles.verticalLine} />
                            <View style={styles.containerSubdetailsText}>
                                {/* <FontAwesomeIcon name='droplet' style={tw`text-white text-8xl mx-auto`} /> */}
                                <Text style={tw`text-white font-bold text-lg`}>humidity</Text>
                                <Text style={tw`text-white font-bold text-lg`}>32</Text>
                            </View>
                            <View style={styles.verticalLine} />
                            <View style={styles.containerSubdetailsText}>
                                {/* <FontAwesomeIcon name='tempratureHalf' style={tw`text-white text-8xl mx-auto`} /> */}
                                <Text style={tw`text-white font-bold text-lg`}>wind</Text>
                                <Text style={tw`text-white font-bold text-lg`}>32</Text>
                            </View>
                        </View>
                        <TouchableWithoutFeedback>
                            <View style={styles.knowMoreButton}>
                                <Text>
                                    Know More
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                {/* to display hourly data */}
                <Hourly />
                {/* to display prev days and next days data */}
                <DayOverView />
            </ImageBackground>
        </ScrollView>
    )
}
