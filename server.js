var express = require('express')
var bodyParser = require('body-parser')

// To set up socket.io, we need to set up a node http server that will be shared 
// with express and socket.io. 
// The line below sets up a Node http server, calls .Server on the require 
// and pass in our Express app
var http = require('http').Server(app)

// Create a IO; require socket.io and pass in the reference to HTTP
var io = require('socket.io')(http)

var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var messages = [
    {name: 'Jane', message: 'Hi John'},
    {name: 'John', message: 'Hi Jane'}
]

app.get('/messages', function(req,res) {
    res.send(messages)
})

app.post('/messages', function(req,res) {
    messages.push(req.body) // Push the new message to the 'messages' array
    console.log(messages) //debug
    res.sendStatus(200)
})

var server = http.listen(3000, function() {
    console.log('Server is running on: ', server.address().port)
})



