import axios from "axios";

export const getWeather = async (city: string) => {
    try {
        const response = await axios.get(
            `https://api.collectapi.com/weather/getWeather?lang=tr&city=${city}`,
            {
                headers: {
                    'authorization': 'apikey 4M26vHxyOBYgCcdQaSSJ5t:1eqV5HBC937Os1flSfB2AC',
                    'content-type': 'application/json'
                }
            }
        );

        // console.log('response weather',response.data);

        return response.data;
    } catch (error) {
        console.log(error);
    }
};