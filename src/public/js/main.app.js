(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _graph_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph/main */ "./src/js/graph/main.js");
/* harmony import */ var _data_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data/config */ "./src/js/data/config.js");
/* harmony import */ var _connections_dataPool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connections/dataPool */ "./src/js/connections/dataPool.js");




if (true) {
  console.info('----- RUNNING IN DEV ENVIRONMENT! -----');
  _data_config__WEBPACK_IMPORTED_MODULE_1__["default"].isDev = true;
}

function keyboardPressFunction(key, action) {
  switch (action) {
    case "deleteNode":
      //let pickedObjectsNames = cameraObj.pickedObjects;
      //if (pickedObjectsNames.length>0) {
      //cameraObj.deleteHelpers();
      //Config.vimMode = "Visual"
      //dataPoolSocket.deleteNodes(pickedObjectsNames);
      //pickedObjectsNames.map(nodeId=>nodes0.deleteNode(nodeId));
      ////pickedObjectsNames.map(=>edges0.deleteByNode(nodeId));
      //cameraObj.unpick();
      //}
      //render()
      break;

    case "move":
      //let p = 0.1
      //let dr = {
      //"l" :[p, 0, 0],
      //"j" :[-p, 0 ,0],
      //"i": [0, p, 0],
      //"k": [0, -p, 0]
      //}[key.toLowerCase()]
      //let pWorld =  new THREE.Vector3( dr[0], dr[1], -1 ).unproject( camera );
      //nodes0.moveNodes({}, cameraObj.pickedObjects, dr)
      //render()
      break;

    case "recalcPos":
      dataPoolSocket.recalcPos();
      break;

    case "reloadGraph":
      dataPoolSocket.reloadGraph();
      break;

    default:
      break;
  }
}

function listenerFunction(event) {
  var message = JSON.parse(event.data);

  switch (message["type"]) {
    case "getGraph":
      clearInterval(intervalGetGraph); //graphObj.state.defaultProps = message.defaultProps
      //

      console.group('getGraph');
      console.time('creatingEdges');
      console.group('createEdges');
      graphObj.edges.createEdges(message.nodes, message.edges, message.defaultProps);
      console.groupEnd();
      console.timeEnd('creatingEdges');
      console.group('createNodes');
      console.time('creatingNodes');
      graphObj.nodes.createNodes(message.nodes, true);
      console.timeEnd('creatingNodes');
      console.groupEnd();

      if (graphObj.state.firstLoad) {
        graphObj.firstLoad = false;
        graphObj.ressetLook();
        clearInterval(intervalGetGraph);
      }

      graphObj.nodes.stopUpdate(); //let nodes = JSON.parse(JSON.stringify(message.nodes))
      //nodes.pos = nodes.pos.map((p)=>p*0.3);
      //graphObj.nodes.createNodes(nodes, false);
      //
      //camera.position.set(0, nodes0.max_vals[2] * (1 + 2), 0);

      graphObj.datGui.updateNodeColorProp(message.nodes.props);
      graphObj.datGui.updateComunityField(Object.keys(graphObj.nodes.nodesGroup)); //datGui.updateEdgeColorProp(message.edges.props)
      //camera.lookAt(nodes0.instancedNodes);

      console.groupEnd();
      break;

    case "addNodes":
      graphObj.nodes.createNodes(message.nodes, false);

      if (graphObj.state.firstLoad) {
        graphObj.firstLoad = false;
        graphObj.ressetLook();
        clearInterval(intervalGetGraph);
      }

      break;

    case "deleteNodes":
      //message.info.nodesId.map(nodeId=>nodes0.deleteNode(nodeId));
      //message.info.edgesName.map(edgeName=>edges0.deleteEdge(edgeName));
      ////dataPoolSocket.recalcPos();
      ////
      //render()
      break;

    case "updatePos":
      graphObj.nodes.updateNodePositions(message.info.pos);
      graphObj.edges.updateNodePositions(message.info.pos);
      graphObj.renderer.render();
      break;

    default:
      break;
  }
}

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
console.info(queryString);
var useHighQuality = urlParams.has('highQuality') ? urlParams.get('highQuality') == '1' : true;
var useBloom = urlParams.has('bloom') ? urlParams.get('bloom') == '1' : true;
_data_config__WEBPACK_IMPORTED_MODULE_1__["default"].useGuiControl = true;
var graphObj = new _graph_main__WEBPACK_IMPORTED_MODULE_0__["default"]("graphCanvas", _data_config__WEBPACK_IMPORTED_MODULE_1__["default"], keyboardPressFunction, false, useHighQuality, useBloom);
window.graphObjVar = graphObj;
graphObj.init();
console.group('Socket Conection');
var address = urlParams.has('address') ? urlParams.has('address') : 'localhost:6688';
console.info('Address:', address);
var dataPoolSocket = new _connections_dataPool__WEBPACK_IMPORTED_MODULE_2__["default"](address, listenerFunction);
var intervalGetGraph = setInterval(function () {
  dataPoolSocket.getGraph();
}, 1000);
console.groupEnd();

/***/ }),

/***/ "./src/js/connections/dataPool.js":
/*!****************************************!*\
  !*** ./src/js/connections/dataPool.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DataPool; });
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alertifyjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _data_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/config */ "./src/js/data/config.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var DataPool = /*#__PURE__*/function () {
  function DataPool(address, listenerFunction) {
    _classCallCheck(this, DataPool);

    this.address = address;
    this.ws = new WebSocket("ws://".concat(address, "/"));

    this.ws.onopen = function (event) {
      alertifyjs__WEBPACK_IMPORTED_MODULE_0___default.a.success("opened connection");
    }.bind(this);

    this.ws.onclose = function () {
      return alertifyjs__WEBPACK_IMPORTED_MODULE_0___default.a.warning("closed connection");
    };

    this.ws.onerror = function () {
      return alertifyjs__WEBPACK_IMPORTED_MODULE_0___default.a.error("error connection");
    };

    this.ws.addEventListener("message", listenerFunction);
    this.getGraph = this.getGraph.bind(this);
  }

  _createClass(DataPool, [{
    key: "isOpen",
    value: function isOpen() {
      var open = this.ws.readyState === this.ws.OPEN;

      if (!open) {
        alertifyjs__WEBPACK_IMPORTED_MODULE_0___default.a.error("Connection Closed");
        console.error("Conection closed");
        this.ws = new WebSocket("ws://".concat(_data_config__WEBPACK_IMPORTED_MODULE_1__["default"].address, "/"));
      }

      return open;
    }
  }, {
    key: "getGraph",
    value: function getGraph() {
      if (!this.isOpen()) return;
      var message = {
        type: "getGraph"
      };
      this.ws.send(JSON.stringify(message));
    }
  }, {
    key: "deleteNodes",
    value: function deleteNodes(nodesId) {
      console.info("deleteNodes", nodesId);
      if (!this.isOpen()) return;
      var message = {
        type: "deleteNodes",
        info: {
          "nodesId": nodesId
        }
      };
      this.ws.send(JSON.stringify(message));
    }
  }, {
    key: "reloadGraph",
    value: function reloadGraph() {
      console.info("reload Graph");
      if (!this.isOpen()) return;
      var message = {
        type: "reloadGraph"
      };
      this.ws.send(JSON.stringify(message)); //window.location.reload()
    }
  }, {
    key: "recalcPos",
    value: function recalcPos() {
      console.info("recalc pos");
      if (!this.isOpen()) return;
      var message = {
        type: "recalcPos"
      };
      this.ws.send(JSON.stringify(message));
    }
  }]);

  return DataPool;
}();



/***/ }),

/***/ "./src/js/data/config.js":
/*!*******************************!*\
  !*** ./src/js/data/config.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  address: "127.0.0.1:6688",
  scene: {
    color: 0x000 //color: 0xffffff

  },
  isDev: true,
  render: {
    antialias: true
  },
  isShowingStats: true,
  useStats: true,
  useGuiControl: false,
  useKeyboard: true,
  isLoaded: false,
  isMouseMoving: false,
  isMouseOver: false,
  maxAnisotropy: 2,
  bloomPass: {
    exposure: 1,
    strength: 0.5,
    threshold: 0,
    radius: 0
  },
  dpr: 1,
  layers: {
    0: {},
    1: {
      enabled: true,
      clearColor: 0x000000,
      exposure: 1,
      strength: 0.5,
      bloomStrength: 5,
      bloomThreshold: 0,
      bloomRadius: 0
    },
    2: {},
    3: {
      enabled: false,
      exposure: 1,
      clearColor: 0x000000,
      strength: 0.5,
      bloomStrength: 5,
      bloomThreshold: 0,
      bloomRadius: 0,
      scene: "Scene with Glow"
    }
  },
  nodes: {
    material: "fast",
    scale: 1,
    show: true,
    radius: .5,
    color: 0x0000ff,
    edgeColor: 0x0000ff,
    edgeWidth: 0.1,
    roughness: 0.5,
    opacity: 1
  },
  edges: {
    show: true,
    color: 0xff,
    //color: 0x0000ff,
    roughness: 0.5,
    opacity: 1
  },
  fog: {
    color: 0xffffff,
    near: 0.0008
  },
  camera: {
    fov: 40,
    near: 2,
    far: 1000,
    aspect: 1,
    posX: 0,
    posY: 30,
    posZ: 40
  },
  controls: {
    autoRotate: false,
    autoRotateSpeed: -0.5,
    rotateSpeed: 0.5,
    zoomSpeed: 0.8,
    minDistance: 0,
    maxDistance: 600,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    enableDamping: true,
    dampingFactor: 0.5,
    enableZoom: true,
    target: {
      x: 0,
      y: 0,
      z: 0
    }
  }
});

/***/ }),

/***/ "./src/js/graph/components/edges/main.js":
/*!***********************************************!*\
  !*** ./src/js/graph/components/edges/main.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Edges; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var colormap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! colormap */ "./node_modules/colormap/index.js");
/* harmony import */ var colormap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(colormap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(alertifyjs__WEBPACK_IMPORTED_MODULE_2__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var Edges = /*#__PURE__*/function () {
  function Edges(scene, layer, bloomLayer) {
    _classCallCheck(this, Edges);

    this.createEdges = this.createEdges.bind(this);
    this.scene = scene;
    this.layer = layer;
    this.bloomLayer = bloomLayer;
    this.numEdges = 0;
    this.edgesData = {};
    this.instancedEdges;
  } //deleteByNode(nodeId){
  //}


  _createClass(Edges, [{
    key: "updateNodePositions",
    value: function updateNodePositions(positions) {
      var positionVertices = []; //A simple arrow function  in order to clean the code

      var f = function f(arr, index) {
        return arr.push.apply(arr, _toConsumableArray([0, 1, 2].map(function (i) {
          return positions[index + i];
        })));
      };

      var _iterator = _createForOfIteratorHelper(this.edgesData.nodes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              s = _step$value[0],
              t = _step$value[1];

          var id_s = s * 3;
          var id_t = t * 3; //positionVertices.push(
          //positions[id_s],
          //)

          f(positionVertices, id_s);
          f(positionVertices, id_t);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.instancedEdges.geometry.attributes.position.array = new Float32Array(positionVertices);
      this.instancedEdges.geometry.attributes.position.needsUpdate = true;
      this.instancedEdges.geometry.computeBoundingSphere();
    }
  }, {
    key: "colorByProp",
    value: function colorByProp(prop) {
      var colors = colormap__WEBPACK_IMPORTED_MODULE_1___default()({
        colormap: "jet",
        nshades: this.numEdges,
        format: "float",
        alpha: 1
      });
      var values = this.edgesData[prop];
      var bufferColors = colors.map(function (color, index) {
        return [values[index], color];
      }) // add the prop to sort by
      .sort(function (_ref, _ref2) {
        var _ref3 = _slicedToArray(_ref, 1),
            val1 = _ref3[0];

        var _ref4 = _slicedToArray(_ref2, 1),
            val2 = _ref4[0];

        return val2 - val1;
      }) // sort by the prop data
      .map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            color = _ref6[1];

        return color;
      }).map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 4),
            r = _ref8[0],
            g = _ref8[1],
            b = _ref8[2],
            alpha = _ref8[3];

        return [r, g, b, r, g, b];
      }).flat();

      if (bufferColors.length != this.numEdges * 6) {
        alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.error("Invalid prop");
        alert("prop fail");
        return;
      }

      this.instancedEdges.geometry.attributes.color.array = new Float32Array(bufferColors);
      this.instancedEdges.geometry.attributes.color.needsUpdate = true;
      this.instancedEdges.material.needsUpdate = true;
    }
  }, {
    key: "changeOpacity",
    value: function changeOpacity(value) {
      this.instancedEdges.material.opacity = value; //this.instancedEdges.material.blending=THREE.AdditiveBlending,c

      this.instancedEdges.material.needsUpdate = true;
    }
  }, {
    key: "ressetVerticesPos",
    value: function ressetVerticesPos(nodesData, edgesData) {
      this.createVertices(nodesData, edgesData);
      this.updateGeometry();
    }
  }, {
    key: "updateGeometry",
    value: function updateGeometry() {
      this.edges.geometry.dispose();
      this.edges.geometry = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]().setFromPoints(Object.values(this.vertices));
    } //deleteEdge(edgeName){
    //if (!(edgeName in this.segments)) return
    //let inName = this.segments[edgeName][1]
    //let outName = this.segments[edgeName][0]
    //delete this.segments[edgeName]
    //delete this.vertices[inName]
    //delete this.vertices[outName]
    //this.updateGeometry()
    //}

  }, {
    key: "createVertices",
    value: function createVertices(nodesData, edgesData, defaultProps) {
      this.vertices = {};
      this.segments = {};
      var positions = [];
      var colors = [];
      var r = 800;
      var color;

      var f = function f(arr, index) {
        return arr.push.apply(arr, _toConsumableArray([0, 1, 2].map(function (i) {
          var pos = nodesData.pos[index * 3 + i];
          if (i == 2) pos = pos - 0.01;
          return pos;
        })));
      };

      var _iterator2 = _createForOfIteratorHelper(edgesData.nodes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              s = _step2$value[0],
              t = _step2$value[1];

          //let geometry = new THREE.Geometry();
          //  let i = 0;
          //if (i<1) return
          //
          var nodeInId = nodesData.id[s];
          var nodeOutId = nodesData.id[t];

          if (Math.random() > -1) {
            //let edgeName = `${nodeInId}-to-${nodeOutId}`
            //
            f(positions, t);
            f(positions, s); //let [x, y, z] = nodesData.pos[t]
            //positions.push( x, y, z );
            //[x, y, z] = nodesData.pos[s]
            //positions.push( x, y, z );
            //colors.push(...nodesData.color[t])
            //colors.push(...nodesData.color[s])

            colors.push.apply(colors, [1, 1, 1, 1, 1, 1]); //colors.push(0.8);
            //colors.push(0.8);
            //colors.push(0.8);
            //colors.push(0.8);
            //colors.push(0.8);
            //colors.push(0.8);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.positions = positions;
      this.colors = colors;
    }
  }, {
    key: "deleteAllEdges",
    value: function deleteAllEdges() {
      if (this.instancedEdges) {
        this.instancedEdges.geometry.dispose();
        this.instancedEdges.material.dispose();
        this.instancedEdges.geometry.needsUpdate = true;
        this.instancedEdges.material.needsUpdate = true;
        this.scene.remove(this.instancedEdges);
        this.instancedEdges = null;
      }
    }
  }, {
    key: "createEdges",
    value: function createEdges(nodesData, edgesData) {
      this.deleteAllEdges();
      this.edgesData = edgesData;
      this.numEdges = this.edgesData.nodes.length;
      this.createVertices(nodesData, edgesData);
      var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]();
      var material = new three__WEBPACK_IMPORTED_MODULE_0__["LineBasicMaterial"]({
        vertexColors: true,
        //blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.4,
        linewidth: 1
      });
      geometry.setAttribute("position", new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](this.positions, 3));
      geometry.setAttribute('color', new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](this.colors, 3));
      geometry.computeBoundingSphere();
      var edges = new three__WEBPACK_IMPORTED_MODULE_0__["Line"](geometry, material);
      this.instancedEdges = edges;
      this.scene.add(edges);
    }
  }]);

  return Edges;
}();



/***/ }),

/***/ "./src/js/graph/components/nodes/main.js":
/*!***********************************************!*\
  !*** ./src/js/graph/components/nodes/main.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Nodes; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var colormap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! colormap */ "./node_modules/colormap/index.js");
/* harmony import */ var colormap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(colormap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(alertifyjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _data_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../data/config */ "./src/js/data/config.js");
/* harmony import */ var _shaders_markerImg_vsh_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shaders/markerImg.vsh.js */ "./src/js/graph/components/nodes/shaders/markerImg.vsh.js");
/* harmony import */ var _shaders_markerImg_fsh_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shaders/markerImg.fsh.js */ "./src/js/graph/components/nodes/shaders/markerImg.fsh.js");
/* harmony import */ var _shaders_marker_vsh_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shaders/marker.vsh.js */ "./src/js/graph/components/nodes/shaders/marker.vsh.js");
/* harmony import */ var _shaders_marker_fsh_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shaders/marker.fsh.js */ "./src/js/graph/components/nodes/shaders/marker.fsh.js");
/* harmony import */ var _helpers_tools__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../helpers/tools */ "./src/js/graph/helpers/tools.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }










/**
 * Class representing the Nodes of the Graph
 * */

var Nodes = /*#__PURE__*/function () {
  /**
   * Create a empty nodes object
   * @param {object} scene - THREE.scene
   * @param {bool} use2d - If the nodes should be ploted in 2d
   */
  function Nodes(scene, use2d) {
    _classCallCheck(this, Nodes);

    this.scene = scene;
    this.use2d = use2d;
    this.nodesGroup = {}; // This string is used in order to indentify the group of nodes
    // selected. If the string is empty, then the changes will be applied
    // across all group of nodes

    this.selectedGroupName = '';
  }
  /**
   * Set the selected group
   * @param {string} groupName - the name of the group. If the groupName thit not exist
   *  then set the selecedGroupName as a empty string
   **/


  _createClass(Nodes, [{
    key: "setGroup",
    value: function setGroup(groupName) {
      this.selectedGroupName = Object.keys(this.nodesGroup).includes(value) ? value : '';
    }
    /**
     * Set the selected group
     * @param {string} groupName - the name of the group. If the groupName thit not exist
     *  then set the selecedGroupName as a empty string
     * @return {array} arr - [[...[string, nodesGroupObj]]
     **/

  }, {
    key: "getGroup",
    value: function getGroup() {
      var allGroups = Object.entries(this.nodesGroup);
      var arr = this.selectedGroupName != '' ? [[this.selectedGroupName, this.nodesGroup[this.selectedGroupName]]] : allGroups;
      return arr;
    }
    /**
     * Set the selected group
     * @param {string} groupName - the name of the group. If the groupName thit not exist
     *  then set the selecedGroupName as a empty string
     **/

  }, {
    key: "colorByField",
    value: function colorByField(prop) {
      var _iterator = _createForOfIteratorHelper(this.getGroup()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              nodesGroupName = _step$value[0],
              nodesObj = _step$value[1];

          var bufferColors = nodesObj.nodesData[prop].flat();

          if (bufferColors.length != nodesObj.numNodes * 3) {
            alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.error(" ".concat(prop, " it's not in RGB format "));
            return;
          } else {
            this.updateColors(bufferColors, nodesGroupName);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "updateColors",
    value: function updateColors(colors, nodesGroupName) {
      var nodesObj = this.nodesGroup[nodesGroupName];

      if (nodesObj.fixedColor) {
        var fixedColor = false;
        nodesObj.mesh.material.vertexShader = Object(_shaders_marker_vsh_js__WEBPACK_IMPORTED_MODULE_6__["getMarkerVertexShader"])(nodesObj.fixedNodeSize, fixedColor, nodesGroupName);
        nodesObj.mesh.geometry.addAttribute("bufferColors", new three__WEBPACK_IMPORTED_MODULE_0__["InstancedBufferAttribute"](new Float32Array(colors), 3, false));
        nodesObj.fixedColor = fixedColor;
        delete nodesObj.uniforms.bufferColors;
        nodesObj.mesh.geometry.needsUpdate = true;
      } else {
        nodesObj.mesh.geometry.attributes.bufferColors.array = new Float32Array(colors);
        nodesObj.mesh.geometry.attributes.bufferColors.needsUpdate = true;
      }

      nodesObj.mesh.material.needsUpdate = true;
    }
  }, {
    key: "colorByProp",
    value: function colorByProp(prop) {
      var _this = this;

      var _iterator2 = _createForOfIteratorHelper(this.getGroup()),
          _step2;

      try {
        var _loop = function _loop() {
          var _step2$value = _slicedToArray(_step2.value, 2),
              nodesGroupName = _step2$value[0],
              nodesObj = _step2$value[1];

          var colors = colormap__WEBPACK_IMPORTED_MODULE_1___default()({
            colormap: "jet",
            nshades: nodesObj.numNodes,
            format: "float",
            alpha: 1
          });
          var values = nodesObj.nodesData[prop];
          var bufferColors = colors.map(function (color, index) {
            return [values[String(index)], color];
          }) // add the prop to sort by
          .sort(function (_ref, _ref2) {
            var _ref3 = _slicedToArray(_ref, 1),
                val1 = _ref3[0];

            var _ref4 = _slicedToArray(_ref2, 1),
                val2 = _ref4[0];

            return val2 - val1;
          }) // sort by the prop data
          .map(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
                color = _ref6[1];

            return color;
          }).map(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 4),
                r = _ref8[0],
                g = _ref8[1],
                b = _ref8[2],
                alpha = _ref8[3];

            return [r, g, b];
          }).flat();

          _this.updateColors(bufferColors, nodesGroupName);
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "updateColor",
    value: function updateColor(color, nodesGroupName) {
      var nodesObj = this.nodesGroup[nodesGroupName];

      if (nodesObj.fixedColor) {
        nodesObj.uniforms.bufferColors.value = color; //nodesObj.mesh.geometry.needsUpdate = true;
      } else {
        var fixedColor = true;
        nodesObj.uniforms.bufferColors = {
          type: 'vec3',
          value: color
        };
        nodesObj.mesh.geometry.deleteAttribute('bufferColors');
        nodesObj.mesh.material.vertexShader = Object(_shaders_marker_vsh_js__WEBPACK_IMPORTED_MODULE_6__["getMarkerVertexShader"])(nodesObj.fixedNodeSize, fixedColor, nodesGroupName);
        nodesObj.fixedColor = true;
        nodesObj.mesh.geometry.needsUpdate = true;
        nodesObj.fixedColor = true;
      }

      nodesObj.mesh.material.needsUpdate = true;
    }
  }, {
    key: "updateMarker",
    value: function updateMarker(marker, nodesGroupName) {
      var nodesObj = this.nodesGroup[nodesGroupName];
      nodesObj.mesh.material.vertexShader = Object(_shaders_marker_vsh_js__WEBPACK_IMPORTED_MODULE_6__["getMarkerVertexShader"])(nodesObj.fixedNodeSize, nodesObj.fixedColor, nodesGroupName);
      nodesObj.mesh.material.fragmentShader = Object(_shaders_marker_fsh_js__WEBPACK_IMPORTED_MODULE_7__["getMarkerFragmentShader"])(marker, nodesGroupName);
      nodesObj.mesh.material.needsUpdate = true;
    }
  }, {
    key: "changeMarker",
    value: function changeMarker(marker) {
      var _iterator3 = _createForOfIteratorHelper(this.getGroup()),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              nodesGroupName = _step3$value[0],
              nodesObj = _step3$value[1];

          this.updateMarker(marker, nodesGroupName);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "stopUpdate",
    value: function stopUpdate() {
      var _iterator4 = _createForOfIteratorHelper(this.getGroup()),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _step4$value = _slicedToArray(_step4.value, 2),
              nodesGroupName = _step4$value[0],
              nodesObj = _step4$value[1];

          nodesObj.mesh.geometry.needsUpdate = false;
          nodesObj.mesh.material.needsUpdate = false;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "changeColor",
    value: function changeColor(colorHEX) {
      var _iterator5 = _createForOfIteratorHelper(this.getGroup()),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _step5$value = _slicedToArray(_step5.value, 2),
              nodesGroupName = _step5$value[0],
              nodesObj = _step5$value[1];

          var _color = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](colorHEX);

          this.updateColor(_color, nodesGroupName);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    } //size gui interaction

  }, {
    key: "sizeByField",
    value: function sizeByField(prop) {
      var _iterator6 = _createForOfIteratorHelper(this.getGroup()),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _step6$value = _slicedToArray(_step6.value, 2),
              nodesGroupName = _step6$value[0],
              nodesObj = _step6$value[1];

          var bufferNodeSize = nodesObj.nodesData[prop].flat();

          if (bufferNodeSize.length != nodesObj.numNodes) {
            alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.error(" ".concat(prop, " it's not in a valid format "));
            return;
          } else {
            this.updateSizes(bufferNodeSize, nodesGroupName);
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "updateSizes",
    value: function updateSizes(sizes, nodesGroupName) {
      var nodesObj = this.nodesGroup[nodesGroupName];
      var sMin = Math.min.apply(Math, _toConsumableArray(sizes));
      var sMax = Math.max.apply(Math, _toConsumableArray(sizes));
      sizes = sizes.map(function (s) {
        return (s - sMin) / (sMax - sMin);
      });

      if (nodesObj.fixedNodeSize) {
        var fixedNodeSize = false;
        nodesObj.mesh.material.vertexShader = Object(_shaders_marker_vsh_js__WEBPACK_IMPORTED_MODULE_6__["getMarkerVertexShader"])(fixedNodeSize, nodesObj.fixedColor, nodesGroupName);
        var sizesBuffer = new three__WEBPACK_IMPORTED_MODULE_0__["InstancedBufferAttribute"](new Float32Array(sizes), 1, true);
        nodesObj.mesh.geometry.addAttribute("bufferNodeSize", sizesBuffer);
        nodesObj.fixedNodeSize = fixedNodeSize;
        delete nodesObj.uniforms.bufferNodeSizes;
        nodesObj.mesh.geometry.needsUpdate = true;
      } else {
        nodesObj.mesh.geometry.attributes.bufferNodeSizes.array = new Float32Array(sizes);
        nodesObj.mesh.geometry.attributes.bufferNodeSizes.needsUpdate = true;
      }

      nodesObj.mesh.material.needsUpdate = true;
    }
  }, {
    key: "updateSize",
    value: function updateSize(size, nodesGroupName) {
      var nodesObj = this.nodesGroup[nodesGroupName];

      if (nodesObj.fixedNodeSize) {
        nodesObj.uniforms.bufferNodeSizes.value = color; //nodesObj.mesh.geometry.needsUpdate = true;
      } else {
        var fixedNodeSize = true;
        nodesObj.uniforms.bufferNodeSizes = {
          type: 'vec3',
          value: color
        };
        nodesObj.mesh.geometry.deleteAttribute('bufferNodeSizes');
        nodesObj.mesh.material.vertexShader = Object(_shaders_marker_vsh_js__WEBPACK_IMPORTED_MODULE_6__["getMarkerVertexShader"])(nodesObj.fixedNodeSize, fixedNodeSize, nodesGroupName);
        nodesObj.fixedNodeSize = true;
        nodesObj.mesh.geometry.needsUpdate = true;
        nodesObj.fixedNodeSize = true;
      }

      nodesObj.mesh.material.needsUpdate = true;
    } // end size gui itneraction

  }, {
    key: "changeRadius",
    value: function changeRadius(value) {
      this.instancedNodes.geometry.attributes.bufferRadius = value;
      this.instancedNodes.material.needsUpdate = true;
    }
  }, {
    key: "changeEdgeColor",
    value: function changeEdgeColor(color) {
      var _iterator7 = _createForOfIteratorHelper(this.getGroup()),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _step7$value = _slicedToArray(_step7.value, 2),
              nodesGroupName = _step7$value[0],
              nodesObj = _step7$value[1];

          //for (let nodesObj of this.nodesGroup){
          nodesObj.uniforms.edgeColor.value = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](color);
          nodesObj.mesh.geometry.needsUpdate = true;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "changeEdgeWidth",
    value: function changeEdgeWidth(value) {
      var _iterator8 = _createForOfIteratorHelper(this.getGroup()),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var _step8$value = _slicedToArray(_step8.value, 2),
              nodesGroupName = _step8$value[0],
              nodesObj = _step8$value[1];

          //for (let nodesObj of this.nodesGroup){
          nodesObj.uniforms.edgeWidth.value = value;
          nodesObj.mesh.geometry.needsUpdate = true;
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "changeOpacity",
    value: function changeOpacity(value) {
      var _iterator9 = _createForOfIteratorHelper(this.getGroup()),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var _step9$value = _slicedToArray(_step9.value, 2),
              nodesGroupName = _step9$value[0],
              nodesObj = _step9$value[1];

          //for (let nodesObj of this.nodesGroup){
          nodesObj.uniforms.bufferOpacity.value = value;
          nodesObj.mesh.geometry.needsUpdate = true;
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
  }, {
    key: "changeScale",
    value: function changeScale(value) {
      var _iterator10 = _createForOfIteratorHelper(this.getGroup()),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _step10$value = _slicedToArray(_step10.value, 2),
              nodesGroupName = _step10$value[0],
              nodesObj = _step10$value[1];

          //for (let nodesObj of this.nodesGroup){
          nodesObj.uniforms.bufferNodeScale.value = value;
          nodesObj.mesh.geometry.needsUpdate = true;
          nodesObj.mesh.material.needsUpdate = true;
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
  }, {
    key: "updateNodePositions",
    value: function updateNodePositions(positions) {
      this.instancedNodes.geometry.attributes.bufferNodePositions.array = new Float32Array(positions);
      this.instancedNodes.geometry.attributes.bufferNodePositions.needsUpdate = true;
    }
  }, {
    key: "deleteAllNodes",
    value: function deleteAllNodes() {
      for (var _i2 = 0, _Object$entries = Object.entries(this.nodesGroup); _i2 < _Object$entries.length; _i2++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            key = _Object$entries$_i[0],
            nodesObj = _Object$entries$_i[1];

        nodesObj.mesh.geometry.dispose();
        nodesObj.mesh.material.dispose();
        nodesObj.mesh.geometry.needsUpdate = true;
        nodesObj.mesh.material.needsUpdate = true;
        this.scene.remove(nodesObj.mesh);
        delete this.nodesGroup[key];
      }
    }
  }, {
    key: "createNodes",
    value: function createNodes(nodesData) {
      var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var nodesGroupName;

      if (clear) {
        nodesGroupName = 'main';
      } else {
        nodesGroupName = nodesData.props.includes('name') ? nodesData.name : Object(_helpers_tools__WEBPACK_IMPORTED_MODULE_8__["randomString"])();
      }

      console.info("Creating nodes", nodesGroupName);
      var what = 2;
      what = what || 'points';
      var nodesObj = {};
      var numNodes = Object.keys(nodesData.id).length;
      var fixedNodeSize = nodesData.props.includes("size") == false;
      var fixedColor = nodesData.props.includes("color") == false; //if (clear) this.deleteAllNodes();

      var bufferNodePositions = nodesData.pos;
      var uniforms = {
        bufferOpacity: {
          type: 'f',
          // a float
          value: 1
        },
        bufferNodeScale: {
          type: 'f',
          value: 1
        }
      };
      var bufferNodeSize;

      if (fixedNodeSize) {
        console.info("Fixed Node Size");
        uniforms.bufferNodeSize = {
          type: 'f',
          value: 1
        };
      }

      if (fixedColor) {
        console.info("Fixed Color");
        uniforms.bufferColors = {
          type: 'vec3',
          value: new Float32Array([0.8, 0.0, 0.8])
        };
      }

      var nodesMesh;
      var material; //const marker = '2'
      //const markerImg = 'circle';
      //const markerImg = 'ball';
      //const markerImg = 'disc';
      //const markerImg = 'spark1';
      //const markerImg = 'lensflare';

      var instancedGeometry = new three__WEBPACK_IMPORTED_MODULE_0__["InstancedBufferGeometry"](); //if (marker=='1'){
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
      //let symbol= nodesData.props.includes("marker") == false ? randomChoice(availableSymbols): nodesData.marker;

      var marker = nodesData.props.includes("marker") == false ? Object(_helpers_tools__WEBPACK_IMPORTED_MODULE_8__["randomChoice"])(Object.values(_shaders_marker_fsh_js__WEBPACK_IMPORTED_MODULE_7__["availableMarkers"])) : nodesData.marker; //marker = '3do'

      var markerGeometry = new three__WEBPACK_IMPORTED_MODULE_0__["PlaneBufferGeometry"](1, 1, 1); //let markerGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

      instancedGeometry = instancedGeometry.copy(markerGeometry);
      instancedGeometry.maxInstancedCount = numNodes; //instancedGeometry.index = markerGeometry.index;
      //instancedGeometry.attributes = markerGeometry.attributes;

      uniforms.edgeColor = {
        type: 'vec3',
        value: new three__WEBPACK_IMPORTED_MODULE_0__["Color"](_data_config__WEBPACK_IMPORTED_MODULE_3__["default"].nodes.edgeColor)
      };
      uniforms.edgeWidth = {
        type: 'f',
        value: 0.1
      };
      material = new three__WEBPACK_IMPORTED_MODULE_0__["RawShaderMaterial"]({
        vertexShader: Object(_shaders_marker_vsh_js__WEBPACK_IMPORTED_MODULE_6__["getMarkerVertexShader"])(fixedNodeSize, fixedColor, nodesGroupName),
        fragmentShader: Object(_shaders_marker_fsh_js__WEBPACK_IMPORTED_MODULE_7__["getMarkerFragmentShader"])(marker, nodesGroupName),
        uniforms: uniforms,
        transparent: true,
        //blending: THREE.AdditiveBlending,
        //blending: THREE.NormalBlending,
        depthTest: !this.use2d,
        //depthTest: false,
        depthWrite: true
      }); //}

      if (fixedNodeSize == false) instancedGeometry.addAttribute("bufferNodeSize", new three__WEBPACK_IMPORTED_MODULE_0__["InstancedBufferAttribute"](new Float32Array(nodesData.size), 1, true));
      if (fixedColor == false) instancedGeometry.addAttribute("bufferColors", new three__WEBPACK_IMPORTED_MODULE_0__["InstancedBufferAttribute"](new Float32Array(nodesData.color.flat()), 3, false));
      instancedGeometry.addAttribute("bufferNodePositions", new three__WEBPACK_IMPORTED_MODULE_0__["InstancedBufferAttribute"](new Float32Array(bufferNodePositions), 3, false));
      nodesMesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](instancedGeometry, material);
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
  }]);

  return Nodes;
}();



/***/ }),

/***/ "./src/js/graph/components/nodes/shaders/marker.fsh.js":
/*!*************************************************************!*\
  !*** ./src/js/graph/components/nodes/shaders/marker.fsh.js ***!
  \*************************************************************/
/*! exports provided: getMarkerFragmentShader, availableMarkers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMarkerFragmentShader", function() { return getMarkerFragmentShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "availableMarkers", function() { return availableMarkers; });
//const sdfFunctions = `
//vec3 sdfCircle(vec2 p, float s){
//float edgeWidth = 1/2.;
//float minSdf = 0.5;
//float sdf = -length(p) + s;
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfSquare(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfDiamond(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfTriangle(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfPentagon(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfHexagon(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfS6(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfProduct(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//vec3 sdfCross(vec2 p, float s){
//return vec3(sdf, minSdf, edgeWidth);
//}
//`
var distFunctions = {
  'o': "\n        edgeWidth = edgeWidth/2.;\n        float minSdf = 0.5;\n        sdf = -length(p) + s;\n    ",
  's': "\n\n        edgeWidth = edgeWidth/2.;\n        float minSdf = 0.5/2.0;\n        vec2 d = abs(p) - vec2(s, s);\n        sdf = -length(max(d,0.0)) - min(max(d.x,d.y),0.0);\n    ",
  'd': "\n\n        edgeWidth = edgeWidth/4.;\n        float minSdf = 0.5/2.0;\n        vec2 b  = vec2(s, s/2.0);\n        vec2 q = abs(p);\n        float h = clamp((-2.0*ndot(q,b)+ndot(b,b))/dot(b,b),-1.0,1.0);\n        float d = length( q - 0.5*b*vec2(1.0-h,1.0+h) );\n        sdf = -d * sign( q.x*b.y + q.y*b.x - b.x*b.y );\n    ",
  '^': "\n        float l = s/1.5;\n        float minSdf = 1000.0;\n        float k = sqrt(3.0);\n        p.x = abs(p.x) - l;\n        p.y = p.y + l/k;\n        if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;\n        p.x -= clamp( p.x, -2.0*l, 0.0 );\n        sdf = length(p)*sign(p.y);\n    ",
  'p': "\n        edgeWidth = edgeWidth/4.;\n        float minSdf = 0.5/2.0;\n        float r = s/2.0;\n        const vec3 k = vec3(0.809016994,0.587785252,0.726542528);\n        p.x = abs(p.x);\n        p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);\n        p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);\n        p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);\n        sdf = -length(p)*sign(p.y);\n    ",
  'h': "\n\n        edgeWidth = edgeWidth/4.;\n        float minSdf = 0.5/2.0;\n        float r = s/2.0;\n        const vec3 k = vec3(-0.866025404,0.5,0.577350269);\n        p = abs(p);\n        p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;\n        p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);\n        sdf = -length(p)*sign(p.y);\n    ",
  's6': "\n\n        float minSdf = 0.5/2.0;\n        edgeWidth = edgeWidth/4.;\n        float r = s/2.0;\n        const vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);\n        p = abs(p);\n        p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;\n        p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;\n        p -= vec2(clamp(p.x,r*k.z,r*k.w),r);\n        sdf = -length(p)*sign(p.y);\n    ",
  'x': "\n\n        edgeWidth = edgeWidth/8.;\n        float minSdf = 0.5/4.0;\n\n        float r = s/4.0;\n        float w = 0.5;\n        p = abs(p);\n        sdf = -length(p-min(p.x+p.y,w)*0.5) + r;\n    ",
  '+': "\n\n        edgeWidth = edgeWidth/4.;\n\n        float minSdf = 0.5/2.0;\n        float r = s/15.0; //corner radius\n        vec2 b = vec2(s/1.0, s/3.0); //base , size\n        //vec2 b = vec2(r, r);\n        p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;\n        vec2  q = p - b;\n        float k = max(q.y,q.x);\n        vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);\n        sdf = -sign(k)*length(max(w,0.0)) - r;\n    "
};

function getDistFunction(marker) {
  var exist = Object.keys(distFunctions).includes(marker);
  if (!exist) marker = 'o';
  return distFunctions[marker];
}

function getShading(marker) {
  var shadingStr = '';
  if (marker != '3do') return '';
  shadingStr = "\n        // shading\n\n        vec3 normal = normalize(vec3(p.xy, sdf));\n        vec3 direction = normalize(vec3(1.0, 1.0, 1.0));\n        float diffuse = max(0.0, dot(direction, normal));\n        float specular = pow(diffuse, 25.0);\n        color = vec3(max(diffuse*color, specular*vec3(1.0)));\n    ";
  return shadingStr;
}

function getMarkerFragmentShader(marker) {
  var nodesGroupName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'main';
  console.info(marker);
  return "\n    precision highp float;\n\n    #define SHADER_NAME MarkerNode_".concat(nodesGroupName, "\n\n    varying vec3 vColor;\n    varying float vOpacity;\n    varying float vEdgeWidth;\n    varying vec3 vPos;\n    varying vec3 vEdgeColor;\n\n    float ndot(vec2 a, vec2 b ) {\n        return a.x*b.x - a.y*b.y;\n    }\n    void main() {\n\n        vec3 color = vColor;\n        vec3 edgeColor = vEdgeColor;\n        float edgeWidth = vEdgeWidth;\n        vec2 p = vPos.xy;\n        float opacity = vOpacity;\n\n        float s = 0.5;\n        float sdf = 0.0;\n        ").concat(getDistFunction(marker), "\n        if (sdf<0.0) discard;\n\n        //float edge0 = 0.0;\n        //float edge1 = minSdf;\n        float opacity2 = opacity;\n        //if (opacity<1.0) opacity2 =  clamp((sdf - edge0) / (edge1 - edge0), 0.01, opacity) + 0.1;\n        ").concat(getShading(marker), "\n\n        vec4 rgba = vec4(  color, opacity2 );\n\n\n        if (edgeWidth > 0.0){\n            if (sdf < edgeWidth)  rgba  = vec4(edgeColor, 1.0);\n        }\n\n        gl_FragColor = rgba;\n\n    }\n    ");
}
var availableMarkers = {
  'Circle': 'o',
  'Sphere': '3do',
  'Square': 's',
  'Rhombus': 'd',
  'Triangle': '^',
  'Petagon': 'p',
  'Hexagon': 'h',
  'Star': 's6',
  'Cross': '+',
  'X': 'x'
};

/***/ }),

/***/ "./src/js/graph/components/nodes/shaders/marker.vsh.js":
/*!*************************************************************!*\
  !*** ./src/js/graph/components/nodes/shaders/marker.vsh.js ***!
  \*************************************************************/
/*! exports provided: getMarkerVertexShader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMarkerVertexShader", function() { return getMarkerVertexShader; });
function getMarkerVertexShader() {
  var fixedNodeSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var fixedColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var nodesGroupName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'main';
  console.info("Get Marker Vertex Shader");
  var markerVertexShader = "\n\n    #define SHADER_NAME MarkerNode_".concat(nodesGroupName, "\n\n    uniform mat4 modelViewMatrix;\n    uniform mat4 projectionMatrix;\n    uniform mat4 viewMatrix;\n    attribute vec3 position;\n\n    attribute vec3 bufferNodePositions;\n    ");

  if (fixedNodeSize) {
    markerVertexShader += 'uniform float bufferNodeSize;';
  } else {
    markerVertexShader += 'attribute float bufferNodeSize;';
  }

  if (fixedColor) {
    markerVertexShader += 'uniform vec3 bufferColors;';
  } else {
    markerVertexShader += 'attribute vec3 bufferColors;';
  }

  markerVertexShader += "\n\n    uniform float bufferOpacity;\n    uniform float bufferNodeScale;\n    uniform float edgeWidth;\n    uniform vec3 edgeColor;\n\n    varying vec3 vColor;\n    varying vec3 vEdgeColor;\n    varying vec3 vPos;\n    varying float vOpacity;\n    varying float vEdgeWidth;\n\n    void main() {\n        vec4 viewNodePos = modelViewMatrix * vec4( bufferNodePositions, 1.0 );\n\n        vec4 mvPosition = viewNodePos +  vec4(position*bufferNodeScale*bufferNodeSize, 0);\n        // if particle size\n        //vec4 mvPosition = viewNodePos +  vec4(position, 0);\n        //gl_PointSize  = bufferNodeScale*bufferNodeSize;\n        //gl_PointSize  = 5.0;\n\n        gl_Position = projectionMatrix * mvPosition;\n\n\n        vColor = bufferColors;\n        vOpacity = bufferOpacity;\n        vPos = position;\n        vEdgeWidth = edgeWidth;\n        vEdgeColor = edgeColor;\n    }\n\n    ";
  return markerVertexShader;
}

/***/ }),

/***/ "./src/js/graph/components/nodes/shaders/markerImg.fsh.js":
/*!****************************************************************!*\
  !*** ./src/js/graph/components/nodes/shaders/markerImg.fsh.js ***!
  \****************************************************************/
/*! exports provided: markerImgFragmentShader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "markerImgFragmentShader", function() { return markerImgFragmentShader; });
var markerImgFragmentShader = "\nprecision highp float;\n#define SHADER_NAME MarkerImgNode\nuniform sampler2D map;\n\nvarying vec2 vUv;\n\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vUseDiffuse2Shadow;\n\nvoid main() {\n\n    vec3 color = vColor;\n    vec4 diffuseColor = texture2D( map, vUv );\n\n    float opacity = diffuseColor.w*vOpacity;\n    gl_FragColor = vec4(\n        (1.0 - vUseDiffuse2Shadow)*color + vUseDiffuse2Shadow*diffuseColor.xyz*color,\n        opacity\n    );\n    if (diffuseColor.w< 0.4 ) discard;\n\n}\n";

/***/ }),

/***/ "./src/js/graph/components/nodes/shaders/markerImg.vsh.js":
/*!****************************************************************!*\
  !*** ./src/js/graph/components/nodes/shaders/markerImg.vsh.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getMarkerImgVertexShader; });
function getMarkerImgVertexShader() {
  var fixedNodeSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var fixedColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var markerVertexShader = "\n    precision highp float;\n\n    #define SHADER_NAME MarkerImgNode\n\n    uniform mat4 modelViewMatrix;\n    uniform mat4 projectionMatrix;\n    uniform mat4 viewMatrix;\n    attribute vec3 position;\n    attribute vec2 uv;\n\n    attribute vec3 bufferNodePositions;\n    ";

  if (fixedNodeSize) {
    markerVertexShader += 'uniform float bufferNodeSize;';
  } else {
    markerVertexShader += 'attribute float bufferNodeSize;';
  }

  if (fixedColor) {
    markerVertexShader += 'uniform vec3 bufferColors;';
  } else {
    markerVertexShader += 'attribute vec3 bufferColors;';
  }

  markerVertexShader += "\n\n    uniform float bufferOpacity;\n    uniform float bufferNodeScale;\n    uniform float useDiffuse2Shadow;\n\n    varying vec3 vColor;\n    varying vec2 vUv;\n    varying float vUseDiffuse2Shadow;\n    varying float vOpacity;\n\n    void main() {\n\n        vec4 viewNodePos = modelViewMatrix * vec4( bufferNodePositions, 1.0 );\n\n        vec4 mvPosition = viewNodePos +  vec4(position*bufferNodeScale*bufferNodeSize, 0);\n\n        gl_Position = projectionMatrix * mvPosition;\n\n        vUv = uv;\n\n        vColor = bufferColors;\n        vOpacity = bufferOpacity;\n        vUseDiffuse2Shadow = useDiffuse2Shadow;\n    }\n\n    ";
  return markerVertexShader;
}

/***/ }),

/***/ "./src/js/graph/components/renderer/main.js":
/*!**************************************************!*\
  !*** ./src/js/graph/components/renderer/main.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Renderer; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/postprocessing/EffectComposer.js */ "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js");
/* harmony import */ var three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/postprocessing/RenderPass.js */ "./node_modules/three/examples/jsm/postprocessing/RenderPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_ShaderPass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/postprocessing/ShaderPass.js */ "./node_modules/three/examples/jsm/postprocessing/ShaderPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_BloomPass_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/postprocessing/BloomPass.js */ "./node_modules/three/examples/jsm/postprocessing/BloomPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_UnrealBloomPass_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three/examples/jsm/postprocessing/UnrealBloomPass.js */ "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js");
/* harmony import */ var three_examples_jsm_shaders_FXAAShader_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three/examples/jsm/shaders/FXAAShader.js */ "./node_modules/three/examples/jsm/shaders/FXAAShader.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(alertifyjs__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_config__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../data/config */ "./src/js/data/config.js");
/* harmony import */ var _helpers_stats__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../../helpers/stats */ "./src/js/graph/helpers/stats.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }












function dataURIToBlob(dataURI) {
  var binStr = window.atob(dataURI.split(',')[1]);
  var len = binStr.length;
  var arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  return new window.Blob([arr]);
}

function saveDataURI(name, dataURI) {
  var blob = dataURIToBlob(dataURI); // force download

  var link = document.createElement('a');
  link.download = name;
  link.href = window.URL.createObjectURL(blob);

  link.onclick = function () {
    window.setTimeout(function () {
      window.URL.revokeObjectURL(blob);
      link.removeAttribute('href');
    }, 500);
  };

  link.click();
}

function defaultFileName(ext) {
  var str = "".concat(new Date().toLocaleDateString(), " at ").concat(new Date().toLocaleTimeString()).concat(ext);
  return str.replace(/\//g, '-').replace(/:/g, '.');
}

var Renderer = /*#__PURE__*/function () {
  function Renderer(useHighQuality, useBloom, scene, controls, container, canvas, camera, appState) {
    var _this = this;

    _classCallCheck(this, Renderer);

    this.scene = scene;
    this.controls = controls;
    this.canvas = canvas;
    this.container = container;
    this.camera = camera;
    this.appState = appState; //renderer.toneMapping = THREE.ReinhardToneMapping;

    this.useHighQuality = useHighQuality;
    this.useBloom = useBloom; // Create WebGL render

    this.renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({
      canvas: canvas,
      antialias: useHighQuality,
      preserveDrawingBuffer: true,
      alpha: true
    });
    this.renderer.autoClear = false;

    if (_data_config__WEBPACK_IMPORTED_MODULE_8__["default"].useStats) {
      this.stats = new _helpers_stats__WEBPACK_IMPORTED_MODULE_9__["default"](this.renderer);
      this.stats.setUp();
    }

    this.renderer.toneMapping = three__WEBPACK_IMPORTED_MODULE_0__["ReinhardToneMapping"];
    this.renderer.setPixelRatio(window.devicePixelRatio); // For retina
    //this.renderer.shadowMap.enabled = false;
    //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Get anisotropy for textures

    _data_config__WEBPACK_IMPORTED_MODULE_8__["default"].maxAnisotropy = this.renderer.getMaxAnisotropy(); // Initial size update set to canvas canvas
    //

    if (useHighQuality || useBloom) {
      this.initComposer();
    }

    if (useBloom) {
      this.initBloomComposer();
    } //if (useHighQuality){
    //this.initFXAAAComposer()
    //}
    //if (useBloom){
    //if(highQuality){
    //let fxaaPass = new ShaderPass( FXAAShader );
    //const pixelRatio = this.renderer.getPixelRatio();
    //fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.canvas.offsetWidth * pixelRatio );
    //fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.canvas.offsetHeight * pixelRatio );
    //this.fxaaPass = fxaaPass
    //this.composer.addPass( fxaaPass );
    //}
    //


    this.updateSize(this.canvas.offsetWidth, this.canvas.offsetHeight); // Listeners

    document.addEventListener('DOMContentLoaded', function () {
      return _this.updateSize();
    }, false);
    window.addEventListener('resize', function () {
      return _this.updateSize();
    }, false);
    this.controls.addEventListener('change', function () {
      return _this.render();
    });
    this.render = this.render.bind(this);
    this.updateSize = this.updateSize.bind(this);
    this.takeScreenshot = this.takeScreenshot.bind(this);
    var btnSave = document.getElementById("btnSaveImage");
    if (btnSave) btnSave.addEventListener("click", function (event) {
      return _this.takeScreenshot();
    });
  }

  _createClass(Renderer, [{
    key: "initComposer",
    value: function initComposer() {
      this.composer = new three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_1__["EffectComposer"](this.renderer);
      var renderPass = new three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_2__["RenderPass"](this.scene, this.camera);
      this.composer.addPass(renderPass);
    }
  }, {
    key: "initBloomComposer",
    value: function initBloomComposer() {
      var bloomPass = new three_examples_jsm_postprocessing_BloomPass_js__WEBPACK_IMPORTED_MODULE_4__["BloomPass"](1, // strength
      25, // kernel size
      4, // sigma ?
      256);
      var strength = 1;
      var radius = 2;
      var threshold = 0;
      this.bloomPass = new three_examples_jsm_postprocessing_UnrealBloomPass_js__WEBPACK_IMPORTED_MODULE_5__["UnrealBloomPass"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector2"](window.innerWidth, window.innerHeight), strength, radius, threshold);
      this.composer.addPass(this.bloomPass);
    }
  }, {
    key: "setCameraAspect",
    value: function setCameraAspect(widthRender, heightRender) {
      var keepPos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var canvas = this.canvas; //const widthRender = window.innerWidth
      //const heightRender = window.innerHeight
      //

      if (keepPos) {
        var aspect = widthRender / heightRender;
        var change = this.appState.originalAspect / aspect;
        var newSize = 1 * change;
        this.camera.left = -aspect * newSize / 2;
        this.camera.right = aspect * newSize / 2;
        this.camera.top = newSize / 2;
        this.camera.bottom = -newSize / 2;
      }

      this.camera.aspect = widthRender / heightRender;
      this.camera.updateProjectionMatrix();
    }
  }, {
    key: "updateSize",
    value: function updateSize(widthRender, heightRender) {
      var keepPos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      //if (this.appState.takingScreenshot) return;
      widthRender = widthRender || this.container.clientWidth;
      heightRender = heightRender || this.container.clientHeight;
      this.setCameraAspect(widthRender, heightRender, keepPos);

      if (this.useHighQuality || this.useBloom) {
        this.renderer.setSize(widthRender, heightRender);
        this.composer.setSize(widthRender, heightRender);
      } else {
        this.renderer.setSize(widthRender, heightRender);
      }

      var pixelRatio = this.renderer.getPixelRatio(); //this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( widthRender * pixelRatio );
      //this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( heightRender * pixelRatio );
      //this.appState.originalAspect  = aspect

      this.render(); //const pixelRatio = window.devicePixelRatio;
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
  }, {
    key: "render",
    value: function render() {
      // Renders scene to canvas target
      // this.pickHelper.pick( scene, camera, 0)
      if (_data_config__WEBPACK_IMPORTED_MODULE_8__["default"].useStats) _helpers_stats__WEBPACK_IMPORTED_MODULE_9__["default"].start(); //this.controls.update();
      //

      if (this.useHighQuality || this.useBloom) {
        //this.renderer.render(this.scene, this.camera);
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      if (_data_config__WEBPACK_IMPORTED_MODULE_8__["default"].useStats) _helpers_stats__WEBPACK_IMPORTED_MODULE_9__["default"].end();
    }
  }, {
    key: "delete",
    value: function _delete() {
      var _this2 = this;

      this.render = function () {
        return 0;
      };

      document.removeEventListener('DOMContentLoaded', function () {
        return _this2.updateSize();
      }, false);
      window.removeEventListener('resize', function () {
        return _this2.updateSize();
      }, false);
      var btnSave = document.getElementById("btnSaveImage");
      if (btnSave) btnSave.removeEventListener("click", function (event) {
        return _this2.takeScreenshot();
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      //const dataURI = this.getURI(widthImage, heightImage, saveWithTransparency);
      this["delete"]();
    }
  }, {
    key: "getURI",
    value: function getURI(widthImage, heightImage, saveWithTransparency) {
      widthImage = widthImage || this.container.clientWidth;
      heightImage = heightImage || this.container.clientHeight;
      this.setCameraAspect(widthImage, heightImage, false); // set camera and renderer to desired screenshot dimension
      //this.camera.aspect = widthImage / heightImage;
      //this.camera.updateProjectionMatrix();

      var color = this.scene.background;

      if (saveWithTransparency) {
        this.renderer.setClearColor(0x000000, 0);
        this.scene.background = null;
      }

      this.renderer.setSize(widthImage, heightImage); //this.renderer.render( this.scene, this.camera, null, false );

      this.composer.setSize(widthImage, heightImage);
      this.composer.render();
      var dataURI = this.canvas.toDataURL('image/png', 1.0);
      if (saveWithTransparency) this.scene.background = color;
      this.appState.takingScreenshot = false;
      this.updateSize();
      return dataURI;
    }
  }, {
    key: "takeScreenshot",
    value: function takeScreenshot() {
      $('#saveImageModal').modal("hide");
      this.appState.takingScreenshot = true;
      this.appState.stopChanges = true;
      var widthImage = parseInt(document.getElementById("widthSaveImage").value);
      var heightImage = parseInt(document.getElementById("heightSaveImage").value);
      var saveWithTransparency = document.getElementById("saveWithTransparency").checked;
      var DataURI = this.getURI(widthImage, heightImage, saveWithTransparency);
      saveDataURI(defaultFileName('.png'), DataURI);
    }
  }]);

  return Renderer;
}();



/***/ }),

/***/ "./src/js/graph/helpers/stats.js":
/*!***************************************!*\
  !*** ./src/js/graph/helpers/stats.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Stats; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Local vars for rStats
var rS, bS, glS, tS;

var Stats = /*#__PURE__*/function () {
  function Stats(renderer) {
    _classCallCheck(this, Stats);

    this.renderer = renderer;
  }

  _createClass(Stats, [{
    key: "setUp",
    value: function setUp() {
      bS = new BrowserStats();
      glS = new glStats();
      tS = new threeStats(this.renderer);
      rS = new rStats({
        CSSPath: './css/',
        userTimingAPI: true,
        values: {
          frame: {
            caption: 'Total frame time (ms)',
            over: 16,
            average: true,
            avgMs: 100
          },
          fps: {
            caption: 'Framerate (FPS)',
            below: 30
          },
          calls: {
            caption: 'Calls (three.js)',
            over: 3000
          },
          raf: {
            caption: 'Time since last rAF (ms)',
            average: true,
            avgMs: 100
          },
          rstats: {
            caption: 'rStats update (ms)',
            average: true,
            avgMs: 100
          },
          texture: {
            caption: 'GenTex',
            average: true,
            avgMs: 100
          }
        },
        groups: [{
          caption: 'Framerate',
          values: ['fps', 'raf']
        }, {
          caption: 'Frame Budget',
          values: ['frame', 'texture', 'setup', 'render']
        }],
        fractions: [{
          base: 'frame',
          steps: ['texture', 'setup', 'render']
        }],
        plugins: [bS, tS, glS]
      });
    }
  }], [{
    key: "start",
    value: function start() {
      rS('frame').start();
      glS.start();
      rS('rAF').tick();
      rS('FPS').frame();
      rS('render').start();
    }
  }, {
    key: "end",
    value: function end() {
      rS('render').end(); // render finished

      rS('frame').end(); // frame finished
      // Local rStats update

      rS('rStats').start();
      rS().update();
      rS('rStats').end();
    }
  }]);

  return Stats;
}();



/***/ }),

/***/ "./src/js/graph/helpers/tools.js":
/*!***************************************!*\
  !*** ./src/js/graph/helpers/tools.js ***!
  \***************************************/
/*! exports provided: randomString, randomChoice */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomString", function() { return randomString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomChoice", function() { return randomChoice; });
/**
 * Return a random string
 * @return {string} A random string with 13 elements
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(2, 15);
};
;
/**
 * Random select a element of a given array
 * @param  {array} arr -
 * @return {Object} A random choiced element of the given array
 */

var randomChoice = function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
};

/***/ }),

/***/ "./src/js/graph/interactions/datGUI.js":
/*!*********************************************!*\
  !*** ./src/js/graph/interactions/datGUI.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DatGUI; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var dat_gui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dat.gui */ "./node_modules/dat.gui/build/dat.gui.module.js");
/* harmony import */ var _components_nodes_shaders_marker_fsh_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../components/nodes/shaders/marker.fsh.js */ "./src/js/graph/components/nodes/shaders/marker.fsh.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




/**
 * Update the dropdown itens related with a given datGUI element
 * @param  {DOMGui} datGUI select element
 * @param  {Array} Array of strings with the dropdown itens
 */

function updateDropdown(target, list) {
  var innerHTMLStr = "";

  for (var i = 0; i < list.length; i++) {
    var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
    innerHTMLStr += str;
  }

  if (innerHTMLStr != "") target.domElement.children[0].innerHTML = innerHTMLStr;
} // Manages all dat.GUI interactions


var DatGUI = /*#__PURE__*/function () {
  function DatGUI(idCanvasHTML, scene, renderer, camera, nodes0, edges0, Config, appState) {
    _classCallCheck(this, DatGUI);

    var gui = new dat_gui__WEBPACK_IMPORTED_MODULE_1__["GUI"]({
      autoPlace: false,
      name: idCanvasHTML
    });
    this.gui = gui; //container.appendChild(gui.domElement);

    document.getElementById("datGui".concat(idCanvasHTML)).appendChild(gui.domElement);
    var render = renderer.render; //canvas.appendChild(gui.domElement);
    //this.camera = main.camera.threeCamera;
    //this.controls = main.controls.threeControls;
    //this.light = main.light;

    /* Scene */

    var sceneFolder = gui.addFolder('Scene');
    sceneFolder.addColor(Config.scene, "color").name('Color').onChange(function (color) {
      scene.background = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](color);
      render();
    });
    sceneFolder.open();
    /* Nodes */

    var nodesFolder = gui.addFolder('Nodes');
    this.comunityField = nodesFolder.add(appState, "comunityField", appState.comunityField).name("Comunity").onChange(function (value) {
      nodes0.setComunity(value);
    });
    var markers = {
      marker: {
        "--": ""
      }
    };
    nodesFolder.add(markers, "marker", _components_nodes_shaders_marker_fsh_js__WEBPACK_IMPORTED_MODULE_2__["availableMarkers"]).name("marker").onChange(function (value) {
      nodes0.changeMarker(value);
      render();
    });
    nodesFolder.add(Config.nodes, 'show').onChange(function (value) {
      for (var _i = 0, _Object$entries = Object.entries(nodes0.nodes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            nodeName = _Object$entries$_i[0],
            node = _Object$entries$_i[1];

        node.visible = value;
      }

      Config.nodes.show = value;
      render();
    });
    nodesFolder.addColor(Config.nodes, "color").name('Color').onChange(function (color) {
      nodes0.changeColor(color);
      render();
    });
    this.sizeField = nodesFolder.add(appState, "defaultProps", appState.defaultProps).name("Size Field").onChange(function (value) {
      nodes0.sizeByField(value);
      render();
    });
    nodesFolder.add(Config.nodes, 'scale', 1, 10, 0.1).name('Scale').onChange(function (value) {
      nodes0.changeScale(value);
      render(); //node.material.opacity=value;
    });
    nodesFolder.addColor(Config.nodes, "edgeColor").name('Edge Color').onChange(function (color) {
      nodes0.changeEdgeColor(color);
      render();
    });
    nodesFolder.add(Config.nodes, 'edgeWidth', 0.0, 1, 0.01).name('Edge Width').onChange(function (value) {
      nodes0.changeEdgeWidth(value);
      render(); //node.material.opacity=value;
    });
    nodesFolder.add(Config.nodes, 'opacity', 0, 1).name('Opacity').onChange(function (value) {
      nodes0.changeOpacity(value);
      render(); //node.material.opacity=value;
    });
    this.colorProp = nodesFolder.add(appState, "defaultProps", appState.defaultProps).name("Color by Attr.").onChange(function (value) {
      nodes0.colorByProp(value);
    });
    this.colorField = nodesFolder.add(appState, "defaultProps", appState.defaultProps).name("Color Field").onChange(function (value) {
      nodes0.colorByField(value);
    });
    nodesFolder.open();
    this.nodesFolder = nodesFolder;
    /* Edges */

    var edgesFolder = gui.addFolder('Edges');
    edgesFolder.add(Config.edges, 'show').onChange(function (value) {
      Config.edges.show = value;
      render();
    }); //edgesFolder.addColor(Config.edges, "color").name('Color')
    //.onChange((color) => {
    //edges0.changeColor(color)
    //});

    var colorEdge = {
      prop: [],
      field: []
    };
    this.colorEdgeProp = edgesFolder.add(colorEdge, "prop", colorEdge.prop).name("Color by Prop.").onChange(function (value) {
      edges0.colorByProp(value);
    });
    this.colorEdgeField = edgesFolder.add(colorEdge, "field", colorEdge.prop).name("Color by Field.").onChange(function (value) {
      edges0.colorByField(value);
    }); //nodesFolder.add(Config.nodes, 'scale', 0.01, 5).name('Scale').onChange((value) => {
    //nodes0.changeScale(value)
    ////node.material.opacity=value;
    //});

    edgesFolder.add(Config.edges, 'opacity', 0, 1).name('Opacity').onChange(function (value) {
      edges0.changeOpacity(value); //node.material.opacity=value;
    }); //Edges Bloom
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

    edgesFolder.open();
    var renderFolder = gui.addFolder('Render');
    renderFolder.add(Config.bloomPass, 'exposure', 0.1, 5).onChange(function (value) {
      renderer.toneMappingExposure = Math.pow(value, 4.0);
      render();
    });
    renderFolder.add(Config.bloomPass, 'threshold', 0.0, 1.0).onChange(function (value) {
      renderer.bloomPass.threshold = Number(value);
      render();
    });
    renderFolder.add(Config.bloomPass, 'strength', 0.0, 10.0).onChange(function (value) {
      renderer.bloomPass.strength = Number(value);
      render();
    });
    renderFolder.add(Config.bloomPass, 'radius', 0.0, 1.0).step(0.01).onChange(function (value) {
      renderer.bloomPass.radius = Number(value);
      render();
    });
    renderFolder.open();
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

  _createClass(DatGUI, [{
    key: "updateComunityField",
    value: function updateComunityField(values) {
      values.unshift('');
      updateDropdown(this.comunityField, values);
    }
  }, {
    key: "updateNodeColorProp",
    value: function updateNodeColorProp(values) {
      values.unshift('');
      values = values.filter(function (v) {
        return v != 'pos';
      });
      updateDropdown(this.colorField, values);
      updateDropdown(this.colorProp, values);
      updateDropdown(this.sizeField, values.filter(function (v) {
        return v != 'color';
      }));
    }
  }, {
    key: "updateEdgeColorProp",
    value: function updateEdgeColorProp(values) {
      values.unshift('');
      updateDropdown(this.colorEdgeField, values);
      updateDropdown(this.colorEdgeProp, values);
    }
  }]);

  return DatGUI;
}(); //unreal bloom effect
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




/***/ }),

/***/ "./src/js/graph/interactions/keyboard.js":
/*!***********************************************!*\
  !*** ./src/js/graph/interactions/keyboard.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Interaction; });
/* harmony import */ var _utils_keyboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/keyboard */ "./src/js/utils/keyboard.js");
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/helpers */ "./src/js/utils/helpers.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(alertifyjs__WEBPACK_IMPORTED_MODULE_2__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


 //import Config from "../../data/config";

 // Manages all input interactions

var Interaction = /*#__PURE__*/function () {
  function Interaction(canvas, appState, Config, datGui, keypressFunc) {
    var _this = this;

    _classCallCheck(this, Interaction);

    // Properties
    this.canvas = canvas;
    this.keypressFunc = keypressFunc;
    this.datGui = datGui;
    this.timeout = null; // Instantiate keyboard helper

    this.keyboard = new _utils_keyboard__WEBPACK_IMPORTED_MODULE_0__["default"](); //this.keyboard = new Keyboard(document.getElementById('containergraphCanvas'));
    // Listeners
    // Mouse events

    this.keypressEvent = this.keypressEvent.bind(this); // Keyboard events

    this.keyboard.domElement.addEventListener("keydown", function (event) {
      return _this.keypressEvent(event);
    } // Only once
    //if(this.keyboard.eventMatches(event, 'escape')) {
    //  console.log('Escape pressed');
    // }
    );
    this.appState = appState;
  }

  _createClass(Interaction, [{
    key: "keypressEvent",
    value: function keypressEvent(event) {
      var _this2 = this;

      var repeat = event.repeat;
      var key = event.key;
      var alertHTMLobj = document.getElementById("bootstraAlertStrong"); //let bootstrapAlert = document.getElementById("bootstrapAlert")

      var bootstrapAlert = $("#bootstrapAlert");

      switch (key.toLowerCase()) {
        case "e":
          alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.message("Edition Mode");
          this.datGui.closed = true;
          this.appState.vimMode = "Edition";
          console.info("Vim mode Edition");
          break;

        case "v":
          alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.message("Visual Mode");
          this.datGui.closed = false;
          this.appState.vimMode = "Visual";
          console.info("Vim mode Visualization");
          break;

        case "n":
          alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.message("Navigation Mode");
          this.datGui.closed = true;
          this.appState.vimMode = "Navigation";
          break;

        case "s":
          document.getElementById("widthSaveImage").value = window.innerWidth;
          document.getElementById("heightSaveImage").value = window.innerHeight;
          $('#saveImageModal').modal("show");

        case "d":
          if (this.appState.vimMode == "Edition") this.keypressFunc(key, "deleteNode");
          break;

        case "l":
        case "j":
        case "i":
        case "k":
          if (this.appState.vimMode == "Visual" && key == "l") {
            alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.confirm("Are you sure you want to reload the graph?", function () {
              _this2.keypressFunc(key, "reloadGraph");
            });
          }

          if (this.appState.vimMode == "Edition") {
            this.keypressFunc(key, "move");
            repeat = false;
          }

          break;

        case "r":
          if (this.appState.vimMode == "Visual") alertifyjs__WEBPACK_IMPORTED_MODULE_2___default.a.message("Recalculating  positions");
          this.keypressFunc(key, "recalcPos");
          break;

        default:
          break;
      }

      if (repeat) {
        return;
      } //console.log("keydown", event);

    }
  }]);

  return Interaction;
}();



/***/ }),

/***/ "./src/js/graph/main.js":
/*!******************************!*\
  !*** ./src/js/graph/main.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Graph; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");
/* harmony import */ var alertifyjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(alertifyjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_renderer_main__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/renderer/main */ "./src/js/graph/components/renderer/main.js");
/* harmony import */ var _components_nodes_main__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/nodes/main */ "./src/js/graph/components/nodes/main.js");
/* harmony import */ var _components_edges_main__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/edges/main */ "./src/js/graph/components/edges/main.js");
/* harmony import */ var _interactions_keyboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./interactions/keyboard */ "./src/js/graph/interactions/keyboard.js");
/* harmony import */ var _interactions_datGUI__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./interactions/datGUI */ "./src/js/graph/interactions/datGUI.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Global imports -








/**
 * Random select a element of a given array
 * @param  {string}
 * @return {Object} A random choiced element of the given array
 */

var Graph = /*#__PURE__*/function () {
  /**
   * @param  {string} Id of Canvas DOMElement
   * @param  {string} Id of Canvas DOMElement
   * @param  {bool}
   * @param  {bool} If the graph should be ploted in 2d
   * @return {Object} A random choiced element of the given array
   */
  function Graph(idCanvasHTML, Config, keyboardPressFunction) {
    var use2d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var useHighQuality = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var useBloom = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    _classCallCheck(this, Graph);

    this.Config = Config;
    this.use2d = use2d;
    this.useHighQuality = useHighQuality;
    this.useBloom = useBloom;
    this.idCanvasHTML = idCanvasHTML;
    this.canvas = document.getElementById("".concat(idCanvasHTML));
    this.container = document.getElementById("container".concat(idCanvasHTML));

    if (use2d) {
      this.camera = new three__WEBPACK_IMPORTED_MODULE_0__["OrthographicCamera"](2, -2, 2, -2, Config.camera.near, Config.camera.far);
    } else {
      this.camera = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](Config.camera.fov, Config.camera.aspect, Config.camera.near, Config.camera.far);
    }

    this.scene = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
    this.renderer;
    this.state;
    this.keyboardPressFunction = keyboardPressFunction; //this.init = this.init.bind(this)
  }

  _createClass(Graph, [{
    key: "init",
    value: function init() {
      this.state = _defineProperty({
        vimMode: "Visual",
        isLoaded: false,
        firstLoad: true,
        takingScreenshot: false,
        defaultProps: {},
        stopChanges: false,
        renders: [],
        comunityField: {},
        rendering: false
      }, "defaultProps", {});
      var viewSize = 1;
      var aspectRatio = window.innerWidth / window.innerHeight;
      this.state.originalAspect = window.innerWidth / window.innerHeight;
      this.scene.add(this.camera);
      this.scene.background = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](this.Config.scene.color);
      this.nodes = new _components_nodes_main__WEBPACK_IMPORTED_MODULE_4__["default"](this.scene, this.use2d);
      this.edges = new _components_edges_main__WEBPACK_IMPORTED_MODULE_5__["default"](this.scene, 0, 1);
      this.controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__["OrbitControls"](this.camera, this.canvas);
      this.controls.target.set(0, 0, 0);
      this.controls.enableKeys = true;
      this.controls.screenSpacePanning = true; //this.controls.update();

      if (this.use2d) {
        this.controls.enableRotate = false; //this.controls.maxPolarAngle = 0; // radians
        //this.controls.minAzimuthAngle = - 0; // radians
        //this.controls.maxAzimuthAngle = 0; // radians
      }

      this.renderer = new _components_renderer_main__WEBPACK_IMPORTED_MODULE_3__["default"](this.highQuality, this.useBloom, this.scene, this.controls, this.container, this.canvas, this.camera, this.state);
      if (this.Config.useGuiControl) this.datGui = new _interactions_datGUI__WEBPACK_IMPORTED_MODULE_7__["default"](this.idCanvasHTML, this.scene, this.renderer, this.camera, this.nodes, this.edges, this.Config, //bloomPassEdges,edgesBloomScene,
      this.state);
      if (this.Config.useKeyboard) this.keyboardInteraction = new _interactions_keyboard__WEBPACK_IMPORTED_MODULE_6__["default"](this.canvas, this.state, this.Config, this.datGui.gui, this.keyboardPressFunction); //{
      //const color = 0xffffff;
      //const intensity = 4;
      //const light = new THREE.DirectionalLight(color, intensity);
      //light.position.set(-1, 2, 4);
      //light.layers.enable(0)
      //this.camera.add(light);
      //}
    }
    /**
     * Random select a element of a given array
     */

  }, {
    key: "ressetLook",
    value: function ressetLook() {
      //let position = this.edges.instancedEdges.geometry.boundingSphere.center
      //this.camera.position.z = 4*this.edges.instancedEdges.geometry.boundingSphere.radius
      this.camera.position.z = 4; //this.camera.lookAt(position)

      this.camera.updateProjectionMatrix();
      this.renderer.render();
    }
    /**
     * Random select a element of a given array
     */

  }, {
    key: "deleteGraph",
    value: function deleteGraph() {
      this.nodes.deleteAllNodes();
      this.edges.deleteAllEdges();
    }
    /**
     * @param  {string} Id of Canvas DOMElement
     * @param  {string} Id of Canvas DOMElement
     * @param  {bool}
     * @param  {bool} If the graph should be ploted in 2d
     * @return {Object} A random choiced element of the given array
     */

  }, {
    key: "getURI",
    value: function getURI(width, height, transparency) {
      transparency = transparency || false;
      var uri = this.renderer.getURI(width, height, transparency);
      this.uri = uri;
    }
    /**
     * Random select a element of a given array
     */

  }, {
    key: "stopRender",
    value: function stopRender() {
      //this.deleteGraph();
      this.renderer.stop();
    }
  }]);

  return Graph;
}();



/***/ }),

/***/ "./src/js/utils/helpers.js":
/*!*********************************!*\
  !*** ./src/js/utils/helpers.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Helpers; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Provides simple static functions that are used multiple times in the app
var Helpers = /*#__PURE__*/function () {
  function Helpers() {
    _classCallCheck(this, Helpers);
  }

  _createClass(Helpers, null, [{
    key: "throttle",
    value: function throttle(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last, deferTimer;
      return function () {
        var context = scope || this;
        var now = +new Date(),
            args = arguments;

        if (last && now < last + threshhold) {
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }
  }, {
    key: "logProgress",
    value: function logProgress() {
      return function (xhr) {
        if (xhr.lengthComputable) {
          var percentComplete = xhr.loaded / xhr.total * 100;
          console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
      };
    }
  }, {
    key: "logError",
    value: function logError() {
      return function (xhr) {
        console.error(xhr);
      };
    }
  }, {
    key: "handleColorChange",
    value: function handleColorChange(color) {
      return function (value) {
        if (typeof value === 'string') {
          value = value.replace('#', '0x');
        }

        color.setHex(value);
      };
    }
  }, {
    key: "update",
    value: function update(mesh) {
      this.needsUpdate(mesh.material, mesh.geometry);
    }
  }, {
    key: "needsUpdate",
    value: function needsUpdate(material, geometry) {
      return function () {
        material.shading = +material.shading; //Ensure number

        material.vertexColors = +material.vertexColors; //Ensure number

        material.side = +material.side; //Ensure number

        material.needsUpdate = true;
        geometry.verticesNeedUpdate = true;
        geometry.normalsNeedUpdate = true;
        geometry.colorsNeedUpdate = true;
      };
    }
  }, {
    key: "updateTexture",
    value: function updateTexture(material, materialKey, textures) {
      return function (key) {
        material[materialKey] = textures[key];
        material.needsUpdate = true;
      };
    }
  }]);

  return Helpers;
}();



/***/ }),

/***/ "./src/js/utils/keyboard.js":
/*!**********************************!*\
  !*** ./src/js/utils/keyboard.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Keyboard; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ALIAS = {
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'space': 32,
  'tab': 9,
  'escape': 27
};

var Keyboard = /*#__PURE__*/function () {
  function Keyboard(domElement) {
    var _this = this;

    _classCallCheck(this, Keyboard);

    this.domElement = domElement || document;
    this.keyCodes = {}; // bind keyEvents

    this.domElement.addEventListener('keydown', function (event) {
      return _this.onKeyChange(event);
    }, false);
    this.domElement.addEventListener('keyup', function (event) {
      return _this.onKeyChange(event);
    }, false); // bind window blur

    window.addEventListener('blur', function () {
      return _this.onBlur;
    }, false);
  }

  _createClass(Keyboard, [{
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      this.domElement.removeEventListener('keydown', function (event) {
        return _this2.onKeyChange(event);
      }, false);
      this.domElement.removeEventListener('keyup', function (event) {
        return _this2.onKeyChange(event);
      }, false); // unbind window blur event

      window.removeEventListener('blur', function () {
        return _this2.onBlur;
      }, false);
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      for (var prop in this.keyCodes) {
        this.keyCodes[prop] = false;
      }
    }
  }, {
    key: "onKeyChange",
    value: function onKeyChange(event) {
      // log to debug
      //console.log('onKeyChange', event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
      // update this.keyCodes
      var keyCode = event.keyCode;
      this.keyCodes[keyCode] = event.type === 'keydown';
    }
  }, {
    key: "pressed",
    value: function pressed(keyDesc) {
      var keys = keyDesc.split('+');

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var pressed = false;

        if (Object.keys(ALIAS).indexOf(key) != -1) {
          pressed = this.keyCodes[ALIAS[key]];
        } else {
          pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
        }

        if (!pressed) return false;
      }

      return true;
    }
  }, {
    key: "eventMatches",
    value: function eventMatches(event, keyDesc) {
      var aliases = ALIAS;
      var aliasKeys = Object.keys(aliases);
      var keys = keyDesc.split('+'); // log to debug
      // console.log('eventMatches', event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var pressed = false;

        if (key === 'shift') {
          pressed = event.shiftKey ? true : false;
        } else if (key === 'ctrl') {
          pressed = event.ctrlKey ? true : false;
        } else if (key === 'alt') {
          pressed = event.altKey ? true : false;
        } else if (key === 'meta') {
          pressed = event.metaKey ? true : false;
        } else if (aliasKeys.indexOf(key) !== -1) {
          pressed = event.keyCode === aliases[key];
        } else if (event.keyCode === key.toUpperCase().charCodeAt(0)) {
          pressed = true;
        }

        if (!pressed) return false;
      }

      return true;
    }
  }]);

  return Keyboard;
}();



/***/ }),

/***/ 0:
/*!*****************************!*\
  !*** multi ./src/js/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/js/app.js */"./src/js/app.js");


/***/ })

},[[0,"runtime","vendors"]]]);
//# sourceMappingURL=main.app.js.map