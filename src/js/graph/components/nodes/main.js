import * as THREE from "three";
import colormap from "colormap"
import alertify  from "alertifyjs"

import Config from "../../../data/config";

//import {markerVertexShader} from "./shaders/marker.vsh";
//import {markerFragmentShader} from "./shaders/marker.fsh";

import {fragmentShaderFixedColor, vertexShader, fragmentShader} from "./shaders"

const markerVertexShader = `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

attribute float bufferRadius;
attribute vec3 bufferNodePositions;
attribute vec3 bufferColors;
uniform float bufferOpacity;
uniform float bufferNodeScale;
varying vec3 vColor;
varying float vOpacity;

void main() {
    //vec3 pos = vec3(0.);
    //pos = position + bufferNodePositions;
    //pos *= bufferRadius;
    //pos *= bufferNodeScale;

    //gl_Position = projectionMatrix* modelViewMatrix * vec4(pos, 1.);

    vec4 mvPosition = modelViewMatrix * vec4( bufferNodePositions, 1.0 );
    mvPosition.xyz += position;
    gl_Position = projectionMatrix * mvPosition;



    vUv = uv;

    vColor = bufferColors;
    vOpacity = bufferOpacity;

}

`

const markerFragmentShader = `
precision highp float;

uniform sampler2D map;

varying vec2 vUv;


varying vec3 vColor;
varying float vOpacity;

vec3 HUEtoRGB(float H){
    H = mod(H,1.0);
    float R = abs(H * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(H * 6.0 - 2.0);
    float B = 2.0 - abs(H * 6.0 - 4.0);
    return clamp(vec3(R,G,B),0.0,1.0);
}

vec3 HSLtoRGB(vec3 HSL){
    vec3 RGB = HUEtoRGB(HSL.x);
    float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
    return (RGB - 0.5) * C + HSL.z;
}


void main() {

    vec3 color = vColor;
    float opacity = vOpacity;

    vec4 diffuseColor = texture2D( map, vUv );
   gl_FragColor = vec4( diffuseColor.xyz * color, opacity );
   if ( diffuseColor.w < 0.5 ) discard;

}
`
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

        what = what || 'points';
        const numNodes = Object.keys(nodesData.id).length
        this.nodesData = nodesData
        this.numNodes = numNodes

        this.deleteAllNodes()

        let bufferColors = nodesData.color.flat()

        let bufferNodePositions = nodesData.pos

        let bufferRadius = []
        for (let iNode=0; iNode<numNodes; iNode++){
            bufferRadius.push(1)
        }
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
        let nodesMesh;

        let material;
        const marker = '1'
        if (marker=="0"){
            console.info("Nodes rendering points")
            let instancedGeometry = new THREE.BufferGeometry();

            //let sprite = new THREE.TextureLoader().load( 'textures/sprites/disc.png' );
            let sprite = new THREE.TextureLoader().load( 'textures/sprites/ball.png' );

            instancedGeometry.setAttribute(
                'position', new THREE.Float32BufferAttribute( bufferNodePositions, 3 ) );


            material = new THREE.PointsMaterial( {
                size: 15, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
            material.color.setHSL( 1.0, 0.3, 0.7 );

            nodesMesh = new THREE.Points( instancedGeometry, material );

        }else{

            let instancedGeometry = new THREE.InstancedBufferGeometry();
            if (marker=='1'){
                //
                let circleGeometry = new  THREE.CircleBufferGeometry(1, 6)
                instancedGeometry.index = circleGeometry.index;
                instancedGeometry.attributes = circleGeometry.attributes;
                this.uniforms.map = { value: new THREE.TextureLoader().load( 'textures/sprites/circle.png' ) }
                //instancedGeometry = instancedGeometry.copy(circleGeometry);
                material = new THREE.RawShaderMaterial( {
                    vertexShader: markerVertexShader,
                    fragmentShader: markerFragmentShader,
                    uniforms: this.uniforms,
                    transparent: true,
                    //blending: THREE.NormalBlending,
                    depthTest: true,
                    depthWrite: true,
                } );

            }else{
                console.info('Nodes rendering dummy sphere')
                let baseGeometry = new  THREE.SphereBufferGeometry(1, 8, 8)

                instancedGeometry = instancedGeometry.copy(baseGeometry);

                instancedGeometry.maxInstancedCount = numNodes
                material = new THREE.ShaderMaterial({
                    fragmentShader,
                    vertexShader,
                    transparent: true,
                    blending: THREE.NormalBlending,
                    uniforms: this.uniforms,
                });

            }

            instancedGeometry.addAttribute(
                "bufferRadius",
                new THREE.InstancedBufferAttribute(new Float32Array(bufferRadius), 1, false)
            );
            instancedGeometry.addAttribute("bufferColors",
                new THREE.InstancedBufferAttribute(new Float32Array(bufferColors), 3, false));
            instancedGeometry.addAttribute("bufferNodePositions",
                new THREE.InstancedBufferAttribute(new Float32Array(bufferNodePositions), 3, false)
            );



            nodesMesh = new THREE.Mesh(instancedGeometry, material);

        }

        this.instancedNodes = nodesMesh;

        this.scene.add(nodesMesh);
    }


}
