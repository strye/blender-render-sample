const pyProx = require('./python/pythonProxy');

// Lets test first
let proxy = new pyProx();
proxy.callScript('./python/script1.py', 'Will')
.then(res => {console.log('result', res)})
.catch(rej => {console.log('reject', rej)});


// Get scene from S3
// Save parameters file
// Run blender from command line

// Save Renders


// Start blender with python file

// blender --background theCubeBase.blend --python "python/blenderTest.py"
// blender --background theCubeBase.blend --python "python/script1.py 'Will'"

