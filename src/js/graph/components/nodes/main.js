import * as THREE from "three";
import colormap from "colormap"
import alertify  from "alertifyjs"

import Config from "../../../data/config";
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


    createNodes(nodesData) {

        const numNodes = Object.keys(nodesData.id).length
        this.nodesData = nodesData
        this.numNodes = numNodes

        if(this.instancedNodes){
            this.instancedNodes.geometry.dispose()
            this.instancedNodes.material.dispose()
            this.instancedNodes.geometry.needsUpdate = true;
            this.instancedNodes.material.needsUpdate = true;
            this.scene.remove(this.instancedNodes)
        }

        let baseGeometry = new  THREE.SphereBufferGeometry(1, 8, 8)
        let instancedGeometry = new THREE.InstancedBufferGeometry().copy(baseGeometry);
        instancedGeometry.maxInstancedCount = numNodes

        this.uniforms = {
            bufferOpacity: {
                type: 'f', // a float
                value: Config.nodes.opacity
            },
            bufferNodeScale:{
                type: 'f',
                value: Config.nodes.scale
            }
        };



        let bufferColors = nodesData.color.flat()

        // if the array its is already flatenedk
        let bufferNodePositions = nodesData.pos

        let bufferRadius = []
        //const f = (arr, index) => arr.push(...[0, 1, 2].map((i)=>nodesData.pos[index*3+i]))
        for (let iNode=0; iNode<numNodes; iNode++){

            //let color = new THREE.Color(nodesData.color[iNode])
            //bufferColors.push(color.r, color.g, color.b)
            //bufferColors.push(color.r, color.g, color.b)

            //bufferNodePositions.push(
                //nodesData.pos[iNode][0],
                //nodesData.pos[iNode][1],
                //nodesData.pos[iNode][2],
            //)
            bufferRadius.push(1)
        }

        // false that its the bufferCollors will not be normalized, each value
        // will go from 0 to 255=
        //

        instancedGeometry.addAttribute(
            "bufferRadius",
            new THREE.InstancedBufferAttribute(new Float32Array(bufferRadius), 1, false)
        );
        instancedGeometry.addAttribute("bufferColors",
            new THREE.InstancedBufferAttribute(new Float32Array(bufferColors), 3, false));
        instancedGeometry.addAttribute("bufferNodePositions",
            new THREE.InstancedBufferAttribute(new Float32Array(bufferNodePositions), 3, false)
        );

        let material = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            transparent: true,
            blending: THREE.NormalBlending,
            uniforms: this.uniforms,
        });

        let mesh = new THREE.Mesh(instancedGeometry, material);
        this.instancedNodes = mesh

        this.scene.add(mesh)

    }
}
