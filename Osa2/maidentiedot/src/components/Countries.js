const Country = ({ country, showCountry }) => {
    return (
      <li>
        {country.name.common} <button onClick={() => showCountry(country.name.common)}>show</button>
      </li>
    )
  }

  const Countries = ({ filteredCountries, showCountry }) => {
    return (
        <div>
            {filteredCountries.map((country) => (
                <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => showCountry(country.name.common)}>
                        show
                    </button>
                </div>
            ))}
        </div>
    )
  }

export default Countries