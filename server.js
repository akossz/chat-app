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

var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// This will be used to connect to the database. dbUrl variable refers to this link. 
var dbUrl = 'mongodb+srv://akos_szakacs:07akos01*@cluster0.ksuja.mongodb.net/Cluster0?retryWrites=true&w=majority'

// This creates a model or a schema for the database. Monfo is a noSQL, yet it still needs a model. 
// The message variable is capitalised, meaning that it is a model. 
// Below in the postMessage function we'll create an object based on this model. 
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', function(req,res) {
    // This will make sure that we use the database insted of the Array that we used before. 
    // The Message.find is passed an empty object, meaning "find all messages", and a callback with an error
    // argument, if there's an error. 
    Message.find({}, function (err, messages) {
        res.send(messages)
    })
    
})

// ASYNC/AWAIT - Makes a synchronous code look even more synchronous.
// Express function needs to be declared as "async". 
// Try/Catch added for error handling. It'll try whatever is in the 
// TRY block; if encounters am error it'll go to the catch block... 
// Test the catch block with a "throw" statement. 
// FINALLY - executes after the Try/Catch blocks. 

app.post('/messages', async function(req,res) {

    try {

        // throw 'some error'

        var message = new Message(req.body)

        var savedMessage =  await message.save()
    
        console.log('saved')

        var censored = await Message.findOne({message: 'fuck'})
    
        if (censored)
            await Message.deleteOne({_id: censored.id})

        else    
            io.emit('message', req.body)
        
        res.sendStatus(200)
        
    } catch (error) {

        res.sendStatus(500)
        return console.error(error)
        
    } finally {
        console.log ('This executes eventually, regardless whether the above succeeds or fails')
    }

})


// This will let us know whenever a new user connects; 
// This is achie ved by setting up a callback for the socket connection event. 

io.on('connection', function(socket) {
    console.log('A new user has connected')
})

// Connect to the database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
     console.log('Mongo Database Connected', err)
})

// app.listen has been changed to http.listen. It is because we can't serve
// the nackend just with Express any longer, the Node HTTP server needs to be used. 
var server = http.listen(3000, function() {
    console.log('Server is running on: ', server.address().port)
})


// mongodb+srv://akos_szakacs:07akos01*@cluster0.ksuja.mongodb.net/Cluster0?retryWrites=true&w=majority