require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact')

const app = express()


app.use(express.static('build'))
app.use(express.json())//express json-parser

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

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

app.get('/api/persons/:id', (req, res, next) => {
  console.log(req.params)
  Contact.findById(req.params.id).then(contact => {
    if (contact) {
      res.json(contact)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(request.body)
  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(newContact => newContact.toJSON())
    .then(formattedContact => {
      response.json(formattedContact)

    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => updatedContact.toJSON())
    .then(formattedContact => {
      response.json(formattedContact)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
