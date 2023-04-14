import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
        .then(response => {
          setPersons(response)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    
    const personExists = persons.find(person => person.name === newName)
    if (personExists) {
      if (window.confirm(`${personExists.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatePerson = {...personExists, number: newNumber}
        personService
          .update(personExists.id, updatePerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personExists.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          }) 
          .catch (error => {
            setErrorMessage(`The person '${updatePerson.name}' has already been deleted from the server`
            )
            setPersons(persons.filter(p => p.id !== personExists.id))
          })
      }
    } else {
      const newPerson = {name: newName, number: newNumber}
      personService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newPerson.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        }).catch(error => {
          console.log(error.response.data)
          setErrorMessage(`Error: ${error.response.data.error}`)
        })
    }
  }

  const filteredPersons = persons ? persons.filter(person => {
    const name = person.name ? person.name.toLowerCase() : ''
    const number = person.number || ''
    return name.includes(filter) || number.includes(filter)
  }) : []

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleDeletion = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id !== person.id))
          setSuccessMessage(`Succesfully deleted ${person.name} from phonebook`)
        })
        .catch(error => {
          setErrorMessage(
            `Person '${person.name}' was already deleted from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const Notification = ({ message, className }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={className}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} className="success"/>
      <Notification message={errorMessage} className="error"/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <Persons filteredPersons={filteredPersons} handleDeletion= {handleDeletion} />
    </div>
  )

}

export default App