import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js'
/**
 * Base
 */
// Debug
const gui = new GUI()
let global = {}
// loader
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const exrLoader = new EXRLoader()
const textureLoader = new THREE.TextureLoader()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// update all materials
const updateAllMaterial = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial){
            console.log(child)
            child.material.envMapIntensity = global.envMapIntensity
        }
    })
}

// environment map
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1

gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.01)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.01)

global.envMapIntensity = 1
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.1)
    .onChange(updateAllMaterial)

// low dynamic range cube texture
// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png'
// ])
// scene.backgrohttps://skybox.blockadelabs.com/und = environmentMap
// scene.environment = environmentMap

// high dynamic range hdr rgbe
// rgbeLoader.load(
//     '/environmentMaps/blender-2k.hdr', 
//     (environmentMap) => {
//         environmentMap.mapping = THREE.EquirectangularReflectionMapping
//         // scene.background = environmentMap
//         scene.environment = environmentMap
//     }
// )


// HDR EXR 
// exrLoader.load(
//     '/environmentMaps/nvidiaCanvas-4k.exr',
//     (environmentMap) => {
//         environmentMap.mapping = THREE.EquirectangularReflectionMapping
//         scene.background = environmentMap
//         scene.environment = environmentMap
//     }
// )

// LDR
// const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg')
// environmentMap.mapping = THREE.EquirectangularReflectionMapping

// scene.background = environmentMap
// scene.environment = environmentMap
// environmentMap.colorSpace = THREE.SRGBColorSpace

// ground projected skybox
// rgbeLoader.load(
//     '/environmentMaps/2/2k.hdr', 
//     (environmentMap) => {
//         environmentMap.mapping = THREE.EquirectangularReflectionMapping
//         // scene.background = environmentMap
//         scene.environment = environmentMap

//         // skybox
//         const skybox = new GroundProjectedSkybox(environmentMap)
//         skybox.scale.setScalar(50)
//         scene.radius = 120
//         scene.height = 11
//         scene.add(skybox)

//         gui.add(skybox, 'radius', 1, 200, 1).name('skyboxRadius')
//         gui.add(skybox, 'height', 1, 200, 1).name('skyboxHeight')
//     }
// )

// real time envMap
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping

scene.background = environmentMap
environmentMap.colorSpace = THREE.SRGBColorSpace

// donut

const donut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({color: 'pink'})
)
donut.position.y = 3.5
donut.layers.enable(1)
scene.add(donut)

// cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
    256,
    {
        type: THREE.FloatType
    })

scene.environment = cubeRenderTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)
/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1,
        color: 0xaaaaaa
    })
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

// models
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)
        updateAllMaterial()
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // real time
    if (donut) {
        donut.rotation.x = Math.sin(elapsedTime)
        cubeCamera.update(renderer, scene)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()