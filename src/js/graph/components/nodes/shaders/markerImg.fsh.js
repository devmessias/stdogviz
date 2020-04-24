export const markerImgFragmentShader = `
precision highp float;
#define SHADER_NAME MarkerImgNode
uniform sampler2D map;

varying vec2 vUv;

varying vec3 vColor;
varying float vOpacity;
varying float vUseDiffuse2Shadow;

void main() {

    vec3 color = vColor;
    vec4 diffuseColor = texture2D( map, vUv );

    float opacity = diffuseColor.w*vOpacity;
    gl_FragColor = vec4(
        (1.0 - vUseDiffuse2Shadow)*color + vUseDiffuse2Shadow*diffuseColor.xyz*color,
        opacity
    );
    if (diffuseColor.w< 0.4 ) discard;

}
`
