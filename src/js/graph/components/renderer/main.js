import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import {BloomPass} from 'three/examples/jsm/postprocessing/BloomPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import alertify from 'alertifyjs';

import Stats from './../../helpers/stats';



/**
 * Random select a element of a given array
 * @param  {array} arr -
 * @return {Object} A random choiced element of the given array
 */
function dataURIToBlob( dataURI ) {
    const binStr = window.atob( dataURI.split( ',' )[1] );
    const len = binStr.length;
    const arr = new Uint8Array( len );
    for ( let i = 0; i < len; i++ ) {
        arr[i] = binStr.charCodeAt( i );
    }
    return new window.Blob( [arr] );
}

/**
 * Random select a element of a given array
 * @param  {array} arr -
 * @return {Object} A random choiced element of the given array
 */
function saveDataURI( name, dataURI ) {
    const blob = dataURIToBlob( dataURI );

    // force download
    const link = document.createElement( 'a' );
    link.download = name;
    link.href = window.URL.createObjectURL( blob );
    link.onclick = () => {
        window.setTimeout( () => {
            window.URL.revokeObjectURL( blob );
            link.removeAttribute( 'href' );
        }, 500 );

    };
    link.click();
}


/**
 * Random select a element of a given array
 * @param  {array} arr -
 * @return {Object} A random choiced element of the given array
 */

function defaultFileName (ext) {
    const str = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}${ext}`;
    return str.replace(/\//g, '-').replace(/:/g, '.');
}


export default class Renderer {
    constructor(
        useHighQuality,
        useBloom,
        useStats,
        scene, controls, container, canvas, camera, appState , dataPool) {
        this.scene = scene;
        this.controls = controls;
        this.canvas = canvas;
        this.container = container;
        this.camera = camera
        this.appState = appState
        this.dataPool = dataPool;

        //renderer.toneMapping = THREE.ReinhardToneMapping;
        this.useHighQuality = useHighQuality;
        this.useBloom = useBloom;
        this.useStats = useStats;
        // Create WebGL render
        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: canvas,
                antialias: useHighQuality,
                preserveDrawingBuffer: true,
                alpha:true
            }
        );
        this.renderer.autoClear = false;
        if(this.useStats) {
            this.stats = new Stats(this.renderer);
            this.stats.setUp();
        }

        this.renderer.setPixelRatio(window.devicePixelRatio); // For retina


        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        // Initial size update set to canvas canvas
        //
        if (useHighQuality || useBloom){
            this.initComposer()
        }
        if (useBloom){
            this.initBloomComposer()
        }
        if (useHighQuality){
            this.initFXAAComposer()
        }



        this.updateSize(this.canvas.offsetWidth,this.canvas.offsetHeight);
        // Listeners
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);

        //
        this.controls.addEventListener('change', ()=>this.render());

        this.render = this.render.bind(this)
        this.updateSize = this.updateSize.bind(this)

        this.takeScreenshot = this.takeScreenshot.bind(this)
        const btnSave = document.getElementById("btnSaveImage");
        if(btnSave)
            btnSave.addEventListener("click",  event=>this.takeScreenshotModal())

    }
    initComposer(){
        this.composer = new EffectComposer( this.renderer );
        let renderPass = new RenderPass( this.scene, this.camera );
        this.composer.addPass( renderPass );

    }
    initBloomComposer(){
        console.info('Init Bloom');

        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        const bloomPass = new BloomPass(
            1,    // strength
            25,   // kernel size
            4,    // sigma ?
            256,  // blur render target resolution
        );
        const strength = 1;
        const radius = 2;
        const threshold = 0;
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2( window.innerWidth, window.innerHeight ),
            strength, radius, threshold );
        this.composer.addPass(this.bloomPass);

    }
    initFXAAComposer(){
        console.info('Init FXAA');

        let fxaaPass = new ShaderPass( FXAAShader );

        const pixelRatio = this.renderer.getPixelRatio();

        fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.canvas.offsetWidth * pixelRatio );
        fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.canvas.offsetHeight * pixelRatio );
        this.fxaaPass = fxaaPass
        this.composer.addPass( fxaaPass );

    }
    setCameraAspect(widthRender, heightRender, keepPos=true) {

        const canvas = this.canvas;
        //const widthRender = window.innerWidth
        //const heightRender = window.innerHeight
        //
        if(keepPos){
            const aspect = widthRender / heightRender
            const change = this.appState.originalAspect/aspect

            const newSize = 1 * change;
            this.camera.left = -aspect * newSize / 2;
            this.camera.right = aspect * newSize  / 2;
            this.camera.top = newSize / 2;
            this.camera.bottom = -newSize / 2;
        }
        this.camera.aspect = widthRender / heightRender;

        this.camera.updateProjectionMatrix();
    }
    updateSize(widthRender, heightRender, keepPos=true) { //if (this.appState.takingScreenshot) return;
        widthRender = widthRender || this.container.clientWidth
        heightRender= heightRender ||this.container.clientHeight

        this.setCameraAspect(widthRender, heightRender, keepPos)

        if (this.useHighQuality || this.useBloom){

            this.renderer.setSize(widthRender, heightRender, );
            this.composer.setSize( widthRender, heightRender );
        }else{
            this.renderer.setSize(widthRender, heightRender, );
        }


        if (this.useHighQuality){
            const pixelRatio = this.renderer.getPixelRatio();
            this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( widthRender * pixelRatio );
            this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( heightRender * pixelRatio );
        }
        //this.appState.originalAspect  = aspect
        this.render()
        //const pixelRatio = window.devicePixelRatio;
        //const width  = widthRender  * pixelRatio | 0;
        //const height = heightRender * pixelRatio | 0;
        //const needResize = canvas.width !== width || canvas.height !== height;

        //if (needResize) {

        //this.renderer.setSize(width, height, );
        //this.camera.aspect = widthRender / heightRender;
        //this.camera.updateProjectionMatrix();
        //}
        //this.camera.aspect = window.innerWidth / window.innerHeight;
        //this.camera.updateProjectionMatrix();

        //this.renderer.setSize( window.innerWidth, window.innerHeight );

        //this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        //this.camera.updateProjectionMatrix();
        //if (resizeRendererToDisplaySize(renderer)) {
        //this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        //this. camera.updateProjectionMatrix();

        ////}
        //this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    }

    render() {
        // Renders scene to canvas target
        // this.pickHelper.pick( scene, camera, 0)

        if(this.useStats)
            Stats.start();

        //this.controls.update();
        //
        if (this.useHighQuality || this.useBloom){

            //this.renderer.render(this.scene, this.camera);
            this.composer.render();
        }else{
            this.renderer.render(this.scene, this.camera);
        }
        if(this.useStats)
            Stats.end();


    }
    delete(){
        this.render = ()=>0;
        document.removeEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.removeEventListener('resize', () => this.updateSize(), false);
        const btnSave = document.getElementById("btnSaveImage");
        if(btnSave)
            btnSave.removeEventListener("click",  event=>this.takeScreenshot())

    }
    stop(){
        //const dataURI = this.getURI(widthImage, heightImage, saveWithTransparency);
        this.delete()
    }
    getURI(widthImage, heightImage, saveWithTransparency){
        widthImage = widthImage || this.container.clientWidth
        heightImage= heightImage ||this.container.clientHeight


        this.setCameraAspect(widthImage, heightImage, false)
        // set camera and renderer to desired screenshot dimension
        //this.camera.aspect = widthImage / heightImage;
        //this.camera.updateProjectionMatrix();

        const color = this.scene.background;
        if(saveWithTransparency){
            this.renderer.setClearColor( 0x000000, 0 );
            this.scene.background = null;
        }
        this.renderer.setSize(  widthImage, heightImage );

        //this.renderer.render( this.scene, this.camera, null, false );

        this.composer.setSize( widthImage, heightImage );
        this.composer.render();

        const dataURI = this.canvas.toDataURL( 'image/png', 1.0 );

        if(saveWithTransparency)
            this.scene.background = color;
        this.appState.takingScreenshot = false

        this.updateSize();

        return dataURI
    }
    takeScreenshot(widthImage, heightImage, saveWithTransparency){
        this.appState.takingScreenshot = true
        this.appState.stopChanges = true

        const DataURI = this.getURI(widthImage, heightImage, saveWithTransparency);
        return DataURI
    }
    takeScreenshotModal(){

        $('#saveImageModal').modal("hide")
        this.appState.takingScreenshot = true
        this.appState.stopChanges = true
        const widthImage = parseInt(document.getElementById("widthSaveImage").value)
        const heightImage = parseInt(document.getElementById("heightSaveImage").value)

        const saveWithTransparency = document.getElementById("saveWithTransparency").checked

        const send2server = document.getElementById("send2server").checked;

        const DataURI = this.getURI(widthImage, heightImage, saveWithTransparency);
        if (send2server && this.dataPool){
            this.dataPool.send2server(DataURI)
        }else{
            saveDataURI(defaultFileName(".png"), DataURI);
        }
    }
}
