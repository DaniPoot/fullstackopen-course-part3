require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/Entries')

app.use(cors())
app.use(express.json())
morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

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

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has infor for 2 people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons', (request, response, next) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { body } = request 
  const { name, number } = body
  const id = Math.floor(Math.random() * 10001)
  const person = { id, name, number }


  if (!name) {
    return response.status(409).json({ 
      error: 'name missing' 
    })
  }
  if (!number) {
    return response.status(409).json({ 
      error: 'number missing' 
    })
  }

  const nameExist = persons.some(person => person.name == name)
  if (nameExist) {
    return response.status(409).json({ 
      error: 'name must be unique'
    })
  }
  const entry = new Entry({ name, number })

  entry.save()
  .then(savedEntry => {
    response.status(201).json(savedEntry)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const person = persons.find(person => person.id == id)

  if (!person) response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Entry.findByIdAndDelete(id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
