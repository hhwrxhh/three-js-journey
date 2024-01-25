import * as THREE from 'three'
import GUI from 'lil-gui'
import { LatheGeometry } from 'three'
import { floorPowerOfTwo } from 'three/src/math/mathutils'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)  
        particlesMaterial.color.set(parameters.materialColor)  
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// texture
const textureLoader = new THREE.TextureLoader()
const gradienTexture = textureLoader.load('/textures/gradients/5.jpg')
gradienTexture.magFilter = THREE.NearestFilter

// objects 
const objectDistance = 4
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradienTexture
})
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16),
    material
)

mesh1.position.y = - objectDistance * 0
mesh2.position.y = - objectDistance * 1
mesh3.position.y = - objectDistance * 2
scene.add(mesh1, mesh2, mesh3)

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

const sectionMeshes = [mesh1, mesh2, mesh3]

// particles
const count = 1000
const positions = new Float32Array(count * 3)

const particlesGeometry = new THREE.BufferGeometry()
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.01
})
for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    positions[i3] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length 
    positions[i3 + 2] = (Math.random() - 0.5) * 10
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

// lights 
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
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
// group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// scroll
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if (newSection !== currentSection) {
        currentSection = newSection
    }
})

// cursor
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // animate camera
    camera.position.y = - scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY =  - cursor.y *  0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // animate mesh
    for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12
    }
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()