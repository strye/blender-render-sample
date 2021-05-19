import _ from 'lodash';
import './styles/style.css'
//import * as earcut from "earcut";

//import Environment from "./classes/environment";
import GameGUI from "./gui.js";
import { io } from "socket.io-client";

// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from "babylonjs-gui";
// import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, SceneLoader } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";
//import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh } from "@babylonjs/core";
//import * as GUI from 'babylonjs-gui';

const socket = io('http://localhost:8081',{rejectUnauthorized: false});
socket.on('render.image', image => { 
    console.log(image.imageName);
    tester.updateImage(image.imageName, image.imageData);
})
socket.on('render.images.error', err => { console.log(err); })

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
        // const light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, 1, 0), scene);
		// light.position = new BABYLON.Vector3(0, 15, -30);
		//const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

		light.intensity = intensity;
		return light;
	},
    renderCamera(engine, camera) {
        let imageRes = {width:800, height:400},
        self = this;

        BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, imageRes, data => {
            self.updateImage(camera.name, data);
            // let img = document.createElement('img');
            // img.setAttribute('src', data)
            // document.getElementById('imageContainer').append(img);
        });
    },
    updateImage(frameName, data) {
        let img = document.getElementById(frameName);
        if (!img) {
            img = document.createElement('img');
            img.setAttribute('id', frameName);
        }

        img.setAttribute('src', data)
        document.getElementById('imageContainer').append(img);
    }
}

document.addEventListener('DOMContentLoaded', event => {


    const canvas = document.getElementById("renderCanvas"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true}); // Generate the BABYLON 3D engine
    let camRad = 8; // 15 for village
    let lightIntesity = 1;

    // Add your code here matching the playground format
    const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        /**** Set camera and light *****/
		const cameras = tester.setupCameras(scene, camRad),
		camera = cameras.main;
		camera.attachControl(canvas, true);

		const light = tester.setupLighting(scene, lightIntesity)

        //Environment.loadSkyBox(scene)

       
		let shoe = null;
		// The first parameter can be set to null to load all meshes and skeletons
		BABYLON.SceneLoader.ImportMeshAsync("", "../assets/", "JordanHT_Right.obj", scene).then((result) => {
			shoe = result.meshes[0];
			//shoe.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
			//shoe.position = new BABYLON.Vector3(-6, 0, 0);
			//shoe.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(90), BABYLON.Space.LOCAL);
			camera.target =shoe;

			const adt = GameGUI.addPanel(scene, () => {
                document.getElementById('imageContainer').innerHTML="";
				//alert("you did it!");
                tester.renderCamera(engine, cameras.camera1);
                tester.renderCamera(engine, cameras.camera2);
                tester.renderCamera(engine, cameras.camera3);
                tester.renderCamera(engine, cameras.camera4);
                tester.renderCamera(engine, cameras.camera5);

                // Send case to render engine
                socket.emit('render', {msg: 'test'});
			});
		});


        return scene;
    }
    const scene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
})
