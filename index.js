
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact')

const app = express()


app.use(express.json())//express json-parser
app.use(express.static('build'))

morgan.token('type', (req) => {
    return req.method === 'POST'
        ? JSON.stringify(req.body)
        : null
})

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.type(req, res)
    ].join(' ')
}))


//routes
app.get('/info', (req, res) => {
    const currentTime = new Date()
    Contact.find({}).then(contact => {
        const info = `<p>Phonebook has info for ${contact.length} people.</p> 
                      <p>${currentTime}</p>`
        res.send(info)
    })
})


app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contact => {
        res.json(contact)
    })
})

app.get('/api/persons/:id', (req, res) => {
    console.log(req.params)
    const id = Number(req.params.id)
    Contact.findById(req.params.id).then(contact => {
        res.json(contact)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)
    //const alreadyExist = persons.some(p => p.name === body.name)
    if (!body || !body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } /*else if (alreadyExist) {
        return response.status(409).json({
            error: 'person with same name already exists'
        })
    }*/

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save().then(newContact => {
        response.json(newContact)
    })
})



const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
