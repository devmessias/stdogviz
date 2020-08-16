
import Graph from './graph/main';
import Config from './data/config';
import DataPool from "./connections/dataPool";


Config.isDev = true;


function keyboardPressFunction(key, action) {

        switch (action) {
            case "saveImg":
                $('#saveImageModal').modal("show")
            break;
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
                dataPoolSocket.recalcPos()

                break;

            case "reloadGraph":
                dataPoolSocket.reloadGraph()
                break;

            default:
                break;
        }
    }
function listenerFunction(message) {
    //let message = JSON.parse(event.data);
    switch (message["type"]) {
      case "yourGraphData":
        clearInterval(intervalGetGraph);
        //graphObj.state.defaultProps = message.defaultProps
        //
        console.group("getGraph");
        console.time("creatingEdges");

        console.group("createEdges");
        graphObj.edges.createEdges(
          message.nodes,
          message.edges,
          message.defaultProps
        );
        console.groupEnd();
        console.timeEnd("creatingEdges");

        console.group("createNodes");
        console.time("creatingNodes");
        graphObj.nodes.createNodes(message.nodes, true);
        console.timeEnd("creatingNodes");
        console.groupEnd();
        if (graphObj.state.firstLoad) {
          graphObj.firstLoad = false;
          graphObj.ressetLook();
          clearInterval(intervalGetGraph);
        }

        graphObj.nodes.stopUpdate();
        //let nodes = JSON.parse(JSON.stringify(message.nodes))
        //nodes.pos = nodes.pos.map((p)=>p*0.3);
        //graphObj.nodes.createNodes(nodes, false);
        //
        //camera.position.set(0, nodes0.max_vals[2] * (1 + 2), 0);
        graphObj.datGui.updateNodeColorProp(message.nodes.props);
        graphObj.datGui.updateComunityField(
          Object.keys(graphObj.nodes.nodesGroup)
        );
        //datGui.updateEdgeColorProp(message.edges.props)
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

      case "askToRenderMyImg":
        const dataURI = graphObj.renderer.takeScreenshot(
          message["width"],
          message["height"],
          message["transparency"]
        );
        dataPoolSocket.send2server(dataURI, message["time"]);
        break;
      case "updateNodeColors":
        graphObj.nodes.updateColors(message.colors, 'main');
        graphObj.renderer.render();
        break;

      default:
        break;
    }


}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.info(queryString);
const useHighQuality = urlParams.has('highQuality')? urlParams.get('highQuality')=='1': false;
const useBloom = urlParams.has('bloom')? urlParams.get('bloom')=='1': true;
const use2d = urlParams.has('use2d')? urlParams.get('use2d')=='1': false;
const address = urlParams.has('address')? urlParams.get('address'): 'localhost:5000';
const showStats = urlParams.has('stats')? urlParams.get('stats')=='1': false;

Config.useGuiControl = true;

const graphObj = new Graph(
    "graphCanvas",
    Config,
    keyboardPressFunction,
    use2d,
    useHighQuality,
    useBloom,
    showStats
)
window.graphObjVar = graphObj;

console.group('Socket Conection');

console.info('Address:', address);

let dataPoolSocket = new DataPool(address, listenerFunction);
graphObj.init(dataPoolSocket)
const intervalGetGraph = setInterval(() => {
    dataPoolSocket.getGraph();
}, 1000);

console.groupEnd();
