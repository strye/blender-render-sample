const RenderManager = require('./src/renderManager');
const { app, http, io } = require('./src/webapp');


app.get('/render', (req, res) => { })
io.of('/').on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => { console.log('user disconected') })
    socket.on('render', msg => { 
        console.log(msg.msg);
        RenderManager.cleanWorkingFolder();
        let bp = new RenderManager(RenderManager.testParams);
        bp.on('imageReady', img => {
            socket.emit('render.image', img);
        })

        let rs =  bp.renderScene();
        rs.then(images => {
            // images.forEach(img => {
            //     console.log(img.imageName, img.fileName);
            //     load to S3;
            //     load to dynamoDb;
            // });

            // Legacy
            // socket.send('render.images', images);
        })
        .catch(err => {
            console.log(err)
            socket.emit('render.images.error', err);
        })
    })
})

