import React, { useCallback, useEffect, useState } from 'react';
import { View, StatusBar, SafeAreaView, Image, TextInput, TouchableOpacity, Text, ScrollView, PermissionsAndroid } from 'react-native';
import Colors from '../constants/Colors';
import tw from 'twrnc';
import { MagnifyingGlassIcon, CalendarDaysIcon, BellIcon, SunIcon, MoonIcon, ArrowDownIcon, ArrowUpIcon, Cog6ToothIcon, Cog8ToothIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocation, fetchForecast } from '../api/weather';
import * as Progress from 'react-native-progress';
import { requestForegroundPermissionsAsync, reverseGeocodeAsync, watchPositionAsync } from 'expo-location'
import style from '../styles.js';
import { WiDaySunny, WiThermometer, WiRaindrop, WiStrongWind, WiBarometer, WiFog } from 'weather-icons-react';
import Slider from '@react-native-community/slider';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import Slider from 'react-native-slider'
// import Slider from 'react-native'

// &#176;c --> degree celsius
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
    const [sunMinute, setSunMinute] = useState(0);
    const [moonMinute, setMoonMinute] = useState(0); // meaning that it is calculated from sunset to sunrise of next day
    const [sunSliderValue, setSunSliderValue] = useState(0);
    const [moonSliderValue, setMoonSliderValue] = useState(0); // meaning that it is calculated from sunset to sunrise of next day
    const [aqiInfo, setAQIInfo] = useState({ quality: "", remark: "", recommendation: "", range: "", colorCode: "" });

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
        fetchForecast({ city: q, days: 5 }).then((response) => {
            setWeather(response);
            setLoading(false);
        });
    }

    const askLocation = async () => {
        try {
            await requestForegroundPermissionsAsync();
            await watchPositionAsync({ accuracy: 2 }, (location) => {
                fetchLocalWeather(`${location.coords.latitude},${location.coords.longitude}`);
            });
        } catch (error) {
            console.log("error : ", error);
            askLocation();
        }
    }

    const handleWeatherUpdate = () => {

        // for slider of sunrise to sunset
        if (weather.forecast && weather.forecast?.forecastday && weather.current.is_day === 1) {
            // console.log('sunrise', weather.forecast.forecastday[0].astro.sunrise, 'sunset', weather.forecast.forecastday[0].astro.sunset)
            const sunrise = weather.forecast.forecastday[0].astro.sunrise;
            const sunset = weather.forecast.forecastday[0].astro.sunset;
            const timeDifference = calculateTimeDifferenceInMinutes(sunrise, sunset);
            // console.log(timeDifference);
            setSunMinute(timeDifference);
            getSliderValue(1);
        }
        else if (weather.forecast && weather.forecast?.forecastday && weather.current.is_day === 0) {
            // console.log('sunset', weather.forecast.forecastday[0].astro.sunset, 'sunrise', weather.forecast.forecastday[1].astro.sunrise)
            const sunset = weather.forecast.forecastday[0].astro.sunset;
            const sunrise = weather.forecast.forecastday[1].astro.sunrise;
            const timeFromSunsetToMidnight = calculateTimeDifferenceInMinutes(sunset, "11:59 PM");
            const timeFromMidnightToSunrise = calculateTimeDifferenceInMinutes("12:00 AM", sunrise);
            // console.log(timeFromSunsetToMidnight, timeFromMidnightToSunrise)
            const timeDifference = timeFromSunsetToMidnight + timeFromMidnightToSunrise + 1;
            // console.log(timeDifference);
            setMoonMinute(timeDifference);
            getSliderValue(0);
        }

        // to calculate the AQI
        const aqi = weather?.current?.air_quality["us-epa-index"];
        const { quality, remark, recommendation, range, colorCode } = getEPAQIDescription(aqi);
        setAQIInfo({ quality, remark, recommendation, range, colorCode });

    };

    const calculateTimeDifferenceInMinutes = (startTime, endTime) => {
        const [startHour, startMinute, startPeriod] = startTime.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
        const [endHour, endMinute, endPeriod] = endTime.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);

        const startInMinutes = (parseInt(startHour) % 12 + (startPeriod === 'PM' ? 12 : 0)) * 60 + parseInt(startMinute);
        const endInMinutes = (parseInt(endHour) % 12 + (endPeriod === 'PM' ? 12 : 0)) * 60 + parseInt(endMinute);

        return endInMinutes - startInMinutes;
    };

    const getSliderValue = (num) => {
        const currentTime = new Date();
        let time = currentTime.toLocaleTimeString().split(':').slice(0, 2).join(':');
        currentTime.getHours() > 12 ? time = time + ' PM' : time = time + ' AM';
        if (num === 1) {
            const value1 = calculateTimeDifferenceInMinutes(weather.forecast.forecastday[0].astro.sunrise, time);
            setSunSliderValue(value1);
        }
        else {
            // console.log('currentTime.getHours()',currentTime.getHours());
            let value2 = 0;
            if (currentTime.getHours() < 24) {
                value2 = calculateTimeDifferenceInMinutes(weather.forecast.forecastday[0].astro.sunset, time);
            } else {
                value2 = calculateTimeDifferenceInMinutes(weather.forecast.forecastday[0].astro.sunset, "11:59 PM") + calculateTimeDifferenceInMinutes("12:00 AM", weather.forecast.forecastday[0].astro.sunrise) + 1;
            }
            setMoonSliderValue(value2);
        }
    };

    useEffect(() => {
        handleWeatherUpdate();
    }, [weather]);

    const others = [
        { name: "UV", icon: "WiDaySunny" },
        { name: "Feels like", icon: "WiThermometer" },
        { name: "Humidity", icon: "WiRaindrop" },
        { name: "S wind", icon: "WiStrongWind" },
        { name: "Air Pressure", icon: "WiBarometer" },
        { name: "Visibility", icon: "WiFog" }
    ]
    
    const getEPAQIDescription = (index) => {
        const AQILevels = [
            { "index": 1, "quality": "Good", "range": "0-50", "colorCode": "#00E400", "remark": "Good air quality.", "recommendation": "Good for outdoor activities." },
            { "index": 2, "quality": "Moderate", "range": "51-100", "colorCode": "#FFFF00", "remark": "Moderate air quality.", "recommendation": "Safe for most, limit heavy exertion." },
            { "index": 3, "quality": "Unhealthy for Sensitive Groups", "range": "101-150", "colorCode": "#FF7E00", "remark": "Sensitive groups may feel effects.", "recommendation": "Limit prolonged exertion." },
            { "index": 4, "quality": "Unhealthy", "range": "151-200", "colorCode": "#FF0000", "remark": "Unhealthy for everyone.", "recommendation": "Avoid outdoor exertion." },
            { "index": 5, "quality": "Very Unhealthy", "range": "201-300", "colorCode": "#8F3F97", "remark": "Very unhealthy air.", "recommendation": "Stay indoors." },
            { "index": 6, "quality": "Hazardous", "range": "301-500", "colorCode": "#7E0023", "remark": "Hazardous air quality.", "recommendation": "Remain indoors, use air purifiers." }
        ];
        const aqiLevel = AQILevels.find(level => level.index === index);
        return aqiLevel ? aqiLevel : { quality: "Unknown", remark: "", recommendation: "", range: "", colorCode: "" };
    };

    return (
        <View style={tw`flex-1 relative`}>
            {/* <StatusBar style="light" /> */}
            <Image source={require('../assets/images/bg_1.jpg')} style={[tw`absolute h-full w-full`, { absoluteFillObject: false }]} blurRadius={5} />
            {
                loading
                    ?
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Progress.CircleSnail thickness={13} size={140} color="#fff" />
                    </View>
                    :
                    <View>
                        {/* search and notification/settings */}
                        <View style={[tw`px-5 mt-12 z-10 justify-between flex flex-row`, {}]}>
                            {/* search bar */}
                            <View style={tw`w-70`}>
                                {/* search input text */}
                                <View style={[tw`flex-row justify-start items-center rounded-full z-20 mb-2`,
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
                                {/* search locations */}
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
                            {/* notification/settings btn */}
                            <TouchableOpacity style={[tw`rounded-full p-3`, {}]}
                                onPress={() => setShowSearch(!showSearch)}>
                                <Cog8ToothIcon style={tw`text-white`} size="29" color="white" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView vertical showsVerticalScrollIndicator={false} contentContainerStyle={[{}, tw`pt-2 pb-32`]}>
                            {/* location,icon, temp, others(3) */}
                            <View style={[tw`content-around flex items-center`]}>
                                <Text style={[tw`text-3xl font-bold pt-4 px-3`, { color: colors.white }]}>
                                    {location?.name},
                                    <Text style={[tw`text-xl`, { color: colors.white }]}> {location?.country} </Text>
                                </Text>
                                <Image source={{ uri: 'https:' + current?.condition?.icon }} style={[tw`w-34 h-34`, {}]} />
                                <View style={tw`items-center`}>
                                    <Text style={[tw`text-5xl font-bold pt-2`, { color: colors.white }]}>{current?.temp_c}&#176;</Text>
                                    <Text style={[tw`text-lg font-medium w-85 text-center`, { color: colors.white }]}>{current?.condition?.text}</Text>
                                </View>
                            </View>
                            {/* AQI */}
                            <View style={[style.sectionGap, style.roundedCard, style.bgBlur, style.cardPadding]}>
                                <View style={tw`flex flex-row justify-between`}>
                                    <Text style={tw`text-white text-lg font-medium`}>AQI-{current?.air_quality["us-epa-index"]} ({aqiInfo.range})</Text>
                                    <View style={tw`flex flex-row items-center justify-end`}>
                                        <Text style={[tw`text-white font-medium pr-1 text-right`, { width: 120, overflow: 'scroll' }]}>
                                            {aqiInfo.quality}
                                        </Text>
                                        <Text style={[tw`rounded-full h-3.5 w-3.5`, { backgroundColor: aqiInfo.colorCode }]}></Text>
                                    </View>
                                </View>
                                <View style={tw`flex flex-col justify-between mt-1`}>
                                    <Text style={tw`text-white`}>{aqiInfo.remark}</Text>
                                    <Text style={tw`text-white`}>{aqiInfo.recommendation}</Text>
                                </View>
                            </View>

                            {/* sunset slider */}
                            {/* check if it is day then show sunrise->sunset else show sunset->sunrise */}
                            {
                                (current.is_day === 1)
                                    ?
                                    // sunrise to sunset
                                    <View>
                                        <View style={[style.sectionGap, style.roundedCard, style.bgBlur, style.cardPadding]}>
                                            <View style={tw`flex flex-row justify-between`}>
                                                <View>
                                                    <View style={tw`flex flex-row gap-1`}>
                                                        <SunIcon size="22" color="white" />
                                                        <ArrowUpIcon size="18" color="white" />
                                                    </View>
                                                    <Text style={tw`text-gray-300`}>Sunrise</Text>
                                                </View>
                                                <View>
                                                    <View style={tw`flex flex-row gap-1`}>
                                                        <ArrowDownIcon size="18" color="white" />
                                                        <SunIcon size="22" color="white" />
                                                    </View>
                                                    <Text style={tw`text-gray-300`}>Sunset</Text>
                                                </View>
                                            </View>
                                            <Slider
                                                style={[tw`mt-2 mb-1`]}
                                                minimumValue={0}
                                                maximumValue={sunMinute}
                                                minimumTrackTintColor="#ffffff"
                                                maximumTrackTintColor="#ffffff"
                                                thumbImage={require('../assets/icons/sun1.png')}
                                                value={sunSliderValue}
                                                disabled={true}
                                            />
                                            <View style={tw`flex flex-row justify-between`}>
                                                <Text style={tw`text-white text-lg font-bold`}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                                <Text style={tw`text-white text-lg font-bold`}>{weather?.forecast?.forecastday[0]?.astro?.sunset}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    // sunset to sunrise
                                    <View>
                                        <View style={[style.sectionGap, style.roundedCard, style.bgBlur, style.cardPadding]}>
                                            <View style={tw`flex flex-row justify-between`}>
                                                <View>
                                                    <View style={tw`flex flex-row gap-1`}>
                                                        <SunIcon size="22" color="white" />
                                                        <ArrowDownIcon size="18" color="white" />
                                                    </View>
                                                    <Text style={tw`text-gray-300`}>Sunset</Text>
                                                </View>
                                                <View>
                                                    <View style={tw`flex flex-row gap-1`}>
                                                        <ArrowUpIcon size="18" color="white" />
                                                        <SunIcon size="22" color="white" />
                                                    </View>
                                                    <Text style={tw`text-gray-300`}>Sunrise</Text>
                                                </View>
                                            </View>
                                            <Slider
                                                style={[tw`mt-2 mb-1`]}
                                                minimumValue={0}
                                                maximumValue={moonMinute}
                                                minimumTrackTintColor="#ffffff"
                                                maximumTrackTintColor="#ffffff"
                                                thumbImage={require('../assets/icons/sun1.png')}
                                                value={moonSliderValue}
                                                disabled={true}
                                            />
                                            <View style={tw`flex flex-row justify-between`}>
                                                <Text style={tw`text-white text-lg font-bold`}>{weather?.forecast?.forecastday[0]?.astro?.sunset}</Text>
                                                <Text style={tw`text-white text-lg font-bold`}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                            </View>
                                        </View>
                                    </View>
                            }
                            {/* hourwise temp */}
                            <View style={[style.sectionGap, style.roundedCard, style.bgBlur, style.cardPadding]}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-5`}>
                                    {
                                        weather?.forecast?.forecastday[0]?.hour?.map((item, index) => {
                                            let hour = item?.time.split(' ')[1];
                                            return (
                                                <View key={index} style={tw`flex items-center justify-center`}>
                                                    <Text style={tw`text-white`}>{hour}</Text>
                                                    <Image source={{ uri: 'https:' + item?.condition?.icon }} style={tw`h-10 w-10 my-1`} />
                                                    <Text style={tw`text-white`}>{item?.temp_c}&#176;</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                            {/* updated next forecast */}
                            <View style={[style.sectionGap, style.roundedCard, style.bgBlur, style.cardPadding]}>
                                {
                                    weather?.forecast?.forecastday?.map((item, index) => {
                                        let date = new Date(item?.date);
                                        let day = date.toLocaleString('en-US', { weekday: 'short' });
                                        let date1 = date.toLocaleString('default', { dateStyle: 'medium' }).split(' ');
                                        return (
                                            <View key={index} style={tw`flex flex-row`}>
                                                <View style={tw`w-1/3 items-center content-center flex flex-row`}>
                                                    <Text style={tw`text-white font-bold`}>{date1[0]} {date1[1]} </Text>
                                                    <Text style={tw`text-white font-bold`}>{day}</Text>
                                                </View>
                                                <View style={tw`w-1/3 items-end`}>
                                                    <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={tw`h-10 w-10`} />
                                                </View>
                                                <View style={tw`w-1/3 items-end justify-center`}>
                                                    <Text style={tw`text-white font-medium mt-0.5`}>{item?.day?.avgtemp_c}&#176;</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            {/* Other details - cards */}
                            <View style={[style.sectionGap, tw`flex flex-row flex-wrap justify-between`]}>
                                {
                                    others.map((item, index) => {
                                        return (
                                            <View key={index} style={[style.bgBlur, { width: '31%', marginVertical: 5, height: 90, paddingVertical: 10, paddingHorizontal: 13, borderRadius: 15 }]}>
                                                {/* <WiDaySunny size={24} color='#000' /> */}
                                                <Text style={[tw`text-gray-300 text-sm tracking-wider`]}>{item.name}</Text>
                                                <Text style={[tw`text-lg text-white`]}>
                                                    {
                                                        item.name === "UV" ? current?.uv
                                                            : item.name === "Feels like" ? current?.feelslike_c + '°'
                                                                : item.name === "Humidity" ? current?.humidity + '%'
                                                                    : item.name === "S wind" ? current?.wind_kph + 'km/h'
                                                                        : item.name === "Air Pressure" ? current?.pressure_mb + 'mb'
                                                                            : item.name === "Visibility" ? current?.vis_km + 'km'
                                                                                : null
                                                    }
                                                </Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View >
            }
        </View >
    );
}

export default HomeScreen;
