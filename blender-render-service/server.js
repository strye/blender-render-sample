const RenderManager = require('./src/renderManager');
const { app, http, io } = require('./src/webapp');


app.get('/render', (req, res) => { })
io.of('/').on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => { console.log('user disconected') })
    socket.on('render', msg => { 
        console.log(msg.msg);
        let rs = renderScene(msg);
        rs.then(images => {
            socket.send('render.images', images);
            images.forEach(img => {
                console.log(img.imageName, img.fileName);
                socket.emit('render.images', img);
            });
        })
        .catch(err => {
            console.log(err)
            socket.emit('render.images.error', err);
        })
    })
})



renderScene = (designJSON) => {
    RenderManager.cleanWorkingFolder();
    let bp = new RenderManager(RenderManager.testParams);
    return bp.renderScene();
}



