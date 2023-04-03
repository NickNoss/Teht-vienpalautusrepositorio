import axios from 'axios'

const API_KEY = process.env.REACT_APP_API_KEY
console.log(process.env)
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`

const getWeather = async (city) => {
    try {
        const response = await axios.get(`${baseUrl}&q=${city}`)
        console.log('success!', response.data)
        return response.data
    } catch (error) {
        console.log('fail', error)
        throw error
    }
}

export default { getWeather }
