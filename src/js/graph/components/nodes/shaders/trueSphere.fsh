varying vec3 vCenter;
varying float vRadius;

varying vec3 vColor;
varying float vOpacity;


void main()
{
    vec2 p = (gl_FragCoord.xy - vCenter.xy)/vRadius;
    float z = 1.0 - length(p);
    if (z < 0.0) discard;

    gl_FragDepth = 0.5*vCenter.z + 0.5*(1.0 - z);

    vec3 color = vColor;
    float opacity = vOpacity;
    vec3 normal = normalize(vec3(p.xy, z));
    vec3 direction = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(0.0, dot(direction, normal));
    float specular = pow(diffuse, 24.0);
    gl_FragColor = vec4(max(diffuse*color, specular*vec3(1.0)), opacity);
}
