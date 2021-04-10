const RenderManager = require('./src/renderManager');
const { app, http, io } = require('./src/webapp');


app.get('/render', (req, res) => { })
io.of('/').on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => { console.log('user disconected') })
    socket.on('render', msg => { 
        console.log(msg.msg);
    })
})



renderScene = (designJSON) => {
    RenderManager.cleanWorkingFolder();

    let bp = new RenderManager(RenderManager.testParams);
    let rs = bp.renderScene();
    rs.then(images => {
        images.forEach(img => {
            console.log(img);
        });
        // Send images to client
    
        // Save images to cache
    })
    .catch(err => {
        console.log(err)
    })    
}



