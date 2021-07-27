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

// ******************************************************************************************
// app.post('/messages', function(req,res) {
//     var message = new Message(req.body)

//     message.save(function(err){
//         if(err)
//             sendStatus(500)

//             //  This checks for badwords
//             Message.findOne({message: 'fuck'}, function(err, censored) {
//                 if (censored) {
//                     console.log('censored word found - fuck', censored)

//                     //  The database gives an ID to the word it finds, that's where it comes from. 
//                     Message.deleteOne({_id: censored.id}, function(err) {
//                         console.log('Word Removed')
//                     }) 
//                 }
//             })

//             // messages.push(req.body) // Push the new message to the 'messages' array
//             //  console.log(messages) //debug
        
//             // // Notify the clients when a new message comes in: 
//             io.emit('message', req.body) //  Event emitter setup: Event called message, 
//                                          //  requested from the body, that 
//                                          //  will contain the message
//             res.sendStatus(200)
//     })
// })
// *****************************************************************************************

// The above code can be rewritten by using PROMISES. Promises reeturn an object that promise 
// to do some work. The object has separate callbacks for success and failures. This allows
// us to work with asynchronous code in a more synchronous way. Promises can be combined into
// dependancy chains. 

app.post('/messages', function(req,res) {
    var message = new Message(req.body)

    message.save()
    .then( function() {
        console.log('saved')
        return Message.findOne({message: 'fuck'})
    })
    .then(censored => {
        if (censored) {
            console.log('Censored word found', censored)
            console.log ('Deleted')
            return Message.deleteOne({_id: censored.id})
        }
        io.emit('message', req.body)
        res.sendStatus(200)
    })
    .catch( err => {
        res.sendStatus(500)
        return console.error(err)
    })
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