import axios from "axios";
const apiKey = 'key=e53a8a02d9f24b93895195632231111'
const website = 'http://api.weatherapi.com/'
export const loadData = async (city) => {
    // console.log('into loadData');
    try {
        fetchFrom = website + 'v1/current.json?' + apiKey + '&q=' + city + '&aqi=no'
        console.log('fetchFrom',fetchFrom)
        return response = await axios.get(fetchFrom);
    }
    catch {
        return alert('data can not be loaded')
    }
}