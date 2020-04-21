
varying vec3 vColor;
varying float vOpacity;

uniform sampler2D pointTexture;


void main() {

    vec3 color = vColor;
    float opacity = vOpacity;
    gl_FragColor = vec4(color, opacity);
    
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

    if ( gl_FragColor.a < ALPHATEST ) discard;

}
