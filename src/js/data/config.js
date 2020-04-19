
export default {
    address: "127.0.0.1:6688" ,
    scene: {
        color: 0xe9e9ff
    },
    isDev: true,
    render:{
        antialias: true,
    },
    isShowingStats: true,
    isLoaded: false,
    isMouseMoving: false,
    isMouseOver: false,
    maxAnisotropy: 2,
    dpr: 1,
    layers:{
        0:{},
        1:{
            enabled:true,

            clearColor: 0x000000,
            exposure: 1,
            strength: 0.5,
            bloomStrength: 5,
            bloomThreshold: 0,
            bloomRadius: 0,
        } ,
        2:{},
        3:{

            enabled:false,
            exposure: 1,

            clearColor: 0x000000,
            strength: 0.5,
            bloomStrength: 5,
            bloomThreshold: 0,
            bloomRadius: 0,
				scene: "Scene with Glow"
        } ,
    },
    nodes: {
        material: "fast",
        scale:1,
        show: true,
        radius: .5,
        color: 0x0000ff,
        roughness: 0.5,
        opacity: 1,

    },
    edges: {
        show: true,
        color: 0x0000ff,
        roughness: 0.5,
        opacity: 1,

    },

    fog: {
        color: 0xffffff,
        near: 0.0008
    },
    camera: {
        fov: 40,
        near: 2,
        far: 1000,
        aspect: 1,
        posX: 0,
        posY: 30,
        posZ: 40
    },
    controls: {
        autoRotate: false,
        autoRotateSpeed: -0.5,
        rotateSpeed: 0.5,
        zoomSpeed: 0.8,
        minDistance: 0,
        maxDistance: 600,
        minPolarAngle:0,
        maxPolarAngle: Math.PI ,
        minAzimuthAngle: -Infinity,
        maxAzimuthAngle: Infinity,
        enableDamping: true,
        dampingFactor: 0.5,
        enableZoom: true,
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
};
