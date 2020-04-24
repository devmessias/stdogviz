
const distFunctions = {
    'o': `
        sdf = -length(p) + s;
    `,
    's': `
        vec2 d = abs(p) - vec2(s, s);
        sdf = -length(max(d,0.0)) - min(max(d.x,d.y),0.0);
    `,
    'd':`
        vec2 b  = vec2(s, s/2.0);
        vec2 q = abs(p);
        float h = clamp((-2.0*ndot(q,b)+ndot(b,b))/dot(b,b),-1.0,1.0);
        float d = length( q - 0.5*b*vec2(1.0-h,1.0+h) );
        sdf = -d * sign( q.x*b.y + q.y*b.x - b.x*b.y );
    `,
    '^':`
        float l = s/1.5;
        float k = sqrt(3.0);
        p.x = abs(p.x) - l;
        p.y = p.y + l/k;
        if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
        p.x -= clamp( p.x, -2.0*l, 0.0 );
        sdf = length(p)*sign(p.y);
    `,
    'p':`
        float r = s/2.0;
        const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
        p.x = abs(p.x);
        p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
        p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
        p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);
        sdf = -length(p)*sign(p.y);
    `,
    'h':`
        float r = s/2.0;
        const vec3 k = vec3(-0.866025404,0.5,0.577350269);
        p = abs(p);
        p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
        p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
        sdf = -length(p)*sign(p.y);
    `,
    's6':`
        float r = s/2.0;
        const vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
        p = abs(p);
        p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
        p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
        p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
        sdf = -length(p)*sign(p.y);
    `,
    'x':`
        float r = s/4.0;
        float w = 0.5;
        p = abs(p);
        sdf = -length(p-min(p.x+p.y,w)*0.5) + r;
    `,
    '+':`
        float r = s/15.0; //corner radius
        vec2 b = vec2(s/1.0, s/3.0); //base , size
        //vec2 b = vec2(r, r);
        p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;
        vec2  q = p - b;
        float k = max(q.y,q.x);
        vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);
        sdf = -sign(k)*length(max(w,0.0)) - r;
    `

}

export function getMarkerFragmentShader(symbol){
    return  `
    precision highp float;
    #define SHADER_NAME MarkerNode

    varying vec3 vColor;
    varying float vOpacity;
    varying vec3 vPos;

    float ndot(vec2 a, vec2 b ) {
        return a.x*b.x - a.y*b.y;
    }
    void main() {

        vec3 color = vColor;
        vec2 p = vPos.xy;
        float opacity = vOpacity;

        float s = 0.5;
        float sdf = 0.0;
        ${distFunctions[symbol]}
        float edge0 = 0.0;
        float edge1 = 1.0;
        opacity = 1.0;
        float opacity2 =  clamp((sdf - edge0) / (edge1 - edge0), 0.0, opacity)+0.5;
        //float opacity2 =  clamp((sdf - edge0) / (edge1 - edge0), opacity/4.0, opacity);
        vec4 rgba = vec4(  color, opacity2 );
        //vec4 rgba = vec4(  color, 1 );
        //if (sdf < 0.1 && sdf > 0.05)  rgba  = vec4(0., 0., 0., opacity);
        if (sdf < 0.1)  rgba  = vec4(0., 0., 0., opacity2);
        //if (sdf <= 0.05)  rgba  = vec4(0., 0., 0., opacity2);
        //if (sdf < 0.1) rgba  = vec4(color, opacity);
        gl_FragColor = rgba;

        if (sdf<0.0) discard;
    }
    `
}
