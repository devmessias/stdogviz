// Global imports -
import * as THREE from "three";
import alertify  from "alertifyjs"

// Components
import Renderer from "./components/renderer/main";
//import PickCamera from "./components/pick";
import Controls from "./components/controls";
import Nodes from "./components/nodes/main";
import Edges from "./components/edges/main";


// User Interaction
import Keyboard from "./interactions/keyboard";
import DatGUI from './interactions/datGUI';

// data
//import Config from "./../data/config";


// State of the application


export default class Graph {
    constructor(
        idCanvasHTML,
        Config,
        keyboardPressFunction
    ) {

        this.Config = Config
        this.canvas = document.querySelector("#appContainer");
        this.camera = new THREE.PerspectiveCamera(
            Config.camera.fov, Config.camera.aspect, Config.camera.near, Config.camera.far);
        this.scene = new THREE.Scene();

        this.renderer;
        this.state;
        this.keyboardPressFunction = keyboardPressFunction

        //this.init = this.init.bind(this)
    }
    init(){
        this.state = {
            vimMode: "Visual",
            isLoaded: false,
            firstLoad: true,
            takingScreenshot: false,
            defaultProps: {},
            stopChanges: false,
            renders: [],
            rendering: false,
            defaultProps: {}
        }

        let viewSize = 1;
        var aspectRatio = window.innerWidth / window.innerHeight;
        this.state.originalAspect = window.innerWidth / window.innerHeight;

        this.scene.add(this.camera);

        this.scene.background = new THREE.Color(this.Config.scene.color);

        this.nodes = new Nodes(this.scene, 0, 0);
        this.edges = new Edges(this.scene, 0, 1);

        this.renderer = new Renderer(this.scene, this.canvas, this.camera, this.state);

        this.controls = new Controls(this.camera, this.canvas, this.renderer.render);

        this.datGui = new DatGUI(
            this.scene,
            this.renderer,
            this.camera,
            this.nodes,
            this.edges,
            this.Config,
            //bloomPassEdges,edgesBloomScene,
           this.state);

    this.keyboardInteraction = new Keyboard(
        this.canvas,
        this.state,
        this.Config,
        this.datGui.gui,
        this.keyboardPressFunction,
    );

    }
    ressetLook(){
        let position = this.edges.instancedEdges.geometry.boundingSphere.center
        this.camera.position.z = 4*this.edges.instancedEdges.geometry.boundingSphere.radius
        this.camera.lookAt(position)
        this.camera.updateProjectionMatrix();
        this.renderer.render()
    }

}


    //{
        //const color = 0xffffff;
        //const intensity = 4;
        //const light = new THREE.DirectionalLight(color, intensity);
        //light.position.set(-1, 2, 4);
        //light.layers.enable(0)
        //camera.add(light);
    //}

