import _ from 'lodash';
import * as BABYLON from "@babylonjs/core";

class BabylonRunner {
	static get materials() {
		return {
			"red": 		{ "idx":0, "r":1.0, "g":0.0, "b":0.0, "a":1.0 },
			"blue": 	{ "idx":1, "r":0.0, "g":0.0, "b":1.0, "a":1.0 },
			"green": 	{ "idx":2, "r":0.0, "g":1.0, "b":0.0, "a":1.0 },
			"purple": 	{ "idx":3, "r":0.8, "g":0.0, "b":0.8, "a":1.0 },
			"yellow": 	{ "idx":4, "r":0.8, "g":0.8, "b":0.0, "a":1.0 },
			"black": 	{ "idx":5, "r":0.0, "g":0.0, "b":0.0, "a":1.0 },
			"white": 	{ "idx":6, "r":1.0, "g":1.0, "b":1.0, "a":1.0 }
		}
	}
	static get defaultMap() {
		return {
			"back": { "part": "back", "part_idx": 0, "material": "white", "mat_idx": 6 },
			"front": { "part": "front", "part_idx": 1, "material": "white", "mat_idx": 6 },
			"right": { "part": "right", "part_idx": 2, "material": "white", "mat_idx": 6 },
			"left": { "part": "left", "part_idx": 3, "material": "white", "mat_idx": 6 },
			"top": { "part": "top", "part_idx": 4, "material": "white", "mat_idx": 6 },
			"bottom": { "part": "bottom", "part_idx": 5, "material": "white", "mat_idx": 6 }
		}
	}
	static get faces() {
		return {
			"back": 0,
			"front": 1,
			"right": 2,
			"left": 3,
			"top": 4,
			"bottom": 5
		}
	}
	static createMaterials(materialSpec, scene) {
		let materials = new BABYLON.MultiMaterial('multi-mat', scene);

		for (const key in materialSpec) {
			if (Object.hasOwnProperty.call(materialSpec, key)) {
				const matSpec = materialSpec[key];

				let material = new BABYLON.StandardMaterial(key, scene);
    			material.diffuseColor = new BABYLON.Color3(matSpec.r, matSpec.g, matSpec.b);
	    		material.specularColor = new BABYLON.Color3.Black();

				materials.subMaterials.push(material) 
			}
		}

		return materials;
	}

	static createMaterial(id, r, g, b, scene) {
		let material = new BABYLON.StandardMaterial(id, scene);
    	material.diffuseColor = new BABYLON.Color3(r, g, b);
    	material.specularColor = new BABYLON.Color3.Black();

		return material
	}
	static createCameras(scene, camRad = 5) {
        let res = {}

		// User Camera
		res.main = new BABYLON.ArcRotateCamera("camera", (Math.PI / 1.5), (Math.PI / 5), camRad, new BABYLON.Vector3(0, 0, 0), scene);

		// Front Camera
		res.camera1 = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, camRad, new BABYLON.Vector3(0, 0, 0), scene);
		// Left Side Camera
		res.camera2 = new BABYLON.ArcRotateCamera("camera2", Math.PI, Math.PI / 2, camRad, new BABYLON.Vector3(0, 0, 0), scene);
		// Top Camera
		res.camera3 = new BABYLON.ArcRotateCamera("camera3",  Math.PI, 0, camRad, new BABYLON.Vector3(0, 0, 0), scene);
		// Back Camera
		res.camera4 = new BABYLON.ArcRotateCamera("camera4", -(Math.PI / 2), Math.PI / 2, camRad, new BABYLON.Vector3(0, 0, 0), scene);
		// Iso Camera
		res.camera5 = new BABYLON.ArcRotateCamera("camera5", (Math.PI / 1.5), (Math.PI / 5), camRad, new BABYLON.Vector3(0, 0, 0), scene);

		return res //{main: camera, viewPorts: cameras};
	}

	static createBox(id, maltimat, designMap, scene) {
		let options = { width: 0.75, height: 0.75, depth: 0.75, updatable: true },
		box = BABYLON.MeshBuilder.CreateBox(id, options, scene, true),
		verticesCount = box.getTotalVertices();

		box.rotation.y = 0.25;

		box.subMeshes = [];
		box.material = maltimat;

		// Define the subMeshes
		new BABYLON.SubMesh(designMap.back.mat_idx, 0, verticesCount, 0, 6, box);
		new BABYLON.SubMesh(designMap.front.mat_idx, 0, verticesCount, 6, 6, box);
		new BABYLON.SubMesh(designMap.right.mat_idx, 0, verticesCount, 12, 6, box);
		new BABYLON.SubMesh(designMap.left.mat_idx, 0, verticesCount, 18, 6, box);
		new BABYLON.SubMesh(designMap.top.mat_idx, 0, verticesCount, 24, 6, box);
		new BABYLON.SubMesh(designMap.bottom.mat_idx, 0, verticesCount, 30, 6, box);

		return box;
	}

	constructor(canvas, options = {}) {
		this._canvas = canvas; // Get the canvas element
		this._engine = new BABYLON.Engine(this._canvas, true, {preserveDrawingBuffer: true}); // Generate the BABYLON 3D engine
		this._camZoom = options.camZoom || 3;
		this._lightIntesity = options.lightIntesity || 1;
		this._designMap = options.designMap || BabylonRunner.defaultMap;
	
		this._scene = new BABYLON.Scene(this._engine);

        /**** Set camera and light *****/
		this._cameras = BabylonRunner.createCameras(this._scene, this._camZoom);

        //this._camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, this._camZoom, new BABYLON.Vector3(0, 0, 0), this._scene);
        this._camera = this._cameras.main;
		this._camera.attachControl(this._canvas, true);

        this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), this._scene);
        this._light.intensity = this._lightIntesity;

        /**** Load scene *****/

		// Define the multimaterial
		this._materials = BabylonRunner.createMaterials(BabylonRunner.materials, this._scene);
		
		this._box = BabylonRunner.createBox('box', this._materials, this._designMap, this._scene);

		this._camera.lockedTarget = this._box;
	}
	setupRenderLoop() {
		this._engine.runRenderLoop(() => {
			this._scene.render();
		});
	}
	changeMaterial(face, matName) {
		this._box.subMeshes[BabylonRunner.faces[face]].materialIndex = BabylonRunner.materials[matName];
	}
	applyDesign(designMap) {
		if (designMap) this._designMap = designMap;

		this._box.subMeshes[this._designMap.back.part_idx].materialIndex = this._designMap.back.mat_idx;
		this._box.subMeshes[this._designMap.front.part_idx].materialIndex = this._designMap.front.mat_idx;
		this._box.subMeshes[this._designMap.right.part_idx].materialIndex = this._designMap.right.mat_idx;
		this._box.subMeshes[this._designMap.left.part_idx].materialIndex = this._designMap.left.mat_idx;
		this._box.subMeshes[this._designMap.top.part_idx].materialIndex = this._designMap.top.mat_idx;
		this._box.subMeshes[this._designMap.bottom.part_idx].materialIndex = this._designMap.bottom.mat_idx;
	}

	async renderCamera(cameraName) {
        let imageRes = {width:3840, height:2160 };
		// this._cameras[cameraName]
		return await BABYLON.Tools.CreateScreenshotUsingRenderTargetAsync(this._engine, this._cameras[cameraName], imageRes);
	}

}


export default BabylonRunner;