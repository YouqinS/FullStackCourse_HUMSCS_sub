import React, {useState, useEffect} from 'react'
import ContactInfo from "./components/ContactInfo";
import FilterContact from "./components/FilterContact";
import ContactForm from "./components/ContactForm";
import Contacts from "./services/Contacts";
import Notification from "./components/Notification";

const App = () => {
    const [contacts, setContacts] = useState([])

    const [newSearchTerm, setNewSearchTerm] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [notification, setNotification] = useState(null)

    const contactsToShow = isSearching
        ? contacts.filter(p => p.name.toLowerCase().includes(newSearchTerm.toLowerCase()))
        : contacts

    const handleSearchTermChange = (event) => {
        setIsSearching(true)
        setNewSearchTerm(event.target.value)
    }

    useEffect(() => {
        Contacts.getAll()
            .then(response => {
                setContacts(response)
            })
    }, [])

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification notification={notification}/>
            <FilterContact newSearchTerm={newSearchTerm} handleSearchTermChange={handleSearchTermChange}/>

            <h3>add a new</h3>

            <ContactForm persons={contacts} setPersons={setContacts} setNotification={setNotification}/>

            <h2>Numbers</h2>
            <div>
                {contactsToShow.map(person =>
                    <ContactInfo key={person.name} contact={person} allcontacts={contacts} setContacts={setContacts}/>
                )}
            </div>
        </div>
    )
}

export default App
