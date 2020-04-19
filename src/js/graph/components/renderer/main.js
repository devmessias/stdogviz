import * as THREE from 'three';
import alertify from 'alertifyjs';

import Config from '../../../data/config';

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
    constructor(scene, canvas, camera, appState ) {
        this.scene = scene;
        this.canvas = canvas;
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

        this.renderer.setPixelRatio(window.devicePixelRatio); // For retina


        //this.renderer.shadowMap.enabled = false;
        //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Get anisotropy for textures
        Config.maxAnisotropy = this.renderer.getMaxAnisotropy();

        // Initial size update set to canvas canvas
        this.updateSize(this.canvas.offsetWidth,this.canvas.offsetHeight);
        // Listeners
        document.addEventListener('DOMContentLoaded', () => this.updateSize(this.canvas.offsetWidth,this.canvas.offsetHeight), false);
        window.addEventListener('resize', () => this.updateSize(this.canvas.offsetWidth,this.canvas.offsetHeight), false);

        this.render = this.render.bind(this)
        this.updateSize = this.updateSize.bind(this)

        this.takeScreenshot = this.takeScreenshot.bind(this)
        const btnSave = document.getElementById("btnSaveImage");
        if(btnSave)
            btnSave.addEventListener("click",  event=>this.takeScreenshot())


    }

    setCameraAspect(widthRender, heightRender) {

        const canvas = this.canvas;
        //const widthRender = window.innerWidth
        //const heightRender = window.innerHeight
        const aspect = widthRender / heightRender
        const change = this.appState.originalAspect/aspect

        const newSize = 1 * change;
        this.camera.left = -aspect * newSize / 2;
        this.camera.right = aspect * newSize  / 2;
        this.camera.top = newSize / 2;
        this.camera.bottom = -newSize / 2;

        this.camera.aspect = widthRender / heightRender;

        this.camera.updateProjectionMatrix();
    }

    updateSize(widthRender, heightRender) { //if (this.appState.takingScreenshot) return;
        this.setCameraAspect(widthRender, heightRender)
        this.renderer.setSize(widthRender, heightRender, );
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
        this.renderer.render(this.scene, this.camera);
    }
    getURI(widthImage, heightImage, saveWithTransparency){
        this.setCameraAspect(widthImage, heightImage)
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

        const DataURI = this.canvas.toDataURL( 'image/png', 1.0 );

        if(saveWithTransparency)
            this.scene.background = color;
        this.appState.takingScreenshot = false

        this.updateSize(this.canvas.offsetWidth,this.canvas.offsetHeight);

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
