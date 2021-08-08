import _ from 'lodash';

import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import * as BABYLON from "@babylonjs/core";

const tester = {
	setupCameras(scene, camRad = 5) {
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
	},
	setupLighting(scene, intensity = 1) {
		const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
		light.intensity = intensity;
		return light;
	},
    renderCamera(engine, camera) {
        let imageRes = {width:800, height:400},
        self = this;

        BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, imageRes, data => {
            self.updateImage(camera.name, data);
        });
    },
    updateImage(frameName, data) {
		console.log(data);
        // let img = document.getElementById(frameName);
        // if (!img) {
        //     img = document.createElement('img');
        //     img.setAttribute('id', frameName);
        // }

        // img.setAttribute('src', data)
        // document.getElementById('imageContainer').append(img);
    }
}

document.addEventListener('DOMContentLoaded', event => {
//    const canvas = document.getElementById("renderCanvas"); // Get the canvas element
//    const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true}); // Generate the BABYLON 3D engine
	const engine = new BABYLON.NullEngine();

	let camRad = 8; // 15 for village
    let lightIntesity = 1;

    // Add your code here matching the playground format
    const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        /**** Set camera and light *****/
		const cameras = tester.setupCameras(scene, camRad);
		// camera = cameras.main;
		// camera.attachControl(canvas, true);

		const light = tester.setupLighting(scene, lightIntesity)

      
		// let shoe = null;
		// The first parameter can be set to null to load all meshes and skeletons
		BABYLON.SceneLoader.ImportMeshAsync("", "../assets/", "JordanHT_Right.obj", scene).then((result) => {
			// shoe = result.meshes[0];
			// camera.target =shoe;

            document.getElementById('imageContainer').innerHTML="";
            tester.renderCamera(engine, cameras.camera1);
            tester.renderCamera(engine, cameras.camera2);
            tester.renderCamera(engine, cameras.camera3);
            tester.renderCamera(engine, cameras.camera4);
            tester.renderCamera(engine, cameras.camera5);
		});


        return scene;
    }
    const scene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    // engine.runRenderLoop(function () {
    //     scene.render();
    // });

    // // Watch for browser/canvas resize events
    // window.addEventListener("resize", function () {
    //     engine.resize();
    // });
})
