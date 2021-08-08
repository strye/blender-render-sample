import PuppeteerRunner from "./puppeteer-runner.mjs";


const designMap = {
	"back": { "part": "back", "part_idx": 0, "material": "blue", "mat_idx": 1 },
	"front": { "part": "front", "part_idx": 1, "material": "green", "mat_idx": 2 },
	"right": { "part": "right", "part_idx": 2, "material": "red", "mat_idx": 0 },
	"left": { "part": "left", "part_idx": 3, "material": "purple", "mat_idx": 3 },
	"top": { "part": "top", "part_idx": 4, "material": "yellow", "mat_idx": 4 },
	"bottom": { "part": "bottom", "part_idx": 5, "material": "white", "mat_idx": 6 }
},
cube = './dist/theCube/index.html',
rect = './dist/theRect/index.html';


const renderer = new PuppeteerRunner(cube)

await renderer.load();
//await renderer.updateMaterial("top", "red")
//await renderer.updateMaterial("front", "green")
await renderer.updateDesign(designMap);


// await renderer.getRender('./example.png');
await renderer.getRender('./example1.png', 'camera1');
await renderer.getRender('./example2.png', 'camera2');
await renderer.getRender('./example3.png', 'camera3');
await renderer.getRender('./example4.png', 'camera4');
await renderer.getRender('./example5.png', 'camera5');

renderer.close();





// // WEB APP
// const RenderManager = require('./src/renderManager');

// const port = 8081,
// express = require("express"),
// app = express();

// //app.use(express.static('web'))
// //app.use('/js', express.static('web/js'))
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))


// app.get('/', (req, res) => { 
//     res.send('<h1>Welcome</h1>');
// });
// app.get('/test', (req, res) => {
//     let proxy = new BlenderProxy();
//     proxy.callPython('./python/script1.py', 'Will')
//     .then(data => {res.send(data); console.log('result', data)})
//     .catch(err => {res.send(err); console.log('reject', err)});
// })
// app.get('/render', (req, res) => {
//     rMan = new RenderManager(testParams);
//     rMan.startRender();


// })


// //A Route for Creating a 500 Error (Useful to keep around)
// app.get('/500', function(req, res){
//     throw new Error('This is a 500 Error');
// });


// http.listen(port, function(){
//     console.log('listening on *:'+port);
// });

// module.exports = { app: app, http: http, io: io };



