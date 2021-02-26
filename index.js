const express = require('express')
const app = express()

const morgan = require('morgan')
const morganImp = morgan()

const PORT = process.env.PORT || 3001

const personList = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '30000000'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '30000000'
  },
  {
    id: 3,
    name: 'Dan Abrahamov',
    number: '30000000'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '30000000'
  },
  {
    id: 5,
    name: 'William Dimitrov',
    number: '30000001'
  }
]

morgan.token('request-body', (request)=>{
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :request-body - :response-time ms'))


app.get('/api/persons', (request, response) =>{
  response.json(personList)
})

app.get('/api/info', (request, response) =>{
  let date = new Date()
  response.send(`Phonebook has info for ${personList.length} people, <br/> la fecha actual ${date}`)
})

app.get('/api/persons/:id', (request, response) =>{
  const id = request.params.id
  const person = personList.find(person => person.id === Number(id))
  person ? response.json(person) : response.status(404).end()

})

app.delete('/api/persons/:id', (request, response) =>{
  const id = request.params.id
  this.personList = personList.filter(person => person.id != Number(id))
  response.json(this.personList)

})

app.post('/api/persons', (request, response) =>{
  const person = request.body
  const personExist = personList.find(personValidate => personValidate.name === person.name)
  const errorMsg = {}
  if(!person.name){
    errorMsg.error = 'name is null'
    response.status(404).json(errorMsg)
  }else if (!person.number){
    errorMsg.error = 'number is null'
    response.status(404).json(errorMsg)
  }else if(personExist){
    errorMsg.error = 'name must be unique'
    response.status(404).json(errorMsg)
  }else{
    let id = Math.round(Math.random(1, 100) * 100)
    person.id = id

    personList.push(person)
    response.json(personList)
  }
})



app.listen(PORT, ()=>{
  console.log('la app está corriendo', PORT)
})

(async () => {

  const response = await fetch('https://monicode-apppersons.herokuapp.com/api/persons')
  const users = await response.json()
  console.log(users)


})()
