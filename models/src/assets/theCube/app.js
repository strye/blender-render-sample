import bRunner from './babylon-runner.js'

// We add this to the window context so that it is 
//   available to our puppeteer scripts
window.sceneRunner = null;

document.addEventListener('DOMContentLoaded', event => {
	let canvas = document.getElementById("renderCanvas");
	sceneRunner = new bRunner(canvas);
	sceneRunner.setupRenderLoop();
})
