const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');


class BabylonRenderManager extends EventEmitter {
    static cleanWorkingFolder() { 
		// Included for interface compatability, but not 
		//   needed for babylon since all processing is
		//   done in memmory.
	}

    constructor(designParams) {
        super();

        this._designJSON = designParams;
        this._imagePaths = [];
	}
    get design() { return this._designJSON; }
    set design(val) { this._designJSON = val; }
    get imagePaths() { return this._imagePaths; }
    get error() { return this._err; }

    renderScene(design = null) {
        if (design) this._designJSON = design;

        // Write/save parameters file
//        fs.writeFileSync('./working/params.json', JSON.stringify(this._designJSON));

        // Get scene
        let assetFolder = `${this._designJSON.sceneName}_${this._designJSON.sceneVersion}`;
        let srcScene = `./assets/${assetFolder}/sceneBase.blend`,
        dstScene = `./working/scene.blend`,
        srcMeta = `./assets/${assetFolder}/modelMeta.json`,
        dstMeta = `./working/modelMeta.json`;

        fs.copyFileSync(srcScene, dstScene);
        fs.copyFileSync(srcMeta, dstMeta);


        // Run render command
        let self = this;
        self._imagePaths = [];
        return this._callBlender()
        .then(results => {
            return self._imagePaths;
        })

    }

    saveImagesToCache() { } 


    static testParams = {
        "sceneName": "theCube",
        "sceneVersion": "1.0",
        "screenshotSize": {
          "width": 864,
          "height": 864
        },
        "designMap": {
			"back": { "part": "back", "part_idx": 0, "material": "white", "mat_idx": 6 },
			"front": { "part": "front", "part_idx": 1, "material": "white", "mat_idx": 6 },
			"right": { "part": "right", "part_idx": 2, "material": "white", "mat_idx": 6 },
			"left": { "part": "left", "part_idx": 3, "material": "white", "mat_idx": 6 },
			"top": { "part": "top", "part_idx": 4, "material": "white", "mat_idx": 6 },
			"bottom": { "part": "bottom", "part_idx": 5, "material": "white", "mat_idx": 6 }
		},
		"parts": {
			"back": 0,
			"front": 1,
			"right": 2,
			"left": 3,
			"top": 4,
			"bottom": 5
		},
		"materials": {
			"red": 		{ "idx":0, "r":1.0, "g":0.0, "b":0.0, "a":1.0 },
			"blue": 	{ "idx":1, "r":0.0, "g":0.0, "b":1.0, "a":1.0 },
			"green": 	{ "idx":2, "r":0.0, "g":1.0, "b":0.0, "a":1.0 },
			"purple": 	{ "idx":3, "r":0.8, "g":0.0, "b":0.8, "a":1.0 },
			"yellow": 	{ "idx":4, "r":0.8, "g":0.8, "b":0.0, "a":1.0 },
			"black": 	{ "idx":5, "r":0.0, "g":0.0, "b":0.0, "a":1.0 },
			"white": 	{ "idx":6, "r":1.0, "g":1.0, "b":1.0, "a":1.0 }
		},
    }
}

module.exports = BabylonRenderManager;

