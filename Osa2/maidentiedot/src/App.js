import { useState, useEffect } from "react"
import Filter from './components/Filter'
import Countries from './components/Countries'
import Content from "./components/Content"
import countryService from './services/countries'

const App = () => {
   const [countries, setCountries] = useState([])
   const [filter, setFilter] = useState('')
   
   useEffect(() => {
    countryService
        .getAll()
        .then(response => {
            setCountries(response)
        })
   }, [])

   const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
    )

    const handleFilterChange = (event) => setFilter(event.target.value)

    const showCountry = (countryName) => {
        setFilter(countryName)
    }

    return(
        <div>
                <Filter filter={filter} handleFilterChange={handleFilterChange} />
                {filteredCountries.length === 1 ? (
                <Content country={filteredCountries[0]} />
            ) : filteredCountries.length <= 10 ? (
                <Countries filteredCountries={filteredCountries} showCountry={showCountry} />
            ) : (
                <p>Too many matches, specify another filter</p>
            )}
    </div>
    )
}

export default App