import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })


// axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const group = new THREE.Group()
scene.add(group)
for (let i = 0; i < 3; i++) {
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5), 
        new THREE.MeshBasicMaterial({color: 0x00ff00})
    )
    cube.position.x = i;
    group.add(cube)
}
group.scale.y = 2
group.rotation.x = Math.PI * 0.25

/**
 * Sizes
*/
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)