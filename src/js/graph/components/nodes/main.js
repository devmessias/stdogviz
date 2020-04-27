import * as THREE from "three";
import colormap from "colormap"
import alertify  from "alertifyjs"

import Config from "../../../data/config";

import { getMarkerImgVertexShader} from "./shaders/markerImg.vsh.js";
import {markerImgFragmentShader} from "./shaders/markerImg.fsh.js";

import {getMarkerVertexShader} from "./shaders/marker.vsh.js";
import {getMarkerFragmentShader, availableMarkers} from "./shaders/marker.fsh.js";

import {randomString, randomChoice} from "../../helpers/tools";

/**
 * Class representing the Nodes of the Graph
 * */
export default class Nodes {
    /**
     * Create a empty nodes object
     * @param {object} scene - THREE.scene
     * @param {bool} use2d - If the nodes should be ploted in 2d
     */
    constructor(scene, use2d) {
        this.scene = scene;
        this.use2d = use2d;

        this.nodesGroup = {};
        // This string is used in order to indentify the group of nodes
        // selected. If the string is empty, then the changes will be applied
        // across all group of nodes
        this.selectedGroupName = '';

    }
    /**
     * Set the selected group
     * @param {string} groupName - the name of the group. If the groupName thit not exist
     *  then set the selecedGroupName as a empty string
     **/
    setGroup(groupName){
        this.selectedGroupName = Object.keys(this.nodesGroup).includes(value)? value : '';
    }
    /**
     * Set the selected group
     * @param {string} groupName - the name of the group. If the groupName thit not exist
     *  then set the selecedGroupName as a empty string
     * @return {array} arr - [[...[string, nodesGroupObj]]
     **/
    getGroup(){
        const allGroups = Object.entries(this.nodesGroup);
        const arr = this.selectedGroupName != ''? [[this.selectedGroupName, this.nodesGroup[this.selectedGroupName]]] : allGroups;
        return arr;
    }
    /**
     * Set the selected group
     * @param {string} groupName - the name of the group. If the groupName thit not exist
     *  then set the selecedGroupName as a empty string
     **/
    colorByField(prop){
        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {

            let bufferColors = nodesObj.nodesData[prop].flat()
            if (bufferColors.length != nodesObj.numNodes*3){
                alertify.error(` ${prop} it's not in RGB format `)
                return
            }else{
                this.updateColors(bufferColors, nodesGroupName);
            }

        }
    }

    updateColors(colors, nodesGroupName){

        let nodesObj = this.nodesGroup[nodesGroupName];
        if (nodesObj.fixedColor){
            let fixedColor = false;
            nodesObj.mesh.material.vertexShader = getMarkerVertexShader(nodesObj.fixedNodeSize, fixedColor, nodesGroupName);

            nodesObj.mesh.geometry.addAttribute("bufferColors",
                new THREE.InstancedBufferAttribute(new Float32Array(colors), 3, false));

            nodesObj.fixedColor = fixedColor;
            delete nodesObj.uniforms.bufferColors;
            nodesObj.mesh.geometry.needsUpdate = true;

        }else{
            nodesObj.mesh.geometry.attributes.bufferColors.array = new Float32Array(colors);
            nodesObj.mesh.geometry.attributes.bufferColors.needsUpdate = true


        }
        nodesObj.mesh.material.needsUpdate = true;


    }
    colorByProp(prop){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {

            let colors = colormap({
                colormap: "jet",
                nshades: nodesObj.numNodes,
                format: "float",
                alpha: 1
            })
            let values = nodesObj.nodesData[prop]

            const bufferColors = colors
                .map((color, index) => [values[String(index)], color]) // add the prop to sort by
                .sort(([val1], [val2]) => val2 - val1) // sort by the prop data
                .map(([, color]) => color)
                .map(([r, g, b, alpha])=>[r, g, b])
                .flat()
            this.updateColors(bufferColors, nodesGroupName);

        }
    }
    updateColor(color, nodesGroupName){

        let nodesObj = this.nodesGroup[nodesGroupName];
        if (nodesObj.fixedColor){
            nodesObj.uniforms.bufferColors.value = color;
            //nodesObj.mesh.geometry.needsUpdate = true;
        }else{
            let fixedColor = true;
            nodesObj.uniforms.bufferColors = {
                type: 'vec3',
                value: color
            }
            nodesObj.mesh.geometry.deleteAttribute('bufferColors');
            nodesObj.mesh.material.vertexShader = getMarkerVertexShader(nodesObj.fixedNodeSize, fixedColor, nodesGroupName);

            nodesObj.fixedColor = true;
            nodesObj.mesh.geometry.needsUpdate = true;
            nodesObj.fixedColor = true;
        }
        nodesObj.mesh.material.needsUpdate = true;

    }
    updateMarker(marker, nodesGroupName){

        let nodesObj = this.nodesGroup[nodesGroupName];
        nodesObj.mesh.material.vertexShader = getMarkerVertexShader(
            nodesObj.fixedNodeSize, nodesObj.fixedColor, nodesGroupName);

        nodesObj.mesh.material.fragmentShader = getMarkerFragmentShader(
            marker, nodesGroupName);

        nodesObj.mesh.material.needsUpdate = true;


    }
    changeMarker(marker){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {
            this.updateMarker(marker, nodesGroupName);

        }
    }
    stopUpdate(){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {
            nodesObj.mesh.geometry.needsUpdate = false
            nodesObj.mesh.material.needsUpdate =false;
        }
    }



    changeColor(colorHEX){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {
            let color = new THREE.Color(colorHEX);
            this.updateColor(color, nodesGroupName);

        }
    }
    //size gui interaction
    sizeByField(prop){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {

            let bufferNodeSize = nodesObj.nodesData[prop].flat()
            if (bufferNodeSize.length != nodesObj.numNodes){
                alertify.error(` ${prop} it's not in a valid format `)
                return
            }else{
                this.updateSizes(bufferNodeSize, nodesGroupName);
            }

        }
    }

    updateSizes(sizes, nodesGroupName){

        let nodesObj = this.nodesGroup[nodesGroupName];
        let sMin = Math.min(...sizes)
        let sMax = Math.max(...sizes)
        sizes = sizes.map((s)=> (s-sMin)/(sMax-sMin))
        if (nodesObj.fixedNodeSize){
            let fixedNodeSize = false;
            nodesObj.mesh.material.vertexShader = getMarkerVertexShader(fixedNodeSize, nodesObj.fixedColor, nodesGroupName);


            let sizesBuffer = new THREE.InstancedBufferAttribute(new Float32Array(sizes), 1, true);
            nodesObj.mesh.geometry.addAttribute("bufferNodeSize",
                sizesBuffer);

            nodesObj.fixedNodeSize = fixedNodeSize;
            delete nodesObj.uniforms.bufferNodeSizes;
            nodesObj.mesh.geometry.needsUpdate = true;

        }else{
            nodesObj.mesh.geometry.attributes.bufferNodeSizes.array = new Float32Array(sizes);
            nodesObj.mesh.geometry.attributes.bufferNodeSizes.needsUpdate = true

        }
        nodesObj.mesh.material.needsUpdate = true;


    }
    updateSize(size, nodesGroupName){

        let nodesObj = this.nodesGroup[nodesGroupName];
        if (nodesObj.fixedNodeSize){
            nodesObj.uniforms.bufferNodeSizes.value = color;
            //nodesObj.mesh.geometry.needsUpdate = true;
        }else{
            let fixedNodeSize = true;
            nodesObj.uniforms.bufferNodeSizes = {
                type: 'vec3',
                value: color
            }
            nodesObj.mesh.geometry.deleteAttribute('bufferNodeSizes');
            nodesObj.mesh.material.vertexShader = getMarkerVertexShader(nodesObj.fixedNodeSize, fixedNodeSize, nodesGroupName);
            nodesObj.fixedNodeSize = true;
            nodesObj.mesh.geometry.needsUpdate = true;
            nodesObj.fixedNodeSize = true;
        }
        nodesObj.mesh.material.needsUpdate = true;

    }


    // end size gui itneraction
    changeRadius(value){
        this.instancedNodes.geometry.attributes.bufferRadius = value;
        this.instancedNodes.material.needsUpdate = true;
    }

    changeEdgeColor(color){
        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {
            //for (let nodesObj of this.nodesGroup){
            nodesObj.uniforms.edgeColor.value = new THREE.Color(color);
            nodesObj.mesh.geometry.needsUpdate = true;
        }
    }
    changeEdgeWidth(value){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {
            //for (let nodesObj of this.nodesGroup){
            nodesObj.uniforms.edgeWidth.value = value;
            nodesObj.mesh.geometry.needsUpdate = true;
        }
    }

    changeOpacity(value){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {
            //for (let nodesObj of this.nodesGroup){
            nodesObj.uniforms.bufferOpacity.value = value;
            nodesObj.mesh.geometry.needsUpdate = true;
        }
    }
    changeScale(value){

        for (const [nodesGroupName, nodesObj] of this.getGroup() ) {
            //for (let nodesObj of this.nodesGroup){
            nodesObj.uniforms.bufferNodeScale.value = value;
            nodesObj.mesh.geometry.needsUpdate = true;
            nodesObj.mesh.material.needsUpdate = true;
        }
    }

    updateNodePositions(positions){
        this.instancedNodes.geometry.attributes.bufferNodePositions.array = new Float32Array(positions);
        this.instancedNodes.geometry.attributes.bufferNodePositions.needsUpdate = true
    }



    deleteAllNodes(){
        for (const [key, nodesObj] of Object.entries(this.nodesGroup)) {
            nodesObj.mesh.geometry.dispose();
            nodesObj.mesh.material.dispose();
            nodesObj.mesh.geometry.needsUpdate = true;
            nodesObj.mesh.material.needsUpdate = true;
            this.scene.remove(nodesObj.mesh);
            delete this.nodesGroup[key];
        }
    }
    createNodes(nodesData,  clear=false) {
        let nodesGroupName;
        if (clear){
            nodesGroupName = 'main';
        }else{
            nodesGroupName = nodesData.props.includes('name')? nodesData.name : randomString();
        }
        console.info("Creating nodes", nodesGroupName);


        let nodesObj = {}

        const numNodes = Object.keys(nodesData.id).length
        const fixedNodeSize = nodesData.props.includes("size") == false;
        const fixedColor = nodesData.props.includes("color") == false;

        if (clear) this.deleteAllNodes();

        let bufferNodePositions = nodesData.pos;

        let uniforms = {
            bufferOpacity: {
                type: 'f', // a float
                value: 1
            },
            bufferNodeScale:{
                type: 'f',
                value: 1
            },
        };
        let bufferNodeSize;
        if (fixedNodeSize){
            console.info("Fixed Node Size")
            uniforms.bufferNodeSize = {
                type: 'f',
                value: 1
            }
        }
        if (fixedColor){
            console.info("Fixed Color")
            uniforms.bufferColors = {
                type: 'vec3',
                value: new Float32Array([0.8, 0.0, 0.8])
            }

        }

        let nodesMesh;

        let material;
        let instancedGeometry = new THREE.InstancedBufferGeometry();
        //if (marker=='1'){
        ////
        //let markerGeometry = new  THREE.PlaneBufferGeometry(1, 1, 1)
        ////let circleGeometry = new  THREE.CircleBufferGeometry(1, 6)
        //instancedGeometry.index = markerGeometry.index;
        //instancedGeometry.attributes = markerGeometry.attributes;
        //this.uniforms.map = { value: new THREE.TextureLoader().load( `textures/sprites/${markerImg}.png` ) }
        //this.uniforms.useDiffuse2Shadow = {
        //type: 'f',
        //value: 0,
        //}
        //this.uniforms.edgeColor = {
        //type: 'vec3',
        //value: new Float32Array([0.8, 0.8, 0.8])
        //}


        ////instancedGeometry = instancedGeometry.copy(circleGeometry);
        //material = new THREE.RawShaderMaterial( {
        ////vertexShader: markerVertexShader,
        //vertexShader: getMarkerImgVertexShader(fixedNodeSize, fixedColor),
        //fragmentShader: markerImgFragmentShader,
        //uniforms: this.uniforms,
        //transparent: true,
        ////blending: THREE.AdditiveBlending,
        //blending: THREE.NormalBlending,
        ////depthTest: true,
        ////depthTest: false,
        //depthWrite: true,
        //} );

        //}else{
        //let symbol = "^";

        let marker = nodesData.props.includes("marker") == false ? randomChoice(Object.values(availableMarkers)): nodesData.marker;
        marker = '3do'

        let markerGeometry = new  THREE.PlaneBufferGeometry(1, 1, 1)

        instancedGeometry = instancedGeometry.copy(markerGeometry);
        instancedGeometry.maxInstancedCount = numNodes;

        uniforms.edgeColor = {
            type: 'vec3',
            value: new THREE.Color(Config.nodes.edgeColor),
        }
        uniforms.edgeWidth = {
            type: 'f',
            value: 0.0,
        }
        material = new THREE.RawShaderMaterial( {
            vertexShader: getMarkerVertexShader(fixedNodeSize, fixedColor, nodesGroupName),
            fragmentShader: getMarkerFragmentShader(marker, nodesGroupName),
            uniforms: uniforms,
            transparent: true,
            //blending: THREE.AdditiveBlending,
            //blending: THREE.NormalBlending,
            depthTest: !this.use2d,
            //depthTest: false,
            depthWrite: true,
        } );

        if(fixedNodeSize == false)
            instancedGeometry.addAttribute(
                "bufferNodeSize",
                new THREE.InstancedBufferAttribute(new Float32Array(nodesData.size), 1, true)
            );
        if(fixedColor == false)
            instancedGeometry.addAttribute("bufferColors",
                new THREE.InstancedBufferAttribute(new Float32Array(nodesData.color.flat()), 3, false));

        instancedGeometry.addAttribute("bufferNodePositions",
            new THREE.InstancedBufferAttribute(new Float32Array(bufferNodePositions), 3, false)
        );

        nodesMesh = new THREE.Mesh(instancedGeometry, material);

        this.scene.add(nodesMesh);

        nodesObj.mesh = nodesMesh;
        nodesObj.nodesData = nodesData;
        nodesObj.uniforms = uniforms;
        nodesObj.marker = marker;
        nodesObj.fixedNodeSize = fixedNodeSize;
        nodesObj.fixedColor = fixedColor;
        nodesObj.numNodes = numNodes;

        this.nodesGroup[nodesGroupName] = nodesObj;

    }


}
