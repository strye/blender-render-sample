const RenderManager = require('./src/renderManager');
//const fs = require('fs');
//const BlenderProxy = require('./src/blenderProxy');

//const { app, http, io } = require('./src/webapp');


// app.get('/render', (req, res) => { })



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



