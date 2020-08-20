// Global imports -
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import alertify  from "alertifyjs"

import Renderer from "./components/renderer/main";
import Nodes from "./components/nodes/main";
import Edges from "./components/edges/main";

import Keyboard from "./interactions/keyboard";
import DatGUI from './interactions/datGUI';


/**
 * Class representing the  Graph
 * */
 export default class Graph {
    /**
     * @param  {string} Id of Canvas DOMElement
     * @param  {string} Id of Canvas DOMElement
     * @param  {bool}
     * @param  {bool} If the graph should be ploted in 2d
     * @return {Object} A random choiced element of the given array
     */
    constructor(
        idCanvasHTML,
        Config,
        keyboardPressFunction,
        use2d=false,
        useHighQuality=true,
        useBloom=true,
        showStats=true,
        camera={
            fov: 40,
            near: 2,
            far: 1000,
            aspect: 1,
        },
    ) {
        this.Config = Config
        this.use2d = use2d;
        this.showStats = showStats;
        this.useHighQuality = useHighQuality;
        this.useBloom = useBloom;
        this.idCanvasHTML = idCanvasHTML
        this.canvas = document.getElementById(`${idCanvasHTML}`);
        this.container = document.getElementById(`container${idCanvasHTML}`);
        if(use2d){
            this.camera = new THREE.OrthographicCamera(
                2, -2, 2, -2, Config.camera.near, Config.camera.far);

        }else{
            this.camera = new THREE.PerspectiveCamera(
                camera.fov, camera.aspect, 1, camera.far);
        }

        this.scene = new THREE.Scene();

        this.renderer;
        this.state;
        this.keyboardPressFunction = keyboardPressFunction

        //this.init = this.init.bind(this)
    }
    init(dataPool=false){
        this.state = {
            vimMode: "Visual",
            isLoaded: false,
            firstLoad: true,
            takingScreenshot: false,
            stopChanges: false,
            renders: [],
            comunityField:{},
            edgesGroupField:{},
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

        console.group("Render Init")
        this.renderer = new Renderer(
            this.useHighQuality,
            this.useBloom,
            this.showStats,
            this.scene, this.controls, this.container, this.canvas, this.camera, this.state,
            dataPool);
        console.groupEnd();

        if (this.Config.useGuiControl)
            this.datGui = new DatGUI(
                this.idCanvasHTML,
                this.scene,
                this.renderer,
                this.camera,
                this.nodes,
                this.edges,
                this.Config,
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
    /**
     * Random select a element of a given array
     */
    ressetLook(){
        // let position = this.edges.edgesGroup["main"].mesh.geometry.boundingSphere.center
        // this.camera.position.z = 4*this.edges.edgesGroup["main"].mesh.geometry.boundingSphere.radius
        //this.camera.position.z = 4;
        let position = {x:0, y:1, z:-1};
        let radius = 15;
        this.camera.position.z = 4*radius;
        
        this.camera.lookAt(position)
        this.camera.updateProjectionMatrix();
        this.renderer.render()
    }
    /**
     * Random select a element of a given array
     */
    deleteGraph(){
        this.nodes.deleteAllNodes()
        this.edges.deleteAllEdges()
    }
    /**
     * @param  {string} Id of Canvas DOMElement
     * @param  {string} Id of Canvas DOMElement
     * @param  {bool}
     * @param  {bool} If the graph should be ploted in 2d
     * @return {Object} A random choiced element of the given array
     */
    getURI(width, height, transparency){
        transparency = transparency || false;
        const uri = this.renderer.getURI(width, height, transparency);
        this.uri = uri
    }
    /**
     * Random select a element of a given array
     */
    stopRender(){
        //this.deleteGraph();
        this.renderer.stop();

    }
}


