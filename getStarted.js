// Set up scene, camera and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Width, Height and Depth
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var cube1 = new THREE.Mesh( geometry, material );
// when we call scene.add(), the thing we add will be added to the coordinates (0,0,0).
scene.add( cube1 );

camera.position.z = 5;


// Rendering the scene
function animate() {
    requestAnimationFrame( animate );
    
    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;

	renderer.render( scene, camera );
}
animate();

var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function initGUI()
{
    // Set up dat.GUI to control target
    var options = {
        velx: 0,
        vely: 0,
        camera: {
            speed: 0.0001
        },
        stop: function(){
            this.velx = 0;
            this.vely = 0;
        },
        reset: function(){
            this.velx = 0.1;
            this.vely = 0.1;
            cube.scale.x = 1;
            cube.scale.y = 1;
            cube.scale.z = 1;
            cube.material.wireframe = true;
        }
    };

    var gui = new dat.GUI();
    var box = gui.addFolder('Cube');
    box.add(cube.scale, 'x', 0, 3).name('Width').listen();
    box.add(cube.scale, 'y', 0, 3).name('Height').listen();
    box.add(cube.scale, 'z', 0, 3).name('Depth').listen();
    box.add(cube.material, 'wireframe').listen();
    box.open()

    gui.add(options, 'stop');
    gui.add(options, 'reset');
    
}
initGUI();
