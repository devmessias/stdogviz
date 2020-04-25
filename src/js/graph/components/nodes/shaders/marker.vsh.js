
export function getMarkerVertexShader(fixedNodeSize=false, fixedColor=false, nodesGroupName='main'){
    console.info("Get Marker Vertex Shader");
    let markerVertexShader = `

    #define SHADER_NAME MarkerNode_${nodesGroupName}

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    attribute vec3 position;

    attribute vec3 bufferNodePositions;
    `

    if (fixedNodeSize){
        markerVertexShader += 'uniform float bufferNodeSize;'
    }else{
        markerVertexShader += 'attribute float bufferNodeSize;'
    }
    if (fixedColor){
        markerVertexShader += 'uniform vec3 bufferColors;'
    }else{

        markerVertexShader += 'attribute vec3 bufferColors;'
    }

    markerVertexShader += `

    uniform float bufferOpacity;
    uniform float bufferNodeScale;
    uniform float edgeWidth;
    uniform vec3 edgeColor;

    varying vec3 vColor;
    varying vec3 vEdgeColor;
    varying vec3 vPos;
    varying float vOpacity;
    varying float vEdgeWidth;

    void main() {

        vec4 viewNodePos = modelViewMatrix * vec4( bufferNodePositions, 1.0 );

        vec4 mvPosition = viewNodePos +  vec4(position*bufferNodeScale*bufferNodeSize, 0);

        gl_Position = projectionMatrix * mvPosition;


        vColor = bufferColors;
        vOpacity = bufferOpacity;
        vPos = position;
        vEdgeWidth = edgeWidth;
        vEdgeColor = edgeColor;
    }

    `
    return markerVertexShader;

}

