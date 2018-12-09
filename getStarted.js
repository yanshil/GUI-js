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


//======================= GUI Folder ====================
var options, gui;

function initGUI()
{
    options = {
        camera: {
            speed: 0.0001
        },
        reset: function() {
            camera.position.z = 5;
            camera.position.x = 3;
            camera.position.y = 3;
            this.camera.speed = 0.0001;

            // cube.material.wireframe = true;
            // cylinder.material.wireframe = true;
        }
    };

    gui = new dat.GUI();
    var cam = gui.addFolder('Camera');

    cam.add(options.camera, 'speed', 0, 0.0010).listen();
    cam.add(camera.position, 'y', 0, 100).listen();
    cam.open();  

    gui.add(options, 'reset');
};

initGUI();

// ============================= Cube ========================

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



var cubeID = 0;
var box;

function cubeGeometry(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w, h, d, Math.floor(w), Math.floor(h), Math.floor(d) );
    // var geometry = new THREE.BoxGeometry( 3, 1, 5, 3, 1, 5 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    
    // Remove last cube
    if (cubeID == 0) {
        box = gui.addFolder('Cube');
    }
    if (cubeID > 0) {
        // If not the very first round to create new Cube.
        console.log("Remove Cube with ID = ", cubeID);
        box.remove(cubewireframe);
        remove(cubeID);
    }
    // Assign new ID
    cubeID = cubeID + 1;
    console.log("Add Cube with ID = ", cubeID);
    cube.name = cubeID;    
    scene.add(cube);

    cubewireframe = box.add(cube.material, 'wireframe').listen();

};

function remove(id) {
    scene.remove(scene.getObjectByName(id));
}

var cld;
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

    cld = gui.addFolder('Cylinder');
    cldwireframe = cld.add(cylinder.material, 'wireframe').listen();
};

var render = function () {
    requestAnimationFrame( render );

    // var timer = Date.now() * options.camera.speed;

    // camera.position.x = Math.cos(timer);
    // camera.position.z = Math.sin(timer);

    // console.log(camera.position.x, camera.position.y, camera.position.z);

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