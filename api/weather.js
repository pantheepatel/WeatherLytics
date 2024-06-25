import axios from 'axios';
// import { apikey } from '../constants/index';
const apikey = "7df6bd28e36e4827a95160655241206";

const forecast = params => `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.city}&days=${params.days}&aqi=yes&alerts=no`;
const location = params => `https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${params.city}`;

const apicall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint,
    }
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (err) {
        console.log('Error in api call', err);
        return null;
    }
}
export const fetchForecast = params => {
    return apicall(forecast(params));
}
export const fetchLocation = params => {
    return apicall(location(params));
}