// SCENE
window.scene = new THREE.Scene()
var container, scene, camera, renderer, controls;

// INITIALIZE
(function () {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );
  scene.add( new THREE.AmbientLight( 0x8FBCD4, 0.4 ) );

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.x = 3;
  camera.position.y = 3;
  camera.position.z = 5;
  scene.add( camera );

  renderer = new THREE.WebGLRenderer({antialias:true})
  renderer.setSize( window.innerWidth, window.innerHeight );
  // renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  // renderer.setClearColor(new THREE.Color(0xf7f8f9, 1.0))
  container = document.getElementById( 'container' );
  container.appendChild(renderer.domElement);

  // CONTROLS
  controls = new THREE.OrbitControls( camera, container );

  // LIGHT
  // var light = new THREE.DirectionalLight(0x444444, 1)
  // light.position.set(0, 0, 1).normalize()
  // scene.add(light)
  var pointLight = new THREE.PointLight( 0xffffff, 1 );
  camera.add( pointLight );

  // GRID
  // var grid1 = new THREE.GridHelper(SCREEN_WIDTH / 2, 6)
  // grid1.rotation.x = Math.PI / 2
  // // grid1.setColors(0x444444, 0xe1e2e3)
  // scene.add(grid1)

  // var grid2 = new THREE.GridHelper(SCREEN_WIDTH / 2, 30)
  // grid2.rotation.x = Math.PI / 2
  // // grid2.setColors(0x444444, 0xc1c2c3)
  // scene.add(grid2)
})()
animate()

function animate () {
  requestAnimationFrame(animate)
  render()
  update()
}

function update () {
  controls.update()
  // stats.update()
}

function render () {
  camera.lookAt(scene.position);
  camera.updateMatrixWorld();
  renderer.render(scene, camera)
}