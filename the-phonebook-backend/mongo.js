const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
console.log('arg nr', process.argv.length)

const password = process.argv[2]

const url = `mongodb+srv://loredana:${password}@cluster0.oa1cb03.mongodb.net/phoneBookApp?retryWrites=true&w=majority`
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      Person
        .find({})
        .then(result => {
          result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
          mongoose.connection.close()
        })}
    else {

      const argName = process.argv[3]
      const argNumber = process.argv[4]

      const person = new Person({
        name: argName,
        number: argNumber,
      })

      console.log(`added ${argName} ${argNumber} to phonebook`)
      return person.save().then(() => {
        console.log('person saved!')
        return mongoose.connection.close()
      })

    }
  })

  .catch((err) => console.log(err))