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
// Custom Global Variables
var cube;
var w = 3;
var h = 1;
var d = 5;

var geometry = new THREE.BoxGeometry(w, h, d, Math.floor(w), Math.floor(h), Math.floor(d) );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
cube = new THREE.Mesh( geometry, material );

var radius = 1;
var cylinder_segments = 32;
// RadiusTop, radiusBottom, height, radialSegments, HeightSegments
var geometry = new THREE.CylinderGeometry( radius, radius, h, cylinder_segments);
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cylinder = new THREE.Mesh( geometry, material );

var cubeCSG = THREE.CSG.toCSG(cube);
var resultCsg = cubeCSG;

var cylinderCsg = THREE.CSG.toCSG(cylinder);
resultCsg = resultCsg.subtract(cylinderCsg);

var reultGeo = THREE.CSG.fromCSG(resultCsg);

mesh = new THREE.Mesh(reultGeo, material);
scene.add(mesh);


//========================== Render ================================

var render = function () {

    requestAnimationFrame( render );

    // var timer = Date.now() * parameters.camera.speed;

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

// ================= Exporter =========================

function export2PLY()
{
    // Instantiate an exporter
    var exporter = new THREE.PLYExporter();
    // Parse the input and generate the ply output
    exporter.parse(scene, data => console.log(data), { binary: true, excludeAttributes: [ 'color' ] });
}

function export2OBJ()
{
    // Instantiate an exporter
    var exporter = new THREE.OBJExporter();
    // var data = exporter.parse(cube);
    for (let i = 0; i < scene.children.length; i++) {
        data = exporter.parse(scene.children[i]);
        console.log(data);
    }
}