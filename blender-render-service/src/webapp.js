const port = 8080,
express = require("express"),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http, {
	pingTimeout: 60000,
});

//app.use(express.static('web'))
//app.use('/js', express.static('web/js'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => { });
app.get('/test', (req, res) => {
    let proxy = new BlenderProxy();
    proxy.callPython('./python/script1.py', 'Will')
    .then(data => {res.send(data); console.log('result', data)})
    .catch(err => {res.send(err); console.log('reject', err)});
})
app.get('/test/render', (req, res) => {
    rMan = new RenderManager(testParams);
    rMan.startRender();


})
app.get('/render', (req, res) => {

})


let sockets = require('./srv/sockets')
sockets.Expanses.listen(io)
let chnl = io.of('/');
chnl.on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => { console.log('user disconected') })
    
    // FOR TESTING
    socket.on('test', msg => {
        let proxy = new BlenderProxy();
        proxy.callPython('./python/script1.py', 'Will')
        .then(data => {socket.emit('test.response', data); console.log('result', data)})
        .catch(err => {socket.emit('test.error',err); console.log('reject', err)});
    })
    // socket.on('ping.me', msg => {
    //     console.log(`message ${msg}`)
    //     socket.emit('pong.me', msg)
    // })
    // socket.on('ping.us', msg => {
    //     console.log(`message ${msg}`)
    //     socket.broadcast.emit('pong.all', msg)
    // })
    
})


//A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});


http.listen(port, function(){
    console.log('listening on *:'+port);
});

module.exports = { app: app, http: http, io: io };
