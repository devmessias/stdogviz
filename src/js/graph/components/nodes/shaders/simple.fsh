varying vec3 vColor;
varying float vOpacity;

void main(){
    vec3 color = vColor;
    float opacity = vOpacity;
    gl_FragColor = vec4(color, opacity);

}
