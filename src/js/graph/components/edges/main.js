import * as THREE from "three";
import colormap from "colormap";
import alertify from "alertifyjs";
import { MeshLine } from "three";

export default class Edges {
  constructor(scene, layer, bloomLayer) {
    this.createEdges = this.createEdges.bind(this);

    this.scene = scene;
    this.layer = layer;
    this.bloomLayer = bloomLayer;

    this.edgesGroup = {};
    // This string is used in order to indentify the group of edges
    // selected. If the string is empty, then the changes will be applied
    // across all group of edges
    this.selectedGroupName = "";
  }
  /**
   * Set the selected group
   * @param {string} groupName - the name of the group. If the groupName thit not exist
   *  then set the selecedGroupName as a empty string
   **/
  setGroup(groupName) {
    this.selectedGroupName = Object.keys(this.edgesGroup).includes(groupName)
      ? groupName
      : "main";
  }
  /**
   * Set the selected group
   * @param {string} groupName - the name of the group. If the groupName thit not exist
   *  then set the selecedGroupName as a empty string
   * @return {array} arr - [[...[string, nodesGroupObj]]
   **/
  getGroup() {
    const allGroups = Object.entries(this.edgesGroup);
    const arr =
      this.selectedGroupName != ""
        ? [[this.selectedGroupName, this.edgesGroup[this.selectedGroupName]]]
        : allGroups;
    return arr;
  }
  //deleteByNode(nodeId){
  //}
  updateNodePositions(positions) {
    let positionVertices = [];
    //A simple arrow function  in order to clean the code
    const f = (arr, index) =>
      arr.push(...[0, 1, 2].map((i) => positions[index + i]));
    for (let [s, t] of this.edgesData.nodes) {
      let id_s = s * 3;
      let id_t = t * 3;
      //positionVertices.push(
      //positions[id_s],
      //)
      f(positionVertices, id_s);
      f(positionVertices, id_t);
    }
    this.instancedEdges.geometry.attributes.position.array = new Float32Array(
      positionVertices
    );
    this.instancedEdges.geometry.attributes.position.needsUpdate = true;
    this.instancedEdges.geometry.computeBoundingSphere();
  }
  changeColorUniform(colorHex) {
    let color = new THREE.Color(colorHex);
    for (const [edgesGroupName, edgesObj] of this.getGroup()) {
      edgesObj.mesh.material.color = color;
      //this.instancedEdges.material.blending=THREE.AdditiveBlending,c
      edgesObj.mesh.material.needsUpdate = true;
    }
  }
  changeWidth(width) {
    for (const [edgesGroupName, edgesObj] of this.getGroup()) {
      edgesObj.mesh.material.linewidth = width;
      //this.instancedEdges.material.blending=THREE.AdditiveBlending,c
      edgesObj.mesh.material.needsUpdate = true;
    }
  }
  colorByProp(prop) {
    let colors = colormap({
      colormap: "jet",
      nshades: this.numEdges,
      format: "float",
      alpha: 1,
    });
    let values = this.edgesData[prop];

    const bufferColors = colors
      .map((color, index) => [values[index], color]) // add the prop to sort by
      .sort(([val1], [val2]) => val2 - val1) // sort by the prop data
      .map(([, color]   ) => color)
      .map(([r, g, b, alpha]) => [r, g, b, r, g, b])
      .flat();

    if (bufferColors.length != this.numEdges * 6) {
      alertify.error("Invalid prop");
      alert("prop fail");
      return;
    }

    this.instancedEdges.geometry.attributes.color.array = new Float32Array(
      bufferColors
    );
    this.instancedEdges.geometry.attributes.color.needsUpdate = true;
    this.instancedEdges.material.needsUpdate = true;
  }
  changeOpacity(value) {
    for (const [edgesGroupName, edgesObj] of this.getGroup()) {
      edgesObj.mesh.material.opacity = value;
      //this.instancedEdges.material.blending=THREE.AdditiveBlending,c
      edgesObj.mesh.material.needsUpdate = true;
    }
  }
  changeBlending(value) {
    const blending = {
      None: THREE.NoBlending,
      Normal: THREE.NormalBlending,
      Additive: THREE.AdditiveBlending,
      Sub: THREE.SubtractiveBlending,
      Multiply: THREE.MultiplyBlending,
    }[value];
    for (const [edgesGroupName, edgesObj] of this.getGroup()) {
      edgesObj.mesh.material.blending = blending;

      //this.instancedEdges.material.blending=THREE.AdditiveBlending,c
      edgesObj.mesh.material.needsUpdate = true;
    }
  }
  ressetVerticesPos(nodesData, edgesData) {
    //        this.createVertices(nodesData, edgesData)
    this.updateGeometry();
  }
  updateGeometry() {
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

  deleteAllEdges() {
    for (const [key, edgesObj] of Object.entries(this.edgesGroup)) {
      this.deleteEdges(key);
    }
  }
  deleteEdges(edgesGroupName) {
    let edgesObj = this.edgesGroup[edgesGroupName];
    edgesObj.mesh.geometry.dispose();
    edgesObj.mesh.material.dispose();
    edgesObj.mesh.geometry.needsUpdate = true;
    edgesObj.mesh.needsUpdate = true;
    this.scene.remove(edgesObj.mesh);
    delete this.edgesGroup[edgesGroupName];
  }

  createEdges(nodesData, edgesData, defaultProps, edgesGroupName = "main") {
    if (this.edgesGroup.hasOwnProperty(edgesGroupName)) {
      this.deleteEdges(edgesGroupName);
    }
    //this.deleteAllEdges()
    let edgesObj = {};

    var positions = [];
    const f = (arr, index) =>
      arr.push(
        ...[0, 1, 2].map((i) => {
          let pos = nodesData.pos[index * 3 + i];
          if (i == 2) pos = pos - 0.01;
          return pos;
        })
      );
    for (let [s, t] of edgesData.nodes) {
      if (Math.random() > -1) {
        f(positions, t);
        f(positions, s);
      }
    }
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
      vertexColors: false,
      blending: THREE.AdditiveBlending,
      transparent: true,
      color: 0xfff,
      opacity: 0.4,
      linewidth: 2,
    });

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    //geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( this.colors, 3 ) );

    geometry.computeBoundingSphere();

    let edges = new THREE.Line(geometry, material);
    this.scene.add(edges);

    edgesObj.mesh = edges;
    edgesObj.edgesData = edgesData;
    //edgesObj.numedges = numedges;

    this.edgesGroup[edgesGroupName] = edgesObj;
  }
}
