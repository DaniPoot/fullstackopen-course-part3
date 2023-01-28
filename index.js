const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons', (request, response) => {
  console.log(persons)
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
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
  persons.push(person)
  response.status(201).json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id == id)

  if (!person) response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id != id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
