const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
morgan.token('content', function (req, res) { return JSON.stringify(req.body)})
let command = ':method :url :status :res[content-length] - :response-time ms :content'
app.use(morgan(command))

const cors = require('cors')

app.use(cors())

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
    })

    app.get('/api/info', (request, response) => {
        const count = persons.length;
        const Time = new Date();
        let msg = `Phonebook has info for ${count} people<br><br>${Time}`;
        response.send(msg);
        })

    app.delete('/api/persons/:id', (request, response) => {
        const id = request.params.id
        persons = persons.filter(note => note.id !== id)  
        response.status(204).end()
          })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = persons.find(note => note.id === id)
    if (note) {
        response.json(note)
        } else {
        response.status(404).end()
      }
      })

      const generateId = (max) => {
            return Math.floor(Math.random() * max);
          }
      
      app.post('/api/persons', (request, response) => {
        const body = request.body
      
        if (!body.name || !body.number) {
          return response.status(400).json({ 
            error: 'content missing' 
          })
        }
        if (persons.find(entry => entry.name === body.name))
        {
            return response.status(400).json({ 
                error: 'name must be unique'
              })

        }
      
        const person = {
          name: body.name,
          number: body.number,
          id: generateId(10000),
        }
      
        persons = persons.concat(person)
      
        response.json(person)
      })


      const PORT = process.env.PORT || 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })