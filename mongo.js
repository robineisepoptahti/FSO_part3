const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url =
  `mongodb+srv://rwidjesk:${password}@cluster0.9ne8c.mongodb.net/People?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Note', noteSchema)

const note = new Person({
  name: `${name}`,
  phone: `${number}`,
})

if (name === undefined) {
    console.log(`phonebook:`)
    Person.find({}).then(result => {
    result.forEach(person => {
    console.log(`${person.name} ${person.phone}`)
    })
        mongoose.connection.close()
    })

}
else {
note.save().then(result => {
  console.log(`Added ${result.name} number ${result.phone} to phonebook`)
  mongoose.connection.close()
})
}
