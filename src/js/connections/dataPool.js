import alertify from "alertifyjs"

import Config from '../data/config';


export default class DataPool {
    constructor(listenerFunction) {
        this.ws = new WebSocket(`ws://${Config.address}/`);

        this.ws.onopen = function (event) {
            alertify.success("opened connection");
        }.bind(this,);
        this.ws.onclose = () => alertify.warning("closed connection");
        this.ws.onerror = () => alertify.error("error connection");
        this.ws.addEventListener("message", listenerFunction);
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
        if (!this.isOpen()) return
        const message = {
            type: "getGraph",
        };
        this.ws.send(JSON.stringify(message));
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
