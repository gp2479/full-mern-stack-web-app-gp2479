require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use('/static', express.static('public')) // serve files such as images from public folder

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// a route to send the content for the About Us page
app.get('/about', (req, res) => {
  res.json({
    name: 'Georgi Popov',
    paragraphs: [
      'Hi my name is Georgi and I am a BTE major that is also very interested in computer science which is why I am pursuing a double major in computer science. I have been interested in computers for as long as I can remember, and combined with my passion for business I think that being able to learn how to program and how to code are very useful skills that everyone needs to know in the twenty first century.',
      'In my free time I enjoy hanging out with my friends, playing soccer, and watching movies. I have been playing soccer since elementary school and my favorite team is Chelsea. My favorite soccer player is Cristiano Ronaldo. When I was younger, I used to want to be a soccer player.',
      'I look forward to taking this class and learning the agile workflow because I am very interested in startups and I know that it is the industry standard in the startup world. Learning to code is an important skill, however, organizing code and organizing teams are also essential skills that must not be overlooked because they play a significant role in helping startups succeed. ',
    ],
    imageUrl: 'http://localhost:5002/static/gp2479.jpg',
    status: 'all good',
  })
})


// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
