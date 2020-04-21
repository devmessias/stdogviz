precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;


attribute float bufferRadius;
attribute vec3 bufferNodePositions;
attribute vec3 bufferColors;
uniform float bufferOpacity;
uniform float bufferNodeScale;
varying vec3 vColor;
varying float vOpacity;




void main() {
    vec3 pos = vec3(0.);
    pos = position + bufferNodePositions;
    pos *= bufferRadius;
    pos *= bufferNodeScale;

    gl_Position = projectionMatrix* modelViewMatrix * vec4(pos, 1.);

    vUv = uv;

    vColor = bufferColors;
    vOpacity = bufferOpacity;

}
