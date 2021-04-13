const fs = require('fs');
const path = require('path');

const {spawn} = require('child_process');
//const BlenderProxy = require('./src/blenderProxy');


class RenderManager {
    static cleanWorkingFolder() { 
        const directory = './working';
        let files = fs.readdirSync(directory);
       
        for (const file of files) {
            fs.unlinkSync(path.join(directory, file));
        }
    }

    constructor(designParams) {

        this._designJSON = designParams;
        this._imagePaths = [];
	}
    get design() { return this._designJSON; }
    set design(val) { this._designJSON = val; }
    get imagePaths() { return this._imagePaths; }
    get error() { return this._err; }

    test() {
        // let proxy = new BlenderProxy();
        return this._callPython('./python/script1.py', 'Will');
        // .then(data => {res.send(data); console.log('result', data)})
        // .catch(err => {res.send(err); console.log('reject', err)});    
    }


    renderScene(design = null) {
        if (design) this._designJSON = design;

        // Write/save parameters file
        fs.writeFileSync('./working/params.json', JSON.stringify(this._designJSON));

        // Get scene
        let assetFolder = `${this._designJSON.sceneName}_${this._designJSON.sceneVersion}`;
        let srcScene = `./assets/${assetFolder}/sceneBase.blend`,
        dstScene = `./working/scene.blend`,
        srcMeta = `./assets/${assetFolder}/modelMeta.json`,
        dstMeta = `./working/modelMeta.json`;

        fs.copyFileSync(srcScene, dstScene);
        fs.copyFileSync(srcMeta, dstMeta);


        // Run blender from command line
        let self = this;
        return this._callBlender()
        .then(images => {
            self._imagePaths = [];
            images.forEach(img => {
                // read binary data
                // convert binary data to base64 encoded string
                let item ={
                    fileName: img,
                    imageData: self._encodeFile(file)
                }
                self._imagePaths.push(item);
            });
            return self._imagePaths;
        })

    }

    // _downloadScene() {
    //     let assetFolder = `${this._designJSON.sceneName}_${this._designJSON.sceneVersion}`;
    //     let srcScene = `../assets/${assetFolder}/sceneBase.blend`,
    //     dstScene = `../working/scene.blend`,
    //     srcMeta = `../assets/${assetFolder}/modelMeta.json`,
    //     dstMeta = `../working/scene.blend`;

    //     fs.copyFileSync(srcScene, dstScene);
    //     fs.copyFileSync(srcMeta, dstMeta);
    // }
    saveImagesToCache() { } 

    async _callBlender() {
        //--background theCubeBase.blend --python 'python/blenderTest.py'
		return new Promise((res,rej) => {
			let imagePaths = [],
            pyScript = `--python "script"`;
			const blender = spawn('blender', ["--background", "working/scene.blend", "--python", "python/blenderRender.py"]);
			blender.stdout.on('data', data => {
				//dataToSend += data.toString();
                // ex of "data" "Saved: 'iso2.png'"
                let resString = data.toString();
                if (resString.startsWith("Saved:")) {
                    let img = resString.split("'")[1].trim();
                    imagePaths.push(img)
                }
				//console.log('Pipe data from blender script...');
				console.log(resString);
			})
			blender.on('close', (code) => {
				console.log(`child process close all stio with code ${code}`);
                res(imagePaths);
			})
		});
	}
	async _callPython(script, args = []) {
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
    _encodeFile(fileName) {
        let bitmap = fs.readFileSync('./working/'+fileName);
        return Buffer(bitmap).toString('base64');
    }

    static testParams = {
        "sceneName": "theCube",
        "sceneVersion": "1.0",
        "screenshotSize": {
          "width": 864,
          "height": 864
        },
        "designs": [
          {
            "hasPid": false,
            "isLogo": false,
            "isVisible": true,
            "hex": "38383a",
            "assetNumber": null,
            "material": "blue",
            "part": "front"
          },
          {
            "hasPid": false,
            "isLogo": false,
            "isVisible": true,
            "hex": "38383a",
            "assetNumber": null,
            "material": "green",
            "part": "top"
          },
          {
            "hasPid": false,
            "isLogo": false,
            "isVisible": true,
            "hex": "38383a",
            "assetNumber": null,
            "material": "red",
            "part": "right"
          },
          {
            "hasPid": false,
            "isLogo": false,
            "isVisible": true,
            "hex": "38383a",
            "assetNumber": null,
            "material": "orange",
            "part": "left"
          },
          {
            "hasPid": false,
            "isLogo": false,
            "isVisible": true,
            "hex": "38383a",
            "assetNumber": null,
            "material": "yellow",
            "part": "back"
          },
          {
            "hasPid": false,
            "isLogo": false,
            "isVisible": true,
            "hex": "38383a",
            "assetNumber": null,
            "material": "white",
            "part": "bottom"
          }
        ],
        "materialMap": {
            "front": 0,
            "top": 1,
            "right": 2,
            "left": 3,
            "back": 4,
            "bottom": 5
        }
    }
    

}

module.exports = RenderManager;

