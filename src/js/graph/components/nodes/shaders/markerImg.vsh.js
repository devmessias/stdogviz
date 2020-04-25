
export default function getMarkerImgVertexShader(fixedNodeSize=false, fixedColor=false){
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

    varying vec3 vColor;
    varying vec2 vUv;
    varying float vUseDiffuse2Shadow;
    varying float vOpacity;

    void main() {

        vec4 viewNodePos = modelViewMatrix * vec4( bufferNodePositions, 1.0 );

        vec4 mvPosition = viewNodePos +  vec4(position*bufferNodeScale*bufferNodeSize, 0);

        gl_Position = projectionMatrix * mvPosition;

        vUv = uv;

        vColor = bufferColors;
        vOpacity = bufferOpacity;
        vUseDiffuse2Shadow = useDiffuse2Shadow;
    }

    `
    return markerVertexShader;

}

