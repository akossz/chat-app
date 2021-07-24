var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// To set up socket.io, we need to set up a node http server that will be shared 
// with express and socket.io. 
// The line below sets up a Node http server, calls .Server on the require 
// and pass in our Express app
var http = require('http').Server(app)

// Create a IO; require socket.io and pass in the reference to HTTP
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var messages = []

app.get('/messages', function(req,res) {
    res.send(messages)
})

app.post('/messages', function(req,res) {
    messages.push(req.body) // Push the new message to the 'messages' array
    console.log(messages) //debug

    // Notify the clients when a new message comes in: 
    io.emit('message', req.body) // Event emitter setup: Event called message, 
                                 // requested from the body, that 
                                 // will contain the message

    res.sendStatus(200)
})

// This will let us know whenever a new user connects; 
// This is achie ved by setting up a callback for the socket connection event. 
io.on('connection', function(socket) {
    console.log('A new user has connected')
})

// app.listen has been changed to http.listen. It is because we can't serve
// the nackend just with Express any longer, the Node HTTP server needs to be used. 

var server = http.listen(3000, function() {
    console.log('Server is running on: ', server.address().port)
})



