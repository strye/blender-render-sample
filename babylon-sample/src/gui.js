//import * as GUI from 'babylonjs-gui';
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from "babylonjs-gui";


class GameGUI {
    static addPanel(scene, renderFunction) {

        const adt = AdvancedDynamicTexture.CreateFullscreenUI("UI",true, scene);

        // We create the container panel to hold the other elements in 
        // the bottom right corner of the screen. 
        // Then add it to the advanced dynamic texture.
        const panel = new BABYLON.GUI.StackPanel();
        panel.width = "220px";
        panel.top = "-25px";
		//panel.background = "white";
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        adt.addControl(panel);

		// Save button
		const button = BABYLON.GUI.Button.CreateSimpleButton("but", "Save");
		button.width = "150px"
		button.height = "40px";
		button.color = "white";
		button.cornerRadius = 20;
		button.background = "green";
		panel.addControl(button);

		button.onPointerUpObservable.add(function() {
			renderFunction();
		});

        // // Next create the text block and add it to the panel
        // const header = new BABYLON.GUI.TextBlock();
        // header.text = "Night to Day";
        // header.height = "30px";
        // header.color = "white";
        // panel.addControl(header);

        // // We create and add the slider to the panel.
        // const slider = new BABYLON.GUI.Slider();
        // slider.minimum = 0;
        // slider.maximum = 1;
        // slider.borderColor = "black";
        // slider.color = "#AAAAAA";
        // slider.background = "#white";
        // slider.value = 1;
        // slider.height = "20px";
        // slider.width = "200px";
        // panel.addControl(slider);

        // // We need to add an observable event to the slider in order to change the light intensity.
        // slider.onValueChangedObservable.add((value) => {
        //     if (light) {
        //         light.intensity = value;
        //     }
        // });

        return adt;
    }
}

export default GameGUI;