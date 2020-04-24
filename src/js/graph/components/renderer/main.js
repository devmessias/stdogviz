import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import alertify from 'alertifyjs';

import Config from '../../../data/config';

import Stats from './../../helpers/stats';

function dataURIToBlob( dataURI ) {
    const binStr = window.atob( dataURI.split( ',' )[1] );
    const len = binStr.length;
    const arr = new Uint8Array( len );
    for ( let i = 0; i < len; i++ ) {
        arr[i] = binStr.charCodeAt( i );
    }
    return new window.Blob( [arr] );
}

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

function defaultFileName (ext) {
    const str = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}${ext}`;
    return str.replace(/\//g, '-').replace(/:/g, '.');
}


export default class Renderer {
    constructor(scene, controls, container, canvas, camera, appState ) {
        this.scene = scene;
        this.controls = controls;
        this.canvas = canvas;
        this.container = container;
        this.camera = camera
        this.appState = appState

        //renderer.toneMapping = THREE.ReinhardToneMapping;

        // Create WebGL render
        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: canvas,
                antialias: Config.render.antialias,
                preserveDrawingBuffer: true,
                alpha:true
            }
        );
	    this.renderer.autoClear = false;
        if(Config.useStats) {
            this.stats = new Stats(this.renderer);
            this.stats.setUp();
        }


        this.renderer.setPixelRatio(window.devicePixelRatio); // For retina


        //this.renderer.shadowMap.enabled = false;
        //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Get anisotropy for textures
        Config.maxAnisotropy = this.renderer.getMaxAnisotropy();

        // Initial size update set to canvas canvas
        //

        let fxaaPass = new ShaderPass( FXAAShader );

        var pixelRatio = this.renderer.getPixelRatio();

        var renderPass = new RenderPass( scene, camera );
        fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.canvas.offsetWidth * pixelRatio );
        fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.canvas.offsetHeight * pixelRatio );
        //fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / 1000000;
        //fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / 1000000;

        this.fxaaPass = fxaaPass

        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( renderPass );
        this.composer.addPass( fxaaPass );

        //


        this.updateSize(this.canvas.offsetWidth,this.canvas.offsetHeight);
        // Listeners
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);

        this.controls.addEventListener('change', ()=>this.render());
        this.render = this.render.bind(this)
        this.updateSize = this.updateSize.bind(this)

        this.takeScreenshot = this.takeScreenshot.bind(this)
        const btnSave = document.getElementById("btnSaveImage");
        if(btnSave)
            btnSave.addEventListener("click",  event=>this.takeScreenshot())


        var renderPass = new RenderPass( scene, camera );


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
        this.renderer.setSize(widthRender, heightRender, );

        this.composer.setSize( widthRender, heightRender );

        var pixelRatio = this.renderer.getPixelRatio();

        this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( widthRender * pixelRatio );
        this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( heightRender * pixelRatio );
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

        if(Config.useStats)
            Stats.start();

        //this.controls.update();
        //this.renderer.render(this.scene, this.camera);
        this.composer.render();
        if(Config.useStats)
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

        this.renderer.render( this.scene, this.camera, null, false );

        const dataURI = this.canvas.toDataURL( 'image/png', 1.0 );

        if(saveWithTransparency)
            this.scene.background = color;
        this.appState.takingScreenshot = false

        this.updateSize();

        return dataURI
    }
    takeScreenshot(){

        $('#saveImageModal').modal("hide")
        this.appState.takingScreenshot = true
        this.appState.stopChanges = true
        const widthImage = parseInt(document.getElementById("widthSaveImage").value)
        const heightImage = parseInt(document.getElementById("heightSaveImage").value)

        const saveWithTransparency = document.getElementById("saveWithTransparency").checked


        const DataURI = this.getURI(widthImage, heightImage, saveWithTransparency);
        saveDataURI(defaultFileName( '.png' ), DataURI);



    }
}
