const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))

app.use(express.json())
var morgan = require('morgan')
morgan.token('content', function (req, res) { return JSON.stringify(req.body)})
let command = ':method :url :status :res[content-length] - :response-time ms :content'
app.use(morgan(command))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Content missing' })
  } 
  else if (error.status === 404)
  {
    return response.status(404).send({ error: 'Unknown endpoint' })
  }
  next(error)
}

const cors = require('cors')


app.use(cors())
app.use(express.json())
app.use(requestLogger)



app.get('/', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)
  })
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
    })
  })

app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
  const count = persons.length;
  const Time = new Date();
  let msg = `Phonebook has info for ${count} people<br><br>${Time}`;
  response.send(msg);
  })
  })


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => 
      {
    if (person) {
        response.json(person)
        } else {
        const error = new Error('Person not found')
        error.status = 404
        next(error)
        }
      })
      .catch(error => next(error))
    })


    app.put('/api/persons/:id', (request, response, next) => {
      Person.findByIdAndUpdate(request.params.id, { number: request.params.number})
      .then(person => 
        {
      if (person) {
          response.json(person)
          } else {
          const error = new Error('Person not found')
          error.status = 404
          next(error)
          }
        })
        .catch(error => next(error))
      })



      const generateId = (max) => {
            return Math.floor(Math.random() * max);
          }
      
      app.post('/api/persons', (request, response, next) => {
        const body = request.body
      
        if (!body.name || !body.number) {
          const error = new Error('Content missing')
          error.name = 'CastError'
          next(error)
        }
        if (persons.find(entry => entry.name === body.name))
        {
            return response.status(400).json({ 
                error: 'name must be unique'
              })

        }

        const person = new Person({
          name: body.name,
          number: body.number,
          id: generateId(10000),
        })
      
        person.save().then(person => {
          response.json(person)
        })
      })

      app.use(errorHandler)

      const PORT = process.env.PORT
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })