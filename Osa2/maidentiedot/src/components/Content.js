import { useEffect, useState } from 'react'
import countryService from '../services/countries'
import weatherService from '../services/weather'

const Content = ({ country }) => {
    const [weather, setWeather] = useState(null)
  
    useEffect(() => {
      weatherService.getWeather(country.capital)
        .then(data => setWeather(data))
        .catch(error => console.log(error));
    }, [country])
  
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
        <h3>languages</h3>
        <ul>
          {Object.values(country.languages).map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`${country.name.common} flag`} width="200px" />
        {weather && (
            <div>
                <h3>Weather in {country.capital}</h3>
                <p>temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} />
                <p>wind: {weather.wind.speed} m/s</p>
            </div>
)}
      </div>
    )
  }

  export default Content