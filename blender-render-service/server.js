const pyProx = require('./python/pythonProxy');

// Lets test first
let proxy = new pyProx();
proxy.callScript('./python/script1.py', null)
.then(res => {console.log('result', res)})
.catch(rej => {console.log('reject', rej)});





