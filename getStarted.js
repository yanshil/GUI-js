var container, camera, scene, renderer;

scene = new THREE.Scene();
scene.background = new THREE.Color( 0x8FBCD4 );
scene.add( new THREE.AmbientLight( 0x8FBCD4, 0.4 ) );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 5;
scene.add( camera );

// OR http://davidscottlyons.com/threejs-intro/#slide-40
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


function drawCube()
{
    // TODO
    // Remove the previous drawed cube object
    cube_width = document.getElementById("cube_width").value;
    cube_height = document.getElementById("cube_height").value;
    cube_depth = document.getElementById("cube_depth").value;
    
    console.log(cube_width, cube_height, cube_depth);

    cubeGeometry(cube_width, cube_height, cube_depth);

};

function cubeGeometry(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w, h, d, Math.floor(w), Math.floor(h), Math.floor(d) );
    // var geometry = new THREE.BoxGeometry( 3, 1, 5, 3, 1, 5 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

};

function initGUI()
{
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
        this.velx = 0.0;
        this.vely = 0.0;
        camera.position.z = 5;
        camera.position.x = 3;
        camera.position.y = 3;
        this.camera.speed = 0.0001;

        // cube.material.wireframe = true;
        // cylinder.material.wireframe = true;
        }
    };

    var gui = new dat.GUI();
    var cam = gui.addFolder('Camera');

    cam.add(options.camera, 'speed', 0, 0.0010).listen();
    cam.add(camera.position, 'y', 0, 100).listen();
    cam.open();  

    gui.add(options, 'stop');
    gui.add(options, 'reset');
};

initGUI();


function drawCylinder()
{
    cylinder_radius = document.getElementById("cylinder_radius").value;
    cylinder_height = document.getElementById("cylinder_Height").value;

    cylinderGeometry(cylinder_radius, cylinder_height, 32);
}

// cylinderGeometry(radius, height, heightSements)
function cylinderGeometry(radius, height, heightSements)
{
    // RadiusTop, radiusBottom, height, radialSegments, HeightSegments
    var geometry = new THREE.CylinderGeometry( radius, radius, height, heightSements );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var cylinder = new THREE.Mesh( geometry, material );
    scene.add( cylinder );
};

var render = function () {
    requestAnimationFrame( render );

    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    renderer.render( scene, camera );
};

render();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}