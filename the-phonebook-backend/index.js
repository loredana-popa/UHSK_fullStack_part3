require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

app.use(cors())

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    next(error)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error)) 
})

const generateId = () => {
  const nr = Math.floor(Math.random() * 1000);
    return nr
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  const name = persons.find(person => person.name === body.name)
  
  if(body.name === "" || body.number === "") {
    return response.status(400).json({
      error:'The name or number is missing'
    })
  } else if (name) {
    return response.status(400).json({
      error:'name must be unique'
    })
  }

  const person = new Person({
    name : body.name,
    number : body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log('body is', body)

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const entriesNr =  persons.length
  const date = new Date()
  response.send(
    `<html> <p>Phonebook has info for ${entriesNr} people</p><p>${date}</p></html>`  )
})


morgan.token('content', function(req, res) {
  return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  
  next(error)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)