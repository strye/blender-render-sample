
let testMsg = 'test message';

window.UpdateMaterial = (face, color) => {
	sceneRunner.changeMaterial(face,color);
}

window.PupRender = async () => {
	return await sceneRunner.renderCamera();
}

function testinject(msg) { 
	console.log(msg); 
	return msg; 
}

