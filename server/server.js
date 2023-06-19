// Importing packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const aes = require('crypto-js/aes')

// Importing Connection details
require('dotenv').config()

// Connecting Middleware
const app = express()
const port = process.env.PORT || 5000


app.use(express.json())
app.use(cors())

// Connecting MongoDB Datbase
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
    console.log("no DB");
  });

const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("MongoDB Connection established")
})

// Connecting Routes
const userRouter = require('./routes/users')
app.use('/users', userRouter)

var server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})

const connectedSockets = new Map();

io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    // Зберігаємо ссилку на сокет кожного користувача у мапі
    connectedSockets.set(id, socket);

    socket.on('send-message', ({ recipients, text, enckey }) => {
        recipients.forEach(recipient => {
          const newRecipients = recipients.filter(r => r !== recipient);
          newRecipients.push(id);
          
          
          // Відправляємо повідомлення окремо кожному сокету за допомогою збереженої ссилки
          const recipientSocket = connectedSockets.get(recipient);
          recipientSocket.emit('receive-message', {
              recipients: newRecipients,
              sender: id,
              text,
              enckey
          });
      });
    })
})