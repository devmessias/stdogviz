import Keyboard from "../../utils/keyboard";
import Helpers from "../../utils/helpers";
//import Config from "../../data/config";
import alertify  from "alertifyjs"
// Manages all input interactions
export default class Interaction {
    constructor(canvas, appState, Config, datGui, keypressFunc) {
        // Properties
        this.canvas = canvas;
        this.keypressFunc = keypressFunc
        this.datGui = datGui
        this.timeout = null;

        // Instantiate keyboard helper
        this.keyboard = new Keyboard();

        // Listeners
        // Mouse events


        this.keypressEvent = this.keypressEvent.bind(this)
        // Keyboard events
        this.keyboard.domElement.addEventListener("keydown", (event) => this.keypressEvent(event)
            // Only once

            //if(this.keyboard.eventMatches(event, 'escape')) {
            //  console.log('Escape pressed');
            // }
        );
        this.appState = appState
    }
    keypressEvent(event){
        let repeat = event.repeat
        let key = event.key
        let alertHTMLobj = document.getElementById("bootstraAlertStrong")
        //let bootstrapAlert = document.getElementById("bootstrapAlert")
        let bootstrapAlert = $("#bootstrapAlert")
        switch (key.toLowerCase()) {
            case "e":
                alertify.message("Edition Mode")
                this.datGui.closed = true
                this.appState.vimMode = "Edition";
                console.info("Vim mode Edition");
                break;

            case "v":
                alertify.message("Visual Mode")
                this.datGui.closed = false
                this.appState.vimMode = "Visual";
                console.info("Vim mode Visualization");
                break;
            case "n":
                alertify.message("Navigation Mode")
                this.datGui.closed = true
                this.appState.vimMode = "Navigation";
                break;

            case "s":
                document.getElementById("widthSaveImage").value = window.innerWidth
                document.getElementById("heightSaveImage").value = window.innerHeight
                $('#saveImageModal').modal("show")

            case "d":
                if (this.appState.vimMode == "Edition")
                    this.keypressFunc(key, "deleteNode")
                break;


            case "l":
            case "j":
            case "i":
            case "k":

                if ((this.appState.vimMode == "Visual") &&(key=="l")){
                    alertify.confirm("Are you sure you want to reload the graph?",
                        ()=>{
                            this.keypressFunc(key, "reloadGraph")
                        });
                }

                if (this.appState.vimMode == "Edition"){
                    this.keypressFunc(key, "move")
                    repeat = false
                }
                break;

            case "r":
                if (this.appState.vimMode == "Visual")
                    alertify.message("Recalculating  positions")
                    this.keypressFunc (key,"recalcPos")
                break;



            default:
                break;
        }
        if (repeat) {
            return;
        }

        //console.log("keydown", event);
    }
}
