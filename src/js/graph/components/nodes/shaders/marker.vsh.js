
export function getMarkerVertexShader(fixedNodeSize=false, fixedColor=false){
    console.info("Get Marker Vertex Shader");
    let markerVertexShader = `
    precision highp float;

    #define SHADER_NAME MarkerImgNode

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    attribute vec3 position;
    attribute vec2 uv;

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
    uniform float useDiffuse2Shadow;
    uniform float edgeWidth;
    uniform vec3 edgeColor;

    varying vec3 vColor;
    varying vec3 vEdgeColor;
    varying vec3 vPos;
    varying vec2 vUv;
    varying float vUseDiffuse2Shadow;
    varying float vOpacity;
    varying float vEdgeWidth;

    void main() {

        vec4 viewNodePos = modelViewMatrix * vec4( bufferNodePositions, 1.0 );

        vec4 mvPosition = viewNodePos +  vec4(position*bufferNodeScale*bufferNodeSize, 0);

        gl_Position = projectionMatrix * mvPosition;

        vUv = uv;

        vColor = bufferColors;
        vOpacity = bufferOpacity;
        vUseDiffuse2Shadow = useDiffuse2Shadow;
        vec4 vPos2 = viewMatrix*vec4(bufferNodePositions, 1.0);
        vPos = position;
        vEdgeWidth = edgeWidth;
        vEdgeColor = edgeColor;
    }

    `
    return markerVertexShader;

}

