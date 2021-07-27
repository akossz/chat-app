var express = require('express')

var app = express()

arrr = ['apple', 'lemon', 'banana']

arrr.forEach(console.log)



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