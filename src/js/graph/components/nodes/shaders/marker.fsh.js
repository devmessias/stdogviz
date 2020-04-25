//const sdfFunctions = `
//vec3 sdfCircle(vec2 p, float s){
    //float edgeWidth = 1/2.;
    //float minSdf = 0.5;
    //float sdf = -length(p) + s;
    //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfSquare(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfDiamond(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfTriangle(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfPentagon(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfHexagon(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfS6(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfProduct(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//vec3 sdfCross(vec2 p, float s){
 //return vec3(sdf, minSdf, edgeWidth);
//}

//`
const distFunctions = {
    'o': `
        edgeWidth = edgeWidth/2.;
        float minSdf = 0.5;
        sdf = -length(p) + s;
    `,
    's': `

        edgeWidth = edgeWidth/2.;
        float minSdf = 0.5/2.0;
        vec2 d = abs(p) - vec2(s, s);
        sdf = -length(max(d,0.0)) - min(max(d.x,d.y),0.0);
    `,
    'd':`

        edgeWidth = edgeWidth/4.;
        float minSdf = 0.5/2.0;
        vec2 b  = vec2(s, s/2.0);
        vec2 q = abs(p);
        float h = clamp((-2.0*ndot(q,b)+ndot(b,b))/dot(b,b),-1.0,1.0);
        float d = length( q - 0.5*b*vec2(1.0-h,1.0+h) );
        sdf = -d * sign( q.x*b.y + q.y*b.x - b.x*b.y );
    `,
    '^':`
        float l = s/1.5;
        float minSdf = 1000.0;
        float k = sqrt(3.0);
        p.x = abs(p.x) - l;
        p.y = p.y + l/k;
        if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
        p.x -= clamp( p.x, -2.0*l, 0.0 );
        sdf = length(p)*sign(p.y);
    `,
    'p':`
        edgeWidth = edgeWidth/4.;
        float minSdf = 0.5/2.0;
        float r = s/2.0;
        const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
        p.x = abs(p.x);
        p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
        p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
        p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);
        sdf = -length(p)*sign(p.y);
    `,
    'h':`

        edgeWidth = edgeWidth/4.;
        float minSdf = 0.5/2.0;
        float r = s/2.0;
        const vec3 k = vec3(-0.866025404,0.5,0.577350269);
        p = abs(p);
        p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
        p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
        sdf = -length(p)*sign(p.y);
    `,
    's6':`

        float minSdf = 0.5/2.0;
        edgeWidth = edgeWidth/4.;
        float r = s/2.0;
        const vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
        p = abs(p);
        p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
        p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
        p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
        sdf = -length(p)*sign(p.y);
    `,
    'x':`

        edgeWidth = edgeWidth/8.;
        float minSdf = 0.5/4.0;

        float r = s/4.0;
        float w = 0.5;
        p = abs(p);
        sdf = -length(p-min(p.x+p.y,w)*0.5) + r;
    `,
    '+':`

        edgeWidth = edgeWidth/4.;

        float minSdf = 0.5/2.0;
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
function getDistFunction(marker){
    const exist = Object.keys(distFunctions).includes(marker);
    if (!exist)
        marker = 'o'

    return distFunctions[marker]
}

function getShading(marker){
    let shadingStr = ''
    if (marker != '3do')
        return '';

    shadingStr = `
        // shading

        vec3 normal = normalize(vec3(p.xy, sdf));
        vec3 direction = normalize(vec3(1.0, 1.0, 1.0));
        float diffuse = max(0.0, dot(direction, normal));
        float specular = pow(diffuse, 25.0);
        color = vec3(max(diffuse*color, specular*vec3(1.0)));
    `
    return shadingStr;


}


export function getMarkerFragmentShader(marker, nodesGroupName='main'){
    console.info(marker)
    return  `
    precision highp float;

    #define SHADER_NAME MarkerNode_${nodesGroupName}

    varying vec3 vColor;
    varying float vOpacity;
    varying float vEdgeWidth;
    varying vec3 vPos;
    varying vec3 vEdgeColor;

    float ndot(vec2 a, vec2 b ) {
        return a.x*b.x - a.y*b.y;
    }
    void main() {

        vec3 color = vColor;
        vec3 edgeColor = vEdgeColor;
        float edgeWidth = vEdgeWidth;
        vec2 p = vPos.xy;
        float opacity = vOpacity;

        float s = 0.5;
        float sdf = 0.0;
        ${getDistFunction(marker)}
        if (sdf<0.0) discard;

        float edge0 = 0.0;
        float edge1 = minSdf;
        float opacity2 = opacity;
        //if (opacity<1.0) opacity2 =  clamp((sdf - edge0) / (edge1 - edge0), 0.01, opacity) + 0.1;
        ${getShading(marker)}

        vec4 rgba = vec4(  color, opacity2 );


        if (edgeWidth > 0.0){
            if (sdf < edgeWidth)  rgba  = vec4(edgeColor, 1.0);
        }

        gl_FragColor = rgba;

    }
    `
}

export const availableMarkers = ['o', '3do', 's', 'd', '^' , 'p', 'h', 's6', '+', 'x'];
