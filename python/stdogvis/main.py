import socketio
from PIL import Image
from io import BytesIO
from base64 import b64decode 


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
        self.client.storeImg(data["imgURI"])

class StDoGClient(socketio.Client):
    def __init__(self, 
                 namespace=None,saveImgHistory=False):
        super().__init__()
        
        self.imgURI = []
        self.saveImgHistory = saveImgHistory
        
    def external(self, address='http://localhost:5000', namespace=""):
        self.register_namespace(CustomNamespace(namespace))
        self.connect(address, headers={}, )

    # TODO: this should create a flask server and conect with
    def start(self):
        pass
        
    def storeImg(self, imgURI):
    
        if self.saveImgHistory:
            self.imgURI.append(imgURI)
        else:
            self.imgURI = [imgURI]
        
    def getImg(self, historyId=0):
        img = b64toImg(self.imgURI[::-1][historyId])
        self.img = img
        return img
    
    def renderMyImg(self, width=200, height=200, transparency=True):
        self.emit("renderMyImg", callback=lambda msg:print(msg), 
                  data={"width":width, "height":height, "transparency":transparency})
            
