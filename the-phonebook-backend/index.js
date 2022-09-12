
const { response, request } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const nr = Math.floor(Math.random() * 1000);
    return nr
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  const name = persons.find(person => person.name === body.name)
  console.log(name)

  if(body.name === "" || body.number === "") {
    return response.status(404).json({
      error:'The name or number is missing'
    })
  } else if (name) {
    return response.status(404).json({
      error:'name must be unique'
    })


  }

  const person = {
    id : generateId(),
    name : body.name,
    number : body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const entriesNr =  persons.length
  const date = new Date()
  response.send(
    `<html> <p>Phonebook has info for ${entriesNr} people</p><p>${date}</p></html>`  )
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
