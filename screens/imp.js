
// <View key={index} style={[tw`flex flex-row items-center w-1/2 py-3 px-3`, style.roundedCard, style.bgBlur]}>
//     <View style={tw`w-1/3 items-center`}>
//         {item.name === "UV" && <WiDaySunny size={30} color="white" />}
//         {item.name === "Feels like" && <WiThermometer size={30} color="white" />}
//         {item.name === "Humidity" && <WiRaindrop size={30} color="white" />}
//         {item.name === "S wind" && <WiStrongWind size={30} color="white" />}
//         {item.name === "Air Pressure" && <WiBarometer size={30} color="white" />}
//         {item.name === "Visibility" && <WiFog size={30} color="white" />}
//     </View>
//     <View style={tw`w-2/3 items-end`}>
//         <Text style={tw`text-white font-bold`}>{item.name}</Text>
//         <Text style={tw`text-white font-medium`}>
//             {item.name === "UV" && current?.uv}
//             {item.name === "Feels like" && current?.feelslike_c}&#176;
//             {item.name === "Humidity" && current?.humidity}%
//             {item.name === "S wind" && current?.wind_kph}km/h
//             {item.name === "Air Pressure" && current?.pressure_mb}mb
//             {item.name === "Visibility" && current?.vis_km}km
//         </Text>
//     </View>
// </View>


{/* <View style={tw`flex flex-row justify-evenly w-full mt-4`}>
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
    <Text style={tw`text-white font-medium`}>{current?.feelslike_c}&#176;</Text>
</View>
</View> */}


{/* next forecast */ }
{/* <View style={style.sectionGap}>
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
                <View key={index} style={[tw`flex items-center w-35 py-4 px-0.5`, style.roundedCard, style.bgBlur]}>
                    <Text style={tw`text-white font-bold mb-3`}>{day}</Text>
                    <Text style={tw`text-white font-bold mb-3`}>{date1}</Text>
                    <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={tw`h-12 w-12`} />
                    <Text style={tw`text-white font-medium mt-1 mb-0.5`} numberOfLines={1} ellipsizeMode='tail'>{item?.day?.condition?.text}</Text>
                    <Text style={tw`text-white font-medium mt-0.5`}>{item?.day?.avgtemp_c}</Text>
                </View>
            );
        })}
    </ScrollView>
</View> */}