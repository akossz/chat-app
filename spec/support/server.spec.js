// Create test specifications here. THis is a simple example. 
// a Calculator

var request = require('request')

describe ('calc', function () {
    it ('should multiply 2 and 2', function () {
        expect(2*2).toBe(4)
    })
})


describe('get messages', () => {
    it ('should return 200 OK', (done) => {
        // Here we need an HTTP request, which natively not possible
        // Need a library - request. Installs via the package manager. 
        request.get('http://localhost:3000/messages', (err, res) => {
            // Console log doesn't show, because the test ends before it gets to the callback. 
            // Its because it is not set as asynchronous. Pass "done" inside the spec definition
            // And call "done()" whenever a synchronous code finishes
            // console.log(res.body) 
            expect(res.statusCode).toEqual(200)
            done()
        })
    
    })

    it ('should return a list that\'s not empty',  (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            
            expect(JSON.parse(res.body).length).toBeGreaterThan(0)
            done()
        })
    
    })
})


describe('get messages from user', () => {
    it ('should return 200 OK', (done) => {
         
        request.get('http://localhost:3000/messages/tim', (err, res) => {
             
            expect(res.statusCode).toEqual(200)
            done()
        })
    
    })

    it ('name should be tim', (done) => {
        request.get('http://localhost:3000/messages/tim', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('tim')
            done()
        } )
    })

})