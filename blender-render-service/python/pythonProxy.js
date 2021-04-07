const DM = require('../src/dm-node');
const {spawn} = require('child_process');

class PythonProxy extends DM.EventEmitter {
	constructor() {
		super()
	}

	
	async callScript(script, arg) {
		return new Promise((res,rej) => {
			let dataToSend = null;
			const python = spawn('python3', [script, arg]);
			python.stdout.on('data', data => {
				console.log('Pipe data from python script...');
				dataToSend = data.toString();
			})
			python.on('close', (code) => {
				console.log(`child process close all stio with code ${code} and data ${dataToSend}`);
				res(dataToSend);
			})
		});
	}

	async callBlender(script, arg) {
        //--background theCubeBase.blend --python 'python/blenderTest.py'
		return new Promise((res,rej) => {
			let dataToSend = null;
			const blender = spawn('blender', ["--background", " --python 'python/blenderTest.py'"]);
			python.stdout.on('data', data => {
				console.log('Pipe data from blender script...');
				dataToSend += data.toString();
			})
			python.on('close', (code) => {
				console.log(`child process close all stio with code ${code} and data ${dataToSend.length}`);
				//res(dataToSend);
			})
		});
	}
}

module.exports = PythonProxy;
