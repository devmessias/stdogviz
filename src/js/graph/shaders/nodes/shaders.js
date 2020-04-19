export function fragmentShaderFixedColor(c){
    let fragmentShader = `
        varying vec3 vColor;
        varying float vOpacity;

        void main(){
            vec3 color = vec3(${c.r}, ${c.g},${c.b});
            float opacity = vOpacity;
            gl_FragColor = vec4(color, opacity);

        }

        `;
    return fragmentShader
}



export let fragmentShader = `

varying vec3 vColor;
varying float vOpacity;

void main(){
    vec3 color = vColor;
    float opacity = vOpacity;
    gl_FragColor = vec4(color, opacity);

}

`;



export let vertexShader = `
attribute float bufferRadius;
attribute vec3 bufferNodePositions;
attribute vec3 bufferColors;
uniform float bufferOpacity;
uniform float bufferNodeScale;
varying vec3 vColor;
varying float vOpacity;

void main(){

    vec3 pos = vec3(0.);
    pos = position + bufferNodePositions;
    pos *= bufferRadius;
    pos *= bufferNodeScale;

    gl_Position = projectionMatrix* modelViewMatrix * vec4(pos, 1.);

    vColor = bufferColors;
    vOpacity = bufferOpacity;
}

`;
