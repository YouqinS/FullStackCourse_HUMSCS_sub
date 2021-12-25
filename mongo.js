const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.6s6l8.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', phonebookSchema)

if (process.argv.length === 5) {
    const contact = new Contact({
        "name": process.argv[3],
        "number": process.argv[4]
    })

    contact.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(c => {
            console.log(`${c.name} ${c.number}`)
        })
        mongoose.connection.close()
    })
}
