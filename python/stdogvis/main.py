import socketio
from PIL import Image
from io import BytesIO
from base64 import b64decode 
import numpy as np
import igraph as ig
import time

def ig2vis(g):
    """Convert a igraph graph to a dict compatible with 
    the viz
    """
    dataViz = {}
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
                    nodes["pos"] += list(node["pos"])
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
    dataViz["n"] = n
    dataViz["nodes"] = nodes
    dataViz["edges"] = edges

    dataViz["numNodes"] = n
    dataViz["defaultProps"] = defaultProps
    dataViz["defaultEdgeProps"] = defaultEdgeProps
    return dataViz

def b64toImg(imgURI):
    imgdata = b64decode(imgURI.split(",")[1])
    imagestr = 'data:image/png;base64,...base 64 stuff....'
    im = Image.open(BytesIO(imgdata))
    return im


class CustomNamespace(socketio.ClientNamespace):

    def on_connect(self):
        self.emit("joinRoom",callback=lambda msg:print(msg), 
              data={"room":"pyObj"})
        pass

    def on_disconnect(self):
        pass
        
    def on_reciveRenderedImg(self, data):
        print("recived img")
        self.client.storeImg(data['imgURI'], data['time'])

class StDoGClient(socketio.Client):
    def __init__(self, 
                 namespace=None,saveImgHistory=False):
        super().__init__()
        
        self.imgURI = {} 
        self.saveImgHistory = saveImgHistory
        
    def external(self, address='http://localhost:5000', namespace=""):
        self.register_namespace(CustomNamespace(namespace))
        self.connect(address, headers={}, )

    # TODO: this should create a flask server and conect with
    def start(self):
        pass
        
    def sendGraph(self, g):
        self.dataViz = ig2vis(g)
        self.emit("newGraph", callback=lambda msg:print(msg), 
                  data=self.dataViz)
        

    def storeImg(self, imgURI, time):
    
        if self.saveImgHistory:
            self.imgURI[time]=imgURI
        else:
            self.imgURI[time]=imgURI
        
    def getImg(self, historyId=0):
        i = np.sort(list(self.imgURI.keys()))[::-1][historyId]
        img = b64toImg(self.imgURI[i])
        self.img = img
        return img

    def updateNodeColors(self, colors):
        colors = list(colors.flatten())
        self.emit("updateNodeColors", data={'colors':colors})
    
    def renderMyImg(self, width=200, height=200, transparency=True):
        self.emit("renderMyImg", callback=lambda msg:print(msg), 
                  data={
                    "width":width, "height":height,
                    "transparency":transparency,
                    "time":time.time(),
                  })
            
