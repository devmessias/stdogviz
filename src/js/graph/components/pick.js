import * as THREE from "three";

import Config from "../../data/config";
import config from "../../data/config";



export default class PickCamera  {
    //le
    constructor(scene, camera, canvas, render, appState) {
        this.camera = camera
        this.canvas = canvas;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.appState = appState

        this.pickPosition = { x: 0, y: 0 };
        this.getCanvasRelativePosition = this.getCanvasRelativePosition.bind(this);
        this.clearPickPosition = this.clearPickPosition.bind(this);
        this.setPickPosition = this.setPickPosition.bind(this);
        this.pick = this.pick.bind(this);

        this.clearPickPosition();
        window.addEventListener("mousemove", this.setPickPosition);
        window.addEventListener("mouseout", this.clearPickPosition);
        window.addEventListener("mouseleave", this.clearPickPosition);
        window.addEventListener("click", this.pick);
        this.pickedObject = null;
        this.pickedObjects = [];
        this.boxes = []
        this.firstClick = true
        this.render = render
    }



    getCanvasRelativePosition(event) {
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        //  console.log(rect)
        return {
            x: ((event.clientX - rect.left) * canvas.width) / rect.width,
            y: ((event.clientY - rect.top) * canvas.height) / rect.height,
        };
    }
    setPickPosition(event) {
        const canvas = this.canvas;
        const pickPosition = this.pickPosition;
        const pos = this.getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.width) * 2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y
    }
    clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        this.pickPosition.x = -100000;
        this.pickPosition.y = -100000;

    }
    deleteHelpers(){
        this.pickedObjects.map(function(name){
            // this.boxes.pop(this.boxes.indexOf(name))
            this.scene.remove(this.scene.getObjectByName(name+"_box"));
        }.bind(this))

    }
    unpick(){
        this.boxes.map(function(box){

            this.scene.remove(box);
             //this.boxes.pop(this.boxes.indexOf(name))
            //this.scene.remove(this.scene.getObjectByName(name));
        }.bind(this))

        //if (this.pickedObject) {
        //console.info("PICKED", this.pickedObject);
                //this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObjects = [];
        this.boxes = [];
        this.render()

        // }
    }
    pick( event) {
        //event.preventDefault()
        //this.setPickPosition(event)
        //this.setPickPosition(event)
        if (this.appState.vimMode == "Visual") return
        const normalizedPosition = this.pickPosition;

        // restore the color if there is a picked object
        //this.unpick()

        // cast a ray through the frustum
        this.raycaster.setFromCamera(normalizedPosition, this.camera);
        // get the list of objects the ray intersected
        let  intersectedObjects = this.raycaster.intersectObjects(this.scene.children);
        if (intersectedObjects.length) {
            // pick the first object. It's the closest one
            //  console.debug("IntersectedObjects", intersectedObjects);
            intersectedObjects = intersectedObjects.filter(
             obj => { if (obj.object.type == "Mesh") return obj} );
            if (intersectedObjects.length){
                //this.pickedObject =
                //if (intersectedObjects[0].object.type!="Mesh") return
                // save its color

                //   this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                // set its emissive color to flashing red/yellow
                let name = intersectedObjects[0].object.name
                if(this.pickedObjects.includes(name)){
                    //this.scene.remove(this.scene.getObjectByName(name+"_box"));
                    //this.pickedObjects.pop(this.pickedObjects.indexOf(name))

                }else{
                    let box = new THREE.BoxHelper( intersectedObjects[0].object, 0xffff00 );

                    box.name = name + "_box"
                    this.boxes.push(box)
                    this.pickedObjects.push(name)
                    this.scene.add( box );
                    this.render()

                }


            }
        }
    }
}
