import * as THREE from "three";
import colormap from "colormap"
import alertify  from "alertifyjs"

import Config from "../../../data/config";

import { getMarkerImgVertexShader} from "./shaders/markerImg.vsh.js";
import {markerImgFragmentShader} from "./shaders/markerImg.fsh.js";

import {getMarkerVertexShader} from "./shaders/marker.vsh.js";
import {getMarkerFragmentShader} from "./shaders/marker.fsh.js";

import {fragmentShaderFixedColor, vertexShader, fragmentShader} from "./shaders"


export default class Nodes {
    constructor(scene, layer, bloomLayer) {

        this.createNodes = this.createNodes.bind(this);
        this.scene = scene;
        this.layer = layer
        this.bloomLayer = bloomLayer

        this.numNodes = 0
        this.nodesData = {}
        this.instancedNodes

        this.availableMaterials = [
            "fast",
            "phong",
        ]
    }

    //updateNodesSingle(nodesData) {
    //for (const [nodeName, props] of Object.entries(nodesData)){
    //let node = this.nodes[nodeName];
    //const pos = props["pos"]
    //// let node = this.scene.getObjectByName(nodeName)
    ////   if (node) {

    //node.position.x = pos[0];
    //node.position.y = pos[1];
    //node.position.z = pos[2];
    //// }
    //}
    //}
    //moveNodes(pickedPos, nodesName, dr ) {
    //for (let index = 0; index < nodesName.length; index++) {
    ////for (const [nodeName, props] of Object.entries(nodesData)){
    ////  let idNode = 0;
    //let node = this.nodes[nodesName[index]];
    //let pos = node.position
    //// let node = this.scene.getObjectByName(nodeName)
    ////   if (node) {

    ////node.translateX(10)
    ////node.position.x = pickedPos// pos.x+dr[0];
    ////node.position.y = pos.y+dr[1];
    ////node.position.z = pos.z+dr[2];
    //// }
    //}
    //}
    //deleteNode(nodeId){
    //if (!(nodeId in this.nodes)) return
    //this.scene.remove(this.nodes[nodeId])
    //delete this.nodes[nodeId]
    //}
    colorByField(prop){
        let bufferColors = JSON.parse(JSON.stringify(this.nodesData[prop].flat()))
        if (bufferColors.length != this.numNodes*3){
            alertify.error("The field should be in rgb format")
            return
        }
        //this.instancedNodes.material.fragmentShader = fragmentShader
        this.instancedNodes.material.fragmentShader = fragmentShader
        this.instancedNodes.geometry.attributes.bufferColors.array = new Float32Array(bufferColors);
        this.instancedNodes.geometry.attributes.bufferColors.needsUpdate = true
        this.instancedNodes.material.needsUpdate = true;

    }
    colorByProp(prop){
        let colors = colormap({
            colormap: "jet",
            nshades: this.numNodes,
            format: "float",
            alpha: 1
        })
        let values = this.nodesData[prop]

        const bufferColors = colors
            .map((color, index) => [values[index], color]) // add the prop to sort by
            .sort(([val1], [val2]) => val2 - val1) // sort by the prop data
            .map(([, color]) => color)
            .map(([r, g, b, alpha])=>[r, g, b])
            .flat()

        if (bufferColors.length != this.numNodes*3){
            alertify.error("Invalid prop")
            alert("prop fail")
            return
        }

        this.instancedNodes.material.fragmentShader = fragmentShader
        this.instancedNodes.geometry.attributes.bufferColors.array = new Float32Array(bufferColors);
        this.instancedNodes.geometry.attributes.bufferColors.needsUpdate = true
        this.instancedNodes.material.needsUpdate = true;

    }
    changeColor(color){
        let c = new THREE.Color(color)
        this.instancedNodes.material.fragmentShader = fragmentShaderFixedColor(c)
        this.instancedNodes.material.needsUpdate = true;

    }
    changeOpacity(value){
        this.uniforms.bufferOpacity.value = value;
        this.instancedNodes.material.needsUpdate = true;
    }
    changeScale(value){
        this.uniforms.bufferNodeScale.value = value;
        this.instancedNodes.geometry.needsUpdate = true;
    }
    updateNodePositions(positions){
        this.instancedNodes.geometry.attributes.bufferNodePositions.array = new Float32Array(positions);
        this.instancedNodes.geometry.attributes.bufferNodePositions.needsUpdate = true
    }
    changeRadius(value){
        this.instancedNodes.geometry.attributes.bufferRadius = value;
        this.instancedNodes.material.needsUpdate = true;
    }


    deleteAllNodes(){
        if(this.instancedNodes){
            this.instancedNodes.geometry.dispose()
            this.instancedNodes.material.dispose()
            this.instancedNodes.geometry.needsUpdate = true;
            this.instancedNodes.material.needsUpdate = true;
            this.scene.remove(this.instancedNodes)
            this.instancedNode = null;
        }
    }
    createNodes(nodesData, what="points") {
        console.info("Creating nodes", nodesData)
        what = what || 'points';
        const numNodes = Object.keys(nodesData.id).length
        const fixedNodeSize = nodesData.props.includes("size2") == false;
        this.fixedNodeSize = fixedNodeSize;
        const fixedColor = nodesData.props.includes("color") == false;
        this.fixedColor = fixedColor;

        this.nodesData = nodesData
        this.numNodes = numNodes

        this.deleteAllNodes()


        let bufferNodePositions = nodesData.pos


        this.uniforms = {
            bufferOpacity: {
                type: 'f', // a float
                value: 1
            },
            bufferNodeScale:{
                type: 'f',
                value: 5
            },
        };
        let bufferNodeSize;
        if (fixedNodeSize){
            console.info("Fixed Node Size")
            this.uniforms.bufferNodeSize = {
                type: 'f',
                value: 1
            }
        }
        if (fixedColor){
            console.info("Fixed Color")
            this.uniforms.bufferColors = {
                type: 'vec3',
                value: new Float32Array([0.8, 0.0, 0.8])
            }

        }

        let nodesMesh;

        let material;
        const marker = '2'
        //const markerImg = 'circle';
        const markerImg = 'ball';
        //const markerImg = 'disc';
        //const markerImg = 'spark1';
        //const markerImg = 'lensflare';

        let instancedGeometry = new THREE.InstancedBufferGeometry();
        if (marker=='1'){
            //
            let markerGeometry = new  THREE.PlaneBufferGeometry(1, 1, 1)
            //let circleGeometry = new  THREE.CircleBufferGeometry(1, 6)
            instancedGeometry.index = markerGeometry.index;
            instancedGeometry.attributes = markerGeometry.attributes;
            this.uniforms.map = { value: new THREE.TextureLoader().load( `textures/sprites/${markerImg}.png` ) }
            this.uniforms.useDiffuse2Shadow = {
                type: 'f',
                value: 0,
            }

            //instancedGeometry = instancedGeometry.copy(circleGeometry);
            material = new THREE.RawShaderMaterial( {
                //vertexShader: markerVertexShader,
                vertexShader: getMarkerImgVertexShader(fixedNodeSize, fixedColor),
                fragmentShader: markerImgFragmentShader,
                uniforms: this.uniforms,
                transparent: true,
                //blending: THREE.AdditiveBlending,
                blending: THREE.NormalBlending,
                depthTest: true,
                //depthTest: false,
                depthWrite: true,
            } );

        }else{
            //let symbol = "^";
            let availableSymbols = ['o', 's', 'd', '^', 'p', 'h', 's6', '+', 'x']
            const randomChoice = (arr) => arr[Math.floor(arr.length * Math.random())];
            let symbol = randomChoice(availableSymbols);
            let markerGeometry = new  THREE.PlaneBufferGeometry(1, 1, 1)
            //let circleGeometry = new  THREE.CircleBufferGeometry(1, 6)
            instancedGeometry.index = markerGeometry.index;
            instancedGeometry.attributes = markerGeometry.attributes;
            material = new THREE.RawShaderMaterial( {
                vertexShader: getMarkerVertexShader(fixedNodeSize, fixedColor),
                fragmentShader: getMarkerFragmentShader(symbol),
                uniforms: this.uniforms,
                transparent: true,
                //blending: THREE.AdditiveBlending,
                //blending: THREE.NormalBlending,
                //depthTest: true,
                //depthTest: false,
                depthWrite: true,
            } );


        }

        if(fixedNodeSize == false)
            instancedGeometry.addAttribute(
                "bufferRadius",
                new THREE.InstancedBufferAttribute(new Float32Array(nodesData.size), 1, false)
            );
        if(fixedColor == false)
            instancedGeometry.addAttribute("bufferColors",
                new THREE.InstancedBufferAttribute(new Float32Array(nodesData.color.flat()), 3, false));

        instancedGeometry.addAttribute("bufferNodePositions",
            new THREE.InstancedBufferAttribute(new Float32Array(bufferNodePositions), 3, false)
        );



        nodesMesh = new THREE.Mesh(instancedGeometry, material);


        this.instancedNodes = nodesMesh;

        this.scene.add(nodesMesh);
    }


}
