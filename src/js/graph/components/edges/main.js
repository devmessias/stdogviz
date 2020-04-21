import * as THREE from "three";
import colormap from "colormap"
import alertify  from "alertifyjs"


export default class Edges {
    constructor(scene, layer, bloomLayer) {
        this.createEdges = this.createEdges.bind(this);

        this.scene = scene;
        this.layer = layer
        this.bloomLayer = bloomLayer

        this.numEdges = 0
        this.edgesData = {}
        this.instancedEdges


    }

    //deleteByNode(nodeId){
    //}
    updateNodePositions(positions){
        let positionVertices = []
        //A simple arrow function  in order to clean the code
        const f = (arr, index) => arr.push(...[0, 1, 2].map((i)=>positions[index+i]))
        for (let [s, t] of this.edgesData.nodes) {
            let id_s = s*3
            let id_t = t*3
            //positionVertices.push(
                //positions[id_s],
            //)
            f(positionVertices, id_s)
            f(positionVertices, id_t)
        }
        this.instancedEdges.geometry.attributes.position.array = new Float32Array(positionVertices);
        this.instancedEdges.geometry.attributes.position.needsUpdate = true
        this.instancedEdges.geometry.computeBoundingSphere();
    }

    colorByProp(prop){
        let colors = colormap({
            colormap: "jet",
            nshades: this.numEdges,
            format: "float",
            alpha: 1
        })
        let values = this.edgesData[prop]

        const bufferColors = colors
            .map((color, index) => [values[index], color]) // add the prop to sort by
            .sort(([val1], [val2]) => val2 - val1) // sort by the prop data
            .map(([, color]) => color)
            .map(([r, g, b, alpha])=>[r, g, b, r, g, b])
            .flat()

        if (bufferColors.length != this.numEdges*6){
            alertify.error("Invalid prop")
            alert("prop fail")
            return
        }

        this.instancedEdges.geometry.attributes.color.array = new Float32Array(bufferColors);
        this.instancedEdges.geometry.attributes.color.needsUpdate = true
        this.instancedEdges.material.needsUpdate = true;

    }
    changeOpacity(value){
        this.instancedEdges.material.opacity=value;
        //this.instancedEdges.material.blending=THREE.AdditiveBlending,c
        this.instancedEdges.material.needsUpdate = true;
    }
    ressetVerticesPos(nodesData, edgesData) {
        this.createVertices(nodesData, edgesData)
        this.updateGeometry()
    }
    updateGeometry(){
        this.edges.geometry.dispose();
        this.edges.geometry = new THREE.BufferGeometry().setFromPoints(
            Object.values(this.vertices)
        );
    }
    //deleteEdge(edgeName){
        //if (!(edgeName in this.segments)) return
        //let inName = this.segments[edgeName][1]
        //let outName = this.segments[edgeName][0]
        //delete this.segments[edgeName]
        //delete this.vertices[inName]
        //delete this.vertices[outName]
        //this.updateGeometry()
    //}
    createVertices(nodesData, edgesData, defaultProps){
        this.vertices = {}
        this.segments = {}
        var positions = [];
        var colors = [];
        let r = 800
        let color;

        const f = (arr, index) => arr.push(...[0, 1, 2].map((i)=>nodesData.pos[index*3+i]))
        for (let [s, t] of edgesData.nodes) {

            //let geometry = new THREE.Geometry();
            //  let i = 0;
            //if (i<1) return
            const nodeInId = nodesData.id[s]
            const nodeOutId = nodesData.id[t]

            //let edgeName = `${nodeInId}-to-${nodeOutId}`
            f(positions, t)
            f(positions, s)
            //let [x, y, z] = nodesData.pos[t]
            //positions.push( x, y, z );
            //[x, y, z] = nodesData.pos[s]
            //positions.push( x, y, z );

            colors.push(0);
            colors.push(0 );
            colors.push(1 );

            colors.push(0);
            colors.push(0);
            colors.push(1 );



        }
        this.positions = positions;
        this.colors = colors;
    }
    deleteAllEdges(){
        if(this.instancedEdges){
            this.instancedEdges.geometry.dispose()
            this.instancedEdges.material.dispose()
            this.instancedEdges.geometry.needsUpdate = true;
            this.instancedEdges.material.needsUpdate = true;
            this.scene.remove(this.instancedEdges)
            this.instancedEdges = null;
        }
    }

    createEdges(nodesData, edgesData) {
        this.deleteAllEdges()

        this.edgesData = edgesData
        this.numEdges = this.edgesData.nodes.length
        this.createVertices(nodesData, edgesData)
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.LineBasicMaterial( { vertexColors: true, transparent:true, opacity:0.5, linewidth:1 } );

        geometry.setAttribute( "position", new THREE.Float32BufferAttribute( this.positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( this.colors, 3 ) );

        geometry.computeBoundingSphere();

        let edges = new THREE.Line( geometry, material );
        this.instancedEdges = edges
        this.scene.add( edges );
    }
}
