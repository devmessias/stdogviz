import alertify from "alertifyjs"

import Config from '../data/config';
import io from 'socket.io-client';


export default class DataPool {
    constructor(address, listenerFunction) {
        this.address = address;
        this.ws = io.connect(`http://${address}/`);

        
       // this.ws.on("connect",  (event)=>{ 
        //     alertify.success("opened connection");
        // })
        this.ws.on("disconnect",(event)=> {
            alertify.warning("closed connection");
        })
        ///this.ws.onerror = () => alertify.error("error connection");
        this.ws.on("webClientListener",function(data){
            listenerFunction(data)
        });
        this.ws.emit("joinRoom", { room: "webClient" });

        this.ws.emit("imTheProtagonist");
        this.getGraph = this.getGraph.bind(this)
    }

    isOpen() {
        const open = this.ws.readyState === this.ws.OPEN
        if (!open){
            alertify.error("Connection Closed")
            console.error("Conection closed")
            this.ws = new WebSocket(`ws://${Config.address}/`);
        }
        return open
    }

    getGraph() {
       // if (!this.isOpen()) return
        this.ws.emit("getGraph");
    }
    send2server(imgURI){
        this.ws.emit("sendRenderedImg", {"imgURI":imgURI})
    }

    deleteNodes(nodesId) {
        console.info("deleteNodes", nodesId)
        if (!this.isOpen()) return
        const message = {
            type: "deleteNodes",
            info: {"nodesId": nodesId}
        };
        this.ws.send(JSON.stringify(message));
    }

    reloadGraph(){
        console.info("reload Graph")
        if (!this.isOpen()) return
        const message = {
            type: "reloadGraph",
        };
        this.ws.send(JSON.stringify(message));
        //window.location.reload()
    }


    recalcPos() {
        console.info("recalc pos")
        if (!this.isOpen()) return
        const message = {
            type: "recalcPos",
        };
        this.ws.send(JSON.stringify(message));
    }
}
