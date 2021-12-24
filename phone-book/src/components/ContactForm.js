import React, {useState} from "react";
import Contacts from "../services/Contacts";

const ContactForm = ({persons, setPersons, setNotification}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const addContact = (event) => {
        event.preventDefault()

        const alreadyExist = () => {
            return contact => contact.name === newName && contact.number === newNumber;
        }

        const samePersonNewNumber = () => {
            return contact => contact.name === newName && contact.number !== newNumber;
        }

        if (persons.some(alreadyExist())) {
            window.alert(`${newName} is already added to phonebook`);
        } else if ((newName && newName.trim()) && (newNumber && newNumber.trim())) {
            if (persons.some(samePersonNewNumber())) {
               if (window.confirm(`${newName} is already added to phonebook, replace the old number?`)) {
                   const contactToBeUpdated = persons.find(p => p.name === newName)
                   const updatedContact = {...contactToBeUpdated, number: newNumber}

                   Contacts.update(contactToBeUpdated.id, updatedContact).then(
                       response => {
                           setPersons(persons.map(p => p.name === newName ? response : p))
                           setNewName('')
                           setNewNumber('')
                           const notification = {
                               "message": `contact ${newName} is updated with new number successfully`,
                               "isError": false
                           }
                           setNotification(notification)
                           setTimeout(() => {
                               setNotification(null)
                           }, 3000)
                       }).catch(error => {
                       const notification = {
                           "message":  `Information of '${contactToBeUpdated.name}' has been removed from server`,
                           "isError": true
                       }
                       setNotification(notification)
                       setTimeout(() => {
                           setNotification(null)
                       }, 3000)
                       setPersons(persons.filter(n => n.name !== newName))
                   })
               }
            } else {
                const personObj = {
                    name: newName,
                    number: newNumber
                }
                Contacts.create(personObj).then(
                    response => {
                        setPersons(persons.concat(response))
                        setNewName('')
                        setNewNumber('')
                        const notification = {
                            "message":  `contact ${newName} is added successfully`,
                            "isError": false
                        }
                        setNotification(notification)
                        setTimeout(() => {
                            setNotification(null)
                        }, 3000)
                    }
                )
            }
        }
    }

    return (
        <div>
            <form onSubmit={addContact}>
                <div>name: <input value={newName} onChange={handleNameChange}/></div>
                <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default ContactForm
