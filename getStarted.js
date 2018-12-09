var container, camera, scene, renderer;

scene = new THREE.Scene();
scene.background = new THREE.Color( 0x8FBCD4 );
scene.add( new THREE.AmbientLight( 0x8FBCD4, 0.4 ) );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
scene.add( camera );

container = document.getElementById( 'container' );
var controls = new THREE.OrbitControls( camera, container );

var pointLight = new THREE.PointLight( 0xffffff, 1 );
camera.add( pointLight );

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// OrbitControls: For Draging support
container.appendChild( renderer.domElement );
// Event listener: resize window
window.addEventListener( 'resize', onWindowResize, false );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var options = {
    velx: 0,
    vely: 0,
    camera: {
    speed: 0.0001
    },
    stop: function() {
    this.velx = 0;
    this.vely = 0;
    },
    reset: function() {
    this.velx = 0.01;
    this.vely = 0.01;
    camera.position.z = 5;
    camera.position.x = 0;
    camera.position.y = 0;
    cube.scale.x = 1;
    cube.scale.y = 1;
    cube.scale.z = 1;
    cube.material.wireframe = true;
    }
};

// DAT.GUI Related Stuff

var gui = new dat.GUI();

var box = gui.addFolder('Cube');
box.add(cube.scale, 'x', 0, 10).name('Width').listen();
box.add(cube.scale, 'y', 0, 10).name('Height').listen();
box.add(cube.scale, 'z', 0, 10).name('Depth').listen();
box.add(cube.material, 'wireframe').listen();
box.open();

var velocity = gui.addFolder('Velocity');
velocity.add(options, 'velx', -0.2, 0.2).name('X').listen();
velocity.add(options, 'vely', -0.2, 0.2).name('Y').listen();
velocity.open();

gui.add(options, 'stop');
gui.add(options, 'reset');

var render = function () {
    requestAnimationFrame( render );

    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    cube.rotation.x += options.velx;
    cube.rotation.y += options.vely;

    renderer.render( scene, camera );
};

render();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}