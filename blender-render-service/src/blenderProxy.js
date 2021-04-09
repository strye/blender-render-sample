const DM = require('./dm-node');
const {spawn} = require('child_process');

class BlenderProxy extends DM.EventEmitter {
	constructor() {
		super()
	}

	
	async callPython(script, args = []) {
		return new Promise((res,rej) => {
			let dataToSend = null, pyArguments = [script];
            args.forEach(itm => {
                pyArguments.push(itm);
            });
			const python = spawn('python3', pyArguments);
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

	async callBlender(script) {
        //--background theCubeBase.blend --python 'python/blenderTest.py'
		return new Promise((res,rej) => {
			let imagePaths = [],
            pyScript = `--python "script"`;
			const blender = spawn('blender', ["--background", "working/scene.blend", "--python 'python/blenderTest.py'"]);
			blender.stdout.on('data', data => {
				console.log('Pipe data from blender script...');
				//dataToSend += data.toString();
                // ex of "data" "Saved: 'iso2.png'"
                let resString = data.toString();
                if (resString.startsWith("Saved:")) {
                    let img = resString.split(":")[1].trim();
                    imagePaths.push(img)
                }
			})
			blender.on('close', (code) => {
				console.log(`child process close all stio with code ${code}`);
                res(imagePaths);
			})
		});
	}
}

module.exports = BlenderProxy;
