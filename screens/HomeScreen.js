import React, { useCallback, useEffect, useState } from 'react';
import { View, StatusBar, SafeAreaView, Image, TextInput, TouchableOpacity, Text, ScrollView, PermissionsAndroid } from 'react-native';
import Colors from '../constants/Colors';
import tw from 'twrnc';
import { MagnifyingGlassIcon, CalendarDaysIcon, BellIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocation, fetchForecast } from '../api/weather';
import * as Progress from 'react-native-progress';
import { requestForegroundPermissionsAsync, reverseGeocodeAsync, watchPositionAsync } from 'expo-location'

function HomeScreen() {
    const colors = {
        black: '#22252d',
        white: '#fff',
        gray: '#636172',
        blue: '#6c64fb',
        lightblue: '#748cf1',
        tomato: '#9e616b',
    };
    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);

    const handleLocation = (location) => {
        setLocations([]);
        setShowSearch(false);
        setLoading(true);
        fetchForecast({ city: location.name, days: 5 }).then((response) => {
            setWeather(response);
            setLoading(false);
        });
    }

    const handleSearch = (value) => {
        if (value.length >= 2) {
            fetchLocation({ city: value }).then((response) => {
                setLocations(response);
            });
        }
    }

    const debouncedSearch = useCallback(debounce(handleSearch, 600), []);
    const { current, location } = weather;

    useEffect(() => {
        // if (loading && !err)
        askLocation();
        // fetchLocalWeather();
    }, []);

    const fetchLocalWeather = async (q) => {
        console.log("q : ", q)
        fetchForecast({ city: q, days: 5 }).then((response) => {
            console.log("response : ", response)
            setWeather(response);
            setLoading(false);
        });
    }

    const askLocation = async () => {
        console.log("askLocation")
        try {
            await requestForegroundPermissionsAsync();
            await watchPositionAsync({ accuracy: 2 }, (location) => {
                console.log("lat , lon : ", location.coords.latitude, location.coords.longitude);
                fetchLocalWeather(`${location.coords.latitude},${location.coords.longitude}`);
            });
        } catch (error) {
            console.log("error : ", error);
            askLocation();
        }
    }

    return (
        <View style={tw`flex-1 relative`}>
            <StatusBar style="light" />
            <Image source={require('../assets/images/bg_1.jpg')} style={[tw`absolute h-full w-full`, { absoluteFillObject: false }]} blurRadius={5} />
            {
                loading
                    ?
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Progress.CircleSnail thickness={13} size={140} color="#fff" />
                    </View>
                    :
                    <View>
                        <View style={[tw`px-5 mt-12 z-10 justify-between flex flex-row`, {}]}>
                            <View style={tw`w-70`}>
                                <View style={[tw`flex-row justify-start items-center rounded-full z-20`,
                                { backgroundColor: showSearch ? 'rgba(255,255,255,0.2)' : 'transparent' }]}>
                                    <TouchableOpacity style={[tw`rounded-full p-3`, { backgroundColor: 'rgba(255,255,255,0.4)' }]}
                                        onPress={() => setShowSearch(!showSearch)}>
                                        <MagnifyingGlassIcon style={tw`text-white`} size="25" color="white" />
                                    </TouchableOpacity>
                                    {
                                        showSearch &&
                                        <TextInput
                                            placeholder="Search City"
                                            placeholderTextColor={colors.white}
                                            autoFocus={true}
                                            style={[tw`pl-3 flex-1 text-base text-white text-lg`, { backgroundColor: 'transparent' }]}
                                            onChangeText={debouncedSearch}
                                        />
                                    }
                                </View>
                                {
                                    showSearch && locations.length > 0 &&
                                    <View style={[tw`absolute w-full bg-gray-200 rounded-2xl top-16 py-1`]}>
                                        {locations.map((loc, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleLocation(loc)}
                                                style={[tw`flex-row items-center py-3 px-4`, index < locations.length - 1 ? tw`border-b-2 border-b-gray-400` : ``]}>
                                                <MapPinIcon size="16" color="gray" />
                                                <Text style={tw`ml-1 text-black`}>{loc?.name}, {loc?.country}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                }
                            </View>

                            {/* notification btn */}
                            <TouchableOpacity style={[tw`rounded-full p-3`, {}]}
                                onPress={() => setShowSearch(!showSearch)}>
                                <BellIcon style={tw`text-white`} size="25" color="white" />
                            </TouchableOpacity>

                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-20 py-2`}>
                            <View style={[tw`content-around flex items-center`]}>
                                <Text style={[tw`text-3xl font-bold pt-4 px-3`, { color: colors.white }]}>
                                    {location?.name},
                                    <Text style={[tw`text-xl`, { color: colors.white }]}> {location?.country} </Text>
                                </Text>
                                <Image source={{ uri: 'https:' + current?.condition?.icon }} style={[tw`w-34 h-34`, {}]} />
                                <View style={tw`items-center`}>
                                    <Text style={[tw`text-5xl font-bold pt-2`, { color: colors.white }]}>{current?.temp_c}&#176;c</Text>
                                    <Text style={[tw`text-lg font-medium w-85 text-center`, { color: colors.white }]}>{current?.condition?.text}</Text>
                                </View>
                                <View style={tw`flex flex-row justify-evenly w-full mt-4`}>
                                    <View style={tw`flex flex-row items-center gap-2`}>
                                        <Image source={require('../assets/images/wind.png')} style={tw`w-6 h-6`} />
                                        <Text style={tw`text-white font-medium`}>{current?.wind_kph}km/h</Text>
                                    </View>
                                    <View style={tw`flex flex-row items-center gap-2`}>
                                        <Image source={require('../assets/images/rain.png')} style={tw`w-6 h-6`} />
                                        <Text style={tw`text-white font-medium`}>{current?.humidity}%</Text>
                                    </View>
                                    <View style={tw`flex flex-row items-center gap-2`}>
                                        <Image source={require('../assets/images/thermometer.png')} style={tw`w-6 h-6`} />
                                        <Text style={tw`text-white font-medium`}>{current?.feelslike_c}&#176;c</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={tw`mx-5 mt-5`}>
                                <View style={tw`flex-row items-center gap-2 pb-2`}>
                                    <CalendarDaysIcon size="22" color="white" />
                                    <Text style={tw`text-white font-medium text-lg`}>Next Forecast</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2.5`}>
                                    {weather?.forecast?.forecastday?.map((item, index) => {
                                        let date = new Date(item?.date);
                                        let day = date.toLocaleString('en-US', { weekday: 'long' });
                                        let date1 = date.toLocaleString('default', { dateStyle: 'medium' });
                                        return (
                                            <View key={index} style={[tw`flex items-center rounded-2xl w-35 py-4 px-0.5`, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                                <Text style={tw`text-white font-bold mb-3`}>{day}</Text>
                                                <Text style={tw`text-white font-bold mb-3`}>{date1}</Text>
                                                <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={tw`h-12 w-12`} />
                                                <Text style={tw`text-white font-medium mt-1 mb-0.5`} numberOfLines={1} ellipsizeMode='tail'>{item?.day?.condition?.text}</Text>
                                                <Text style={tw`text-white font-medium mt-0.5`}>{item?.day?.avgtemp_c}&#176;c</Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
            }
        </View>
    );
}

export default HomeScreen;
