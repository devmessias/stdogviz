import * as THREE from "three";
import * as dat from 'dat.gui';
//import Config from '../../data/config';


function updateDropdown(target, list){
    let innerHTMLStr = "";
    for(var i=0; i<list.length; i++){
        var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
        innerHTMLStr += str;
    }

    if (innerHTMLStr != "") target.domElement.children[0].innerHTML = innerHTMLStr;
}

// Manages all dat.GUI interactions
export default class DatGUI {
    constructor(
        idCanvasHTML,
        scene, renderer,
        camera,
        nodes0, edges0,
        Config,
        appState) {
        const gui = new dat.GUI({autoPlace:false, name:idCanvasHTML});
        this.gui = gui

        //container.appendChild(gui.domElement);
        document.getElementById(`datGui${idCanvasHTML}`).appendChild(gui.domElement);
        const render = renderer.render;
        //canvas.appendChild(gui.domElement);
        //this.camera = main.camera.threeCamera;
        //this.controls = main.controls.threeControls;
        //this.light = main.light;

        /* Scene */
        let sceneFolder = gui.addFolder('Scene');

        sceneFolder.addColor(Config.scene, "color").name('Color').onChange((color) => {
            scene.background = new THREE.Color(color)
            render()
        });

        sceneFolder.open()
        /* Nodes */
        let nodesFolder = gui.addFolder('Nodes');
        this.comunityField = nodesFolder.add(appState, "comunityField", appState.comunityField)
            .name("Comunity")
            .onChange(function(value) {
            nodes0.setComunity(value)
        });
        nodesFolder.add( Config.nodes, 'show' ).onChange( function ( value ) {
            for (let [nodeName, node] of Object.entries(nodes0.nodes)){
                node.visible=value;
            }

            Config.nodes.show = value
            render();
        } );

        nodesFolder.addColor(Config.nodes, "color").name('Color').onChange((color) => {
            nodes0.changeColor(color)
            render()
        });
        this.sizeField = nodesFolder.add(appState, "defaultProps", appState.defaultProps)
            .name("Size Field")
            .onChange(function(value) {
            nodes0.sizeByField(value)
        });
        nodesFolder.add(Config.nodes, 'scale', 1, 10, 0.1).name('Scale').onChange((value) => {
            nodes0.changeScale(value)
            //node.material.opacity=value;
        });
        nodesFolder.addColor(Config.nodes, "edgeColor").name('Edge Color').onChange((color) => {
            nodes0.changeEdgeColor(color)
            render()
        });
        nodesFolder.add(Config.nodes, 'edgeWidth', 0.0, 1, 0.01).name('Edge Width').onChange((value) => {
            nodes0.changeEdgeWidth(value)
            render()
            //node.material.opacity=value;
        });
        nodesFolder.add(Config.nodes, 'opacity', 0, 1).name('Opacity').onChange((value) => {
            nodes0.changeOpacity(value)
            //node.material.opacity=value;
        });

        this.colorProp = nodesFolder.add(appState, "defaultProps", appState.defaultProps)
            .name("Color by Attr.")
            .onChange(function(value) {
            nodes0.colorByProp(value)
        });
        this.colorField = nodesFolder.add(appState, "defaultProps", appState.defaultProps)
            .name("Color Field")
            .onChange(function(value) {
            nodes0.colorByField(value)
        });



        nodesFolder.open()
        this.nodesFolder = nodesFolder

        /* Edges */
        let edgesFolder = gui.addFolder('Edges');
        edgesFolder.add( Config.edges, 'show' ).onChange( function ( value ) {

            Config.edges.show = value
            render();
        } );
        //edgesFolder.addColor(Config.edges, "color").name('Color')
            //.onChange((color) => {
                //edges0.changeColor(color)
        //});


        let colorEdge = {prop:[], field:[]}
        this.colorEdgeProp = edgesFolder.add(colorEdge, "prop", colorEdge.prop)
            .name("Color by Prop.")
            .onChange(function(value) {
            edges0.colorByProp(value)
        });
        this.colorEdgeField = edgesFolder.add(colorEdge, "field", colorEdge.prop)
            .name("Color by Field.")
            .onChange(function(value) {
            edges0.colorByField(value)
        });

        //nodesFolder.add(Config.nodes, 'scale', 0.01, 5).name('Scale').onChange((value) => {
            //nodes0.changeScale(value)
            ////node.material.opacity=value;
        //});
        edgesFolder.add(Config.edges, 'opacity', 0, 1).name('Opacity').onChange((value) => {
            edges0.changeOpacity(value)
            //node.material.opacity=value;
        });

        //Edges Bloom

        //edgesFolder.addColor(Config.layers[edgesBloomScene], 'clearColor' ).onChange( function ( color ) {

        //bloomPassEdges.clearColor.set(color)
        //render()
        //});

        //edgesFolder.add( Config.layers[edgesBloomScene], 'enabled' ).onChange( function ( value ) {

        //bloomPassEdges.enabled = value
        //render();
        //} );
        //edgesFolder.add( Config.layers[edgesBloomScene], 'strength', 0.0, 2 ).onChange( function ( value ) {
        ////bloomPassEdges.copyUniforms.opacity(value)
        //bloomPassEdges.strength = value
        //render();
        //} );


        //edgesFolder.add( Config.layers[edgesBloomScene], 'exposure', 0.01, 2 ).onChange( function ( value ) {
        //renderer.toneMappingExposure = Math.pow( value, 1.0 );
        //render();
        //} );

        //edgesFolder.add( Config.layers[edgesBloomScene], 'bloomThreshold', 0.0, 10 ).step(0.01).onChange( function ( value ) {
        //bloomPassEdges.threshold = Number( value )/100;
        //render();
        //} );

        //edgesFolder.add( Config.layers[edgesBloomScene], 'bloomStrength', 0.0, 2.0 ).onChange( function ( value ) {
        //bloomPassEdges.strength = Number( value );
        //render();
        //} );

        //edgesFolder.add( Config.layers[edgesBloomScene], 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
        //bloomPassEdges.radius = Number( value );
        //render();
        //} );
        edgesFolder.open()

        /* Controls */
        //const controlsFolder = gui.addFolder('Controls');
        //controlsFolder.add(Config.controls, 'autoRotate').name('Auto Rotate').onChange((value) => {
        //this.controls.autoRotate = value;
        //});
        //const controlsAutoRotateSpeedGui = controlsFolder.add(Config.controls, 'autoRotateSpeed', -1, 1).name('Rotation Speed');
        //controlsAutoRotateSpeedGui.onChange((value) => {
        //this.controls.enableRotate = false;
        //this.controls.autoRotateSpeed = value;
        //});
        //controlsAutoRotateSpeedGui.onFinishChange(() => {
        //this.controls.enableRotate = true;
        //});

        renderer.updateSize();
        /* Mesh */

    }
    updateComunityField(values){
        values.unshift('');
        updateDropdown(this.comunityField , values);
    }
    updateNodeColorProp(values){
        values.unshift('');
        values = values.filter(v=> v != 'pos')
        updateDropdown(this.colorField , values);
        updateDropdown(this.colorProp , values);
        updateDropdown(this.sizeField , values.filter(v=> v!='color'));
    }
    updateEdgeColorProp(values){
        values.unshift('');
        updateDropdown(this.colorEdgeField , values);
        updateDropdown(this.colorEdgeProp , values);
    }



}

//unreal bloom effect
//enabled: true
//needsSwap: false
//clear: false
//renderToScreen: true
//strength: 5
//radius: 0
//threshold: 0
//resolution: Vector2 {x: 1366, y: 348}
//clearColor: Color
//r: 255
//g: 255
//b: 255
//__proto__: Object
//renderTargetsHorizontal: (5) [WebGLRenderTarget, WebGLRenderTarget, WebGLRenderTarget, WebGLRenderTarget, WebGLRenderTarget]
//renderTargetsVertical: (5) [WebGLRenderTarget, WebGLRenderTarget, WebGLRenderTarget, WebGLRenderTarget, WebGLRenderTarget]
//nMips: 5
//renderTargetBright: WebGLRenderTarget {width: 683, height: 174, scissor: Vector4, scissorTest: false, viewport: Vector4, …}
//highPassUniforms: {tDiffuse: {…}, luminosityThreshold: {…}, smoothWidth: {…}, defaultColor: {…}, defaultOpacity: {…}}
//materialHighPassFilter: ShaderMaterial {uuid: "031D54E9-22F3-4F42-8C31-EF4D970724C3", name: "", type: "ShaderMaterial", fog: false, blending: 1, …}
//separableBlurMaterials: (5) [ShaderMaterial, ShaderMaterial, ShaderMaterial, ShaderMaterial, ShaderMaterial]
//compositeMaterial: ShaderMaterial {uuid: "DBA670AF-AC33-428C-BAB3-91BE67FE2901", name: "", type: "ShaderMaterial", fog: false, blending: 1, …}
//bloomTintColors: (5) [Vector3, Vector3, Vector3, Vector3, Vector3]
//copyUniforms: {tDiffuse: {…}, opacity: {…}}
//materialCopy: ShaderMaterial {uuid: "369D3C24-A73E-4576-BB78-E1261A5E6D64", name: "", type: "ShaderMaterial", fog: false, blending: 2, …}
//oldClearColor: Color {}
//oldClearAlpha: 1
