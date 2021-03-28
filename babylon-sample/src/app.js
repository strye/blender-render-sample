import _ from 'lodash';
import './styles/style.css'
//import * as earcut from "earcut";

//import Environment from "./classes/environment";
import GameGUI from "./gui.js";

// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from "babylonjs-gui";
// import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, SceneLoader } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";
//import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh } from "@babylonjs/core";
//import * as GUI from 'babylonjs-gui';


const tester = {
    loadScene(scene) {
        const track = tester.loadWalkingSphere();

        const sphere = scene.getMeshByName("sphere");
        const startingPosition = new BABYLON.Vector3(-6, 0.125, 0);
        sphere.position = startingPosition;
        sphere.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-97), BABYLON.Space.LOCAL);

        let distance = 0;
        let step = 0.025;
        let p = 0;

        scene.onBeforeRenderObservable.add(() => {
		    sphere.movePOV(0, 0, step);
            distance += step;
              
            if (distance > track[p].dist) {
                sphere.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
                p +=1;
                p %= track.length; 
                distance = 0;
                if (p === 0) {
                    sphere.position = startingPosition; //reset to initial conditions
                    sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
                    sphere.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-97), BABYLON.Space.LOCAL);
                }
            }
			
        })

    },
	setupCameras(scene, camRad = 5) {
		// User Camera
		const camera = new BABYLON.ArcRotateCamera("camera", (Math.PI / 1.5), (Math.PI / 5), camRad, new BABYLON.Vector3(0, 0, 0), scene);
		//camera.setPosition(new BABYLON.Vector3(Math.PI, 0, camRad));
		camera.viewport = new BABYLON.Viewport(0, 0, 0.75, 1.0);

		const cameras = [];

		// Front Camera
		const camera1 = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, camRad, new BABYLON.Vector3(0, 0, 0));
		//camera1.viewport = new BABYLON.Viewport(0.75, 0.75, 0.25, 0.25);
		cameras.push(camera1);

		// Left Side Camera
		const camera2 = new BABYLON.ArcRotateCamera("camera2", Math.PI, Math.PI / 2, camRad, new BABYLON.Vector3(0, 1, 0));
		//camera2.viewport = new BABYLON.Viewport(0.75, 0.5, 0.25, 0.25);
		cameras.push(camera2);

		// Top Camera
		const camera3 = new BABYLON.ArcRotateCamera("camera3",  Math.PI, 0, camRad, new BABYLON.Vector3(0, 1, 1));
		//camera3.viewport = new BABYLON.Viewport(0.75, 0.25, 0.25, 0.25);
		cameras.push(camera3);

		// Back Camera
		const camera4 = new BABYLON.ArcRotateCamera("camera4", -(Math.PI / 2), Math.PI / 2, camRad, new BABYLON.Vector3(0, 0, 0));
		//camera4.viewport = new BABYLON.Viewport(0.75, 0.0, 0.25, 0.25);
		cameras.push(camera4);

		// Iso Camera
		const camera5 = new BABYLON.ArcRotateCamera("camera5", (Math.PI / 1.5), (Math.PI / 5), camRad, new BABYLON.Vector3(0, 0, 0));
		cameras.push(camera5);



		return {main: camera, viewPorts: cameras};
	},
	setupLighting(scene, intensity = 1) {
		const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
        // const light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, 1, 0), scene);
		// light.position = new BABYLON.Vector3(0, 15, -30);
		//const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

		light.intensity = intensity;
		return light;
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

		scene.activeCameras.push(camera);
		//scene.activeCameras.push(cameras.viewPorts[0]);
		//scene.activeCameras.push(cameras.viewPorts[1]);
		//scene.activeCameras.push(cameras.viewPorts[2]);
		//scene.activeCameras.push(cameras.viewPorts[3]);

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
				//alert("you did it!");
				BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, cameras.viewPorts[0], 1600, data => {
					console.log("Image 1 saved")
				});
				BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, cameras.viewPorts[1], 1600, data => {
					console.log("Image 2 saved")
				});
				BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, cameras.viewPorts[2], 1600, data => {
					console.log("Image 3 saved")
				});
				BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, cameras.viewPorts[3], 1600, data => {
					console.log("Image 4 saved")
				});
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
