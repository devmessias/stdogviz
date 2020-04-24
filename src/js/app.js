
import Graph from './graph/main';
import Config from './data/config';
import DataPool from "./connections/dataPool";


if(__ENV__ === 'dev') {
  console.info('----- RUNNING IN DEV ENVIRONMENT! -----');
  Config.isDev = true;
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
                dataPoolSocket.recalcPos()

                break;

            case "reloadGraph":
                dataPoolSocket.reloadGraph()
                break;

            default:
                break;
        }
    }
function listenerFunction(event) {
    let message = JSON.parse(event.data);
    switch (message["type"]) {
        case "getGraph":
            clearInterval(intervalGetGraph);
            //graphObj.state.defaultProps = message.defaultProps
            //
            graphObj.edges.createEdges(message.nodes, message.edges, message.defaultProps);
            graphObj.nodes.createNodes(message.nodes, message.defaultProps);
            if(graphObj.state.firstLoad){
                graphObj.firstLoad = false;
                graphObj.ressetLook();
                clearInterval(intervalGetGraph)
            }
            //
            //camera.position.set(0, nodes0.max_vals[2] * (1 + 2), 0);
            //datGui.updateNodeColorProp(message.nodes.props)
            //datGui.updateEdgeColorProp(message.edges.props)
            //camera.lookAt(nodes0.instancedNodes);


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
            graphObj.renderer.render()
            break;


        default:
            break;
    }


}

Config.useGuiControl = true;
const graphObj = new Graph(
    "graphCanvas",
    Config,
    keyboardPressFunction
)
window.graphObjVar = graphObj;
graphObj.init()

let dataPoolSocket = new DataPool(listenerFunction);
const intervalGetGraph = setInterval(() => {
    dataPoolSocket.getGraph();
}, 1000);


