from flask import Flask, render_template
from flask_socketio import SocketIO
from flask import request
from flask_socketio import join_room, leave_room
from flask_socketio import send, emit
import igraph as ig

import time
import json

import logging
import sys

import numpy as np
# TODO : CLOSE SERVER
# TODO: CLOSE ALL WEB PAGES
# TODO: CLOSE ALL HTTP.SERVER
# TODO: INDEX HTML RENDERIZAR APP PADRAO

        # format='{%(pathname)s:%(lineno)d} %(levelname)s - %(message)s',
logging.basicConfig(
        format="[%(asctime)s]  {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s",
        datefmt="%m-%d %H:%M:%S",
        stream=sys.stdout, level=logging.INFO)

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
USERS = set()

State = {
    "graphLoaded": False,
    "defaultProps": {},
    "useHelios": True,
    "imgURI":None, 
    "mainRenderSid":None, # sesson id of the webclient which will render the img 
}

availableRooms = { 
    "webClient":[], # rooms w.r.t. web clients 
    "pyObj":[], # rooms w.r.t. the python object clients
}

   
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app,  cors_allowed_origins="*")

def dummyGraph():
    global g, State
    n = 1000
    g = ig.Graph.Erdos_Renyi(n, 3/n)
    
    # defaultProps = g.vs[0].attribute_names()
    defaultProps = ["pos", "degree"]

    degree = g.degree()

    layout = g.layout_kamada_kawai_3d()
    coords = np.array( layout.coords).flatten().tolist()

    nodesId = {
        n:n for n in range(n)
    }

    nodes = {}
    nodes["id"] = nodesId
    nodes["props"] = defaultProps
    nodes["pos"] = coords
    nodes["degree"] = degree


    # defaultEdgeProps = g.es[0].attribute_names()
    defaultEdgeProps = []
    edges = {}
    edges["nodes"] = [[e.source, e.target] for e in g.es]
    for prop in defaultEdgeProps:
        edges[prop] = [d[prop] for d in edge_data]

    edges["props"] = defaultEdgeProps
    State["nodes"] = nodes
    State["edges"] = edges

    State["graphLoaded"] = True
    State["numNodes"] = n
    State["defaultProps"] = defaultProps
    State["defaultEdgeProps"] = defaultEdgeProps

def loadGraph(fileName):
    global g, State
    g = ig.read(fileName)

    n = g.vcount()
    nodes = {}    
    defaultProps = g.vs[0].attribute_names()
    posInProps = "pos" in defaultProps

    if posInProps:
        nodes["pos"] = []
    else:
        layout = g.layout_kamada_kawai_3d()
        nodes["pos"] = np.array( layout.coords).flatten().tolist()

        
    nodesId = {
        n:n for n in range(n)
    }

        
    nodes["id"] = nodesId
    nodes["props"] = defaultProps
    for prop in defaultProps:
        for node in g.vs:
            if prop == "pos":
                for node in g.vs:
                    nodes["pos"] += list(n["pos"])
            else:
                nodes[prop] = []
                for node in g.vs:
                    nodeInfo = node
                    value = nodeInfo[prop] if prop in node.attribute_names() else 0
                    nodes[prop].append(value)


    edges = {}
    defaultEdgeProps = g.es[0].attribute_names()


    edges["nodes"] = [[e.source, e.target] for e in g.es]
    for prop in defaultEdgeProps:
        edges[prop] = [e[prop] for e in g.es]

    edges["props"] = defaultEdgeProps

    State["nodes"] = nodes
    State["edges"] = edges

    State["graphLoaded"] = True
    State["numNodes"] = n
    State["defaultProps"] = defaultProps
    State["defaultEdgeProps"] = defaultEdgeProps

@socketio.on("getGraph")
def getGraph():
    logging.info("Get  Nodes Info")
    if State["graphLoaded"]:
        data = {"type":"yourGraphData", "nodes":State["nodes"], "edges": State["edges"],
                "defaultProps":State["defaultProps"]}
    else:
        data = {"type": "fail", "msg":"load the graph first"}

    #message = json.dumps(data)
    
    emit("webClientListener", data, room=request.sid)


@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('renderMyImg')
def askToRenderMyImg(props):
    sid = State["mainRenderSid"]
    state = "fail"
    msg = ""

    data = {"type": "askToRenderMyImg", "msg":"",
    "width":props["width"], "height":props["height"],
    "transparency":props["transparency"]
    }
    if sid is None:

        if len(availableRooms["webClient"]) > 0:
            state = "success"
            msg = "asked to first webclient"
            emit("webClientListener", data,
                room=availableRooms["webClient"][0])
        else:
            state = "fail"
            msg = "no webclient available"
    else:
        state = "success"
        msg = "asked to protagonist webclient"

        emit("webClientListener", data,
            room=sid)

    return {"state": state, msg:"msg"}  

@socketio.on('sendRenderedImg')
def sendRenderedImg(data):
    state = "fail"
    msg = ""
    print("\n\n rendered img \n\n\n")
    State["imgURI"] = data["imgURI"]
    data = {"type": "askToRenderMyImg", "msg":"",
        "imgURI": data["imgURI"]
    }
    emit("reciveRenderedImg", data,
        room="pyObj")


@socketio.on('joinRoom')
def joinRoom(data):
    room = data["room"]
    if room not in availableRooms.keys():
        return {"state": "fail", "msg": "room not available"} 

    join_room(room)
    availableRooms[room].append(request.sid)
    msg = {"state": "success", "msg": "You're inside %s room"%room}

    return msg  

@socketio.on('leaveRoom')
def leaveRoom(data):
    room = data['room']
    if room not in availableRooms.keys():
        return {"state": "fail", "msg": "room not available"} 

    leave_room(room)
    # todo: remove the webclient id to avoid issues with ask2renderImg
    # availableRooms[room].append(request.sid)
    msg = {"state": "success", "msg": "You're left %s room"%room}

    return msg  

@socketio.on('imTheProtagonist')
def setMainRenderSid():
    global State

    State["mainRenderSid"] = request.sid
    msg = {"state": "success", "msg": ""}

    return msg

@socketio.on('connect')
def connect():
    #print(request.headers.get("username"))
    msg = {'state': 'success'}
    return msg  

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--file", help="", type=str)
    parser.add_argument("--test", action='store_true',)
    args = parser.parse_args()
    if args.test:
        dummyGraph()

    elif args.file:
        State["filename"] = args.file
        logging.info("Loading from file " + args.file)
        loadGraph(args.file)

    socketio.run(app, debug=False)