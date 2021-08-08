import _ from 'lodash';
import * as BABYLON from "@babylonjs/core";

class BabylonRunner {
	static get materials() {
		return {
			"red": 0,
			"blue": 1,
			"green": 2,
			"purple": 3,
			"yellow": 4,
			"black": 5,
			"white": 6
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
		res.camera2 = new BABYLON.ArcRotateCamera("camera2", Math.PI, Math.PI / 2, camRad, new BABYLON.Vector3(0, 1, 0), scene);
		// Top Camera
		res.camera3 = new BABYLON.ArcRotateCamera("camera3",  Math.PI, 0, camRad, new BABYLON.Vector3(0, 1, 1), scene);
		// Back Camera
		res.camera4 = new BABYLON.ArcRotateCamera("camera4", -(Math.PI / 2), Math.PI / 2, camRad, new BABYLON.Vector3(0, 0, 0), scene);
		// Iso Camera
		res.camera5 = new BABYLON.ArcRotateCamera("camera5", (Math.PI / 1.5), (Math.PI / 5), camRad, new BABYLON.Vector3(0, 0, 0), scene);

		return res //{main: camera, viewPorts: cameras};
	}

	static createBox(id, maltimat, scene) {
		let options = { width: 0.5, height: 0.5, depth: 0.5, updatable: true },
		box = BABYLON.MeshBuilder.CreateBox(id, options, scene, true),
		verticesCount = box.getTotalVertices();

		box.subMeshes = [];
		box.material = maltimat;
		// Define the subMeshes
		new BABYLON.SubMesh(BabylonRunner.materials.yellow, 0, verticesCount, 0, 6, box);
		new BABYLON.SubMesh(BabylonRunner.materials.yellow, 0, verticesCount, 6, 6, box);
		new BABYLON.SubMesh(BabylonRunner.materials.yellow, 0, verticesCount, 12, 6, box);
		new BABYLON.SubMesh(BabylonRunner.materials.yellow, 0, verticesCount, 18, 6, box);
		new BABYLON.SubMesh(BabylonRunner.materials.yellow, 0, verticesCount, 24, 6, box);
		new BABYLON.SubMesh(BabylonRunner.materials.yellow, 0, verticesCount, 30, 6, box);

		return box;
	}

	constructor(canvas, options = {}) {
		this._canvas = canvas; // Get the canvas element
		this._engine = new BABYLON.Engine(this._canvas, true, {preserveDrawingBuffer: true}); // Generate the BABYLON 3D engine
		this._camZoom = options.camZoom || 2.5;
		this._lightIntesity = options.lightIntesity || 1;
	
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
		this._materials = new BABYLON.MultiMaterial('multi-mat', this._scene);
		this._materials.subMaterials.push(BabylonRunner.createMaterial("red", 1, 0, 0, this._scene)) 
		this._materials.subMaterials.push(BabylonRunner.createMaterial("blue", 0, 0, 1, this._scene)) 
		this._materials.subMaterials.push(BabylonRunner.createMaterial("green", 0, 1, 0, this._scene)) 
		this._materials.subMaterials.push(BabylonRunner.createMaterial("purple", 0.8, 0, 0.8, this._scene)) 
		this._materials.subMaterials.push(BabylonRunner.createMaterial("yellow", 0.8, 0.8, 0, this._scene)) 
		this._materials.subMaterials.push(BabylonRunner.createMaterial("black", 0, 0, 0, this._scene))
		this._materials.subMaterials.push(BabylonRunner.createMaterial("white", 1, 1, 1, this._scene))
		
		this._box = BabylonRunner.createBox('box', this._materials, this._scene);

		this._camera.lockedTarget = this._box;
	}
	setupRenderLoop() {
		this._engine.runRenderLoop(() => {
			this._scene.render();
		});
	}
	changeMaterial(face, matName) {
		console.log(face, matName)
		this._box.subMeshes[BabylonRunner.faces[face]].materialIndex = BabylonRunner.materials[matName];
	}

	async renderCamera(cameraName) {
        let imageRes = {width:3840, height:2160 };
		// this._cameras[cameraName]
		return await BABYLON.Tools.CreateScreenshotUsingRenderTargetAsync(this._engine, this._cameras[cameraName], imageRes);
	}

}


export default BabylonRunner;