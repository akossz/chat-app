var express = require('express')
var bodyParser = require('body-parser')
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

var server = app.listen(3000, function() {
    console.log('Server is running on: ', server.address().port)
})
