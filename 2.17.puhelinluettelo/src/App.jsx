import { useState, useEffect } from 'react'
import NoteServices from './services/persons'
import ShowAll from './components/showAll'

const msg = {
  color: 'green',
  background: 'lightgrey',
  fontSize: 18,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const error = {
  color: 'red',
  background: 'lightgrey',
  fontSize: 18,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={msg}>
      {message}
    </div>
  )
}
const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={error}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')
  
  const [newFilter, setNewFilter] = useState('')

  const [newMessage, setMessage] = useState(null)
  
  const [newErrorMessage, setErrorMessage] = useState(null)
  
  
  
  useEffect(() => {
    NoteServices
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])


  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }  
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }  

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }  

  const deleteEntry = (entry) => {
    if (window.confirm(`Delete ${entry.name} ?`)){
    const id = entry.id
    console.log("Deleting id" + id)
    NoteServices
    .deleteName(id)
    .then(() => {
      setPersons(persons.filter(person => person.id !== id))
      setMessage(
        `Removed ${entry.name}`
      )
      setTimeout(() => {
        setMessage(null)
      }, 7000)
    })
    .catch(error => {
      setErrorMessage(
        `Name '${entry.name}' was already removed from server`
      )
      setPersons(persons.filter(person => person.id !== id))
      setTimeout(() => {
        setErrorMessage(null)
      }, 7000)})
  }
    
  }

  const addEntry = (event) => {
    console.log('addName')
     event.preventDefault()
     const if_found = persons.find(person => person.name === newName)
     if (if_found === undefined)
      {
        const nameObject = {
        name: newName,
        number: newNumber,
      }
      NoteServices
      .create(nameObject)
      .then(response => {
        console.log(response)
        setPersons(persons.concat(response))
        setMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 7000)
        setNewName('')
        setNewNumber('')}
      )}
    else 
    {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
    {
      const nameToFind = persons.find(n => n.name === newName)
      const id = nameToFind.id
      const updateObject = { ...nameToFind, number: newNumber}
      NoteServices 
      .update(id, updateObject)
      .then(returnedEntry => {setPersons(persons.map(name => name.id !== id ? name : returnedEntry))
        setMessage(
          `Updated ${newName}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 7000)
      }
  )
  .catch(error => {
    setErrorMessage(
      `Person '${entry.name}' was already removed from server`
    )
    setPersons(persons.filter(person => person.id !== id))
    setTimeout(() => {
      setErrorMessage(null)
    }, 7000)})

    }
    setNewName('')}
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage} />
      <ErrorNotification message={newErrorMessage} />
      <div>
          filter shown with<input value={newFilter} onChange={handleFilterChange} />
        </div>
      <h3>add a new</h3>
      
      <form onSubmit={addEntry}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form> 
      <h3>Numbers</h3>
      <ShowAll persons = {persons} newFilter={newFilter} deleteEntry = {deleteEntry} />
    </div>
  )
}


export default App