import React from "react";
import Contacts from "../services/Contacts";

const ContactInfo = ({ contact, allcontacts, setContacts }) => {
    const deleteContact = () => {
        if (window.confirm(`sure to delete ${contact.name} ?`)) {
            Contacts.remove(contact.id).then(
                response => {
                    if (response.status === 200) {
                        setContacts(allcontacts.filter(c => c.id !== contact.id))

                    }
                }
            )
        }
    }

    return (
        <p>{contact.name} {contact.number}
            <button onClick={deleteContact}>delete</button>
        </p>
    )
}
export default ContactInfo
