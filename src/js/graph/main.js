// Global imports -
import * as THREE from "three";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import alertify  from "alertifyjs"

// Components
import Renderer from "./components/renderer/main";
//import PickCamera from "./components/pick";
import Nodes from "./components/nodes/main";
import Edges from "./components/edges/main";


// User Interaction
import Keyboard from "./interactions/keyboard";
import DatGUI from './interactions/datGUI';

export default class Graph {
    constructor(
        idCanvasHTML,
        Config,
        keyboardPressFunction,
        use2d=false,
    ) {


        this.Config = Config
        this.use2d = use2d;
        this.idCanvasHTML = idCanvasHTML
        this.canvas = document.getElementById(`${idCanvasHTML}`);
        this.container = document.getElementById(`container${idCanvasHTML}`);
        if(use2d){
            this.camera = new THREE.OrthographicCamera(
                2, -2, 2, -2, Config.camera.near, Config.camera.far);

        }else{
            this.camera = new THREE.PerspectiveCamera(
                Config.camera.fov, Config.camera.aspect, Config.camera.near, Config.camera.far);
        }

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
            comunityField:{},
            rendering: false,
            defaultProps: {}
        }

        let viewSize = 1;
        var aspectRatio = window.innerWidth / window.innerHeight;
        this.state.originalAspect = window.innerWidth / window.innerHeight;

        this.scene.add(this.camera);

        this.scene.background = new THREE.Color(this.Config.scene.color);

        this.nodes = new Nodes(this.scene, this.use2d);
        this.edges = new Edges(this.scene, 0, 1);


        this.controls = new OrbitControls(this.camera, this.canvas);

        this.controls.target.set(0, 0, 0);
        this.controls.enableKeys=true;
        this.controls.screenSpacePanning = true;
        //this.controls.update();

        if(this.use2d){

            this.controls.enableRotate=false;
            //this.controls.maxPolarAngle = 0; // radians
            //this.controls.minAzimuthAngle = - 0; // radians
            //this.controls.maxAzimuthAngle = 0; // radians

        }
        this.renderer = new Renderer(this.scene, this.controls, this.container, this.canvas, this.camera, this.state);

        if (this.Config.useGuiControl)
            this.datGui = new DatGUI(
                this.idCanvasHTML,
                this.scene,
                this.renderer,
                this.camera,
                this.nodes,
                this.edges,
                this.Config,
                //bloomPassEdges,edgesBloomScene,
                this.state);
        if (this.Config.useKeyboard)
            this.keyboardInteraction = new Keyboard(
                this.canvas,
                this.state,
                this.Config,
                this.datGui.gui,
                this.keyboardPressFunction,
            );

        //{
            //const color = 0xffffff;
            //const intensity = 4;
            //const light = new THREE.DirectionalLight(color, intensity);
            //light.position.set(-1, 2, 4);
            //light.layers.enable(0)
            //this.camera.add(light);
        //}
    }
    ressetLook(){
        let position = this.edges.instancedEdges.geometry.boundingSphere.center
        this.camera.position.z = 4*this.edges.instancedEdges.geometry.boundingSphere.radius
        this.camera.lookAt(position)
        this.camera.updateProjectionMatrix();
        this.renderer.render()
    }
    deleteGraph(){
        this.nodes.deleteAllNodes()
        this.edges.deleteAllEdges()
    }
    getURI(width, height, transparency){
        transparency = transparency || false;
        const uri = this.renderer.getURI(width, height, transparency);
        this.uri = uri
    }
    stopRender(){
        //this.deleteGraph();
        this.renderer.stop();

    }
}


