let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const PORT = process.env.PORT || 3001


const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())//express json-parser
app.use(express.static('build'))
app.use(morgan('tiny'))


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

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
    const info = `<p>Phonebook has info for ${persons.length} people.</p> 
                  <p>${currentTime}</p>`
    res.send(info)
})


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    console.log(req.params)
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)
    const alreadyExist = persons.some(p => p.name === body.name)
    if (!body || !body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (alreadyExist) {
        return response.status(409).json({
            error: 'person with same name already exists'
        })
    }

    const generateId = () => {
        const maxId = persons.length === 0 ? 0 : Math.max(...persons.map(p => p.id))
        return maxId + 1
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    console.log(persons)
    response.json(person)
})
