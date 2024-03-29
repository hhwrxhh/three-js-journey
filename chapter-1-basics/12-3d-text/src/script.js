import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/3.png')
const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
let donutArray = []

// font loader
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_bold.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Any Text', 
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3 
            }
        )
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - textGeometry.boundingBox.max.x * 0.5,
        //     - textGeometry.boundingBox.max.y * 0.5,
        //     - textGeometry.boundingBox.max.z * 0.5
        // )
        textGeometry.center()
       
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
       
        for (let i = 0; i < 200; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)
            let pos = (Math.random() - 0.5) * 20
            donut.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
            
            donut.rotation.x = Math.PI * Math.random()
            donut.rotation.y = Math.PI * Math.random()
            
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            donutArray.push(donut)
            scene.add(donut)
            
        }
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
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
    const elapsedTime = clock.getElapsedTime()

    let donut;
    let pos = Math.round(Math.random() * 10)
    for (donut of donutArray) {
        donut.rotation.x += 0.02  
        donut.rotation.z += 0.02  
        // donutArray[pos].position.y = Math.sin(elapsedTime);
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()