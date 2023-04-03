const Person = ({ person, handleDeletion }) => {
  return (
    <li key = {person.id}>{person.name} {person.number} {" "}<button onClick={() => handleDeletion(person)}>delete</button></li>
  )
}

const Persons = ({ filteredPersons, handleDeletion }) => {
  return (
    <div>
      <h2>Numbers</h2>
        <ul>
        { filteredPersons.map((person, id) => (<Person key={person.id || id} person={person} handleDeletion={handleDeletion} />))}
        </ul>
    </div>
  )
}

export default Persons
