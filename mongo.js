const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://daniel:${password}@cluster0.rgrsn.mongodb.net/entries?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const entySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entySchema)


if (process.argv.length === 3) {
  Entry.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length >= 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const entry = new Entry({
    name,
    number
  })
  entry.save()
  .then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
