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
var parameters, gui;
var cube;

function initGUI()
{
    parameters = {
        cube: {
            width:3,
            height:1,
            depth:5,
            material: "Wireframe",
        },
        cylinder: {
            position_x: 0,
            position_y: 0,
            position_z: 0,
            radius: 1,
            mesh_segments:32,
        },
        renderBox: function() {
            cubeGeometry(this.cube.width, this.cube.height, this.cube.depth);
        },
        addCylinder: function() {
            cylinderGeometry(this.cylinder.radius, this.cube.height, this.cylinder.mesh_segments, 
                this.cylinder.position_x, this.cylinder.position_y, this.cylinder.position_z);
        },
        removeAllCylinder: function() {
            removeCylinders();
        },
        camera: {
            speed: 0.0001
        },
        reset: function() {
            camera.position.z = 5;
            camera.position.x = 3;
            camera.position.y = 3;
            this.camera.speed = 0.0001;
        },
        export2OBJ: function(){
            export2OBJ();
        }
    };

    gui = new dat.GUI();

    // Box
    var boxxx = gui.addFolder('Boxxx');
    boxxx.add(parameters.cube, 'width').name('width');
    boxxx.add(parameters.cube, 'height').name('height');
    boxxx.add(parameters.cube, 'depth').name('depth');
    var cubeMaterial = boxxx.add( parameters.cube, 'material', [ "Basic", "Lambert", "Phong", "Wireframe" ] ).name('Material Type').listen();
	cubeMaterial.onChange(function(value) 
	{   updateMaterial();   });
    boxxx.add(parameters, 'renderBox').name('Render Box');
    boxxx.open();

    // Cylinder
    var cylinder = gui.addFolder('Cylinder');
    cylinder.add(parameters.cylinder, 'position_x').name('x');
    cylinder.add(parameters.cylinder, 'position_y').name('y (no use)');
    cylinder.add(parameters.cylinder, 'position_z').name('z');
    cylinder.add(parameters.cylinder, 'radius').name('radius');
    cylinder.add(parameters.cylinder, 'mesh_segments').name('face segments');
    cylinder.add(parameters, 'addCylinder').name('Add new cld');
    cylinder.add(parameters, 'removeAllCylinder').name('rm all clds');

    // Camera
    var cam = gui.addFolder('Camera');
    // cam.add(parameters.camera, 'speed', 0, 0.0010).listen();
    cam.add(camera.position, 'y', 0, 100).listen();
    cam.add(parameters, 'reset');
    cam.close();
    
    gui.add(parameters, 'export2OBJ');
};

initGUI();

//=================== Obejct List ===============================

// var group = new THREE.Group();

// ============================= Cube ========================

var cubeID = 0, cylinderID = 0;

function cubeGeometry(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w, h, d, Math.floor(w), Math.floor(h), Math.floor(d) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    updateMaterial();

    // Remove last cube if not the very first one
    // Only one cube exist for current scene
    if (cubeID > 0) {
        // If not the very first round to create new Cube.
        console.log("Remove Cube with ID = ", cubeID);
        remove(cubeID);
    }
    // Assign new ID
    cubeID = cubeID + 1;
    console.log("Add Cube with ID = ", cubeID);
    cube.name = cubeID;
    scene.add(cube);
};

// Remove with GC
function remove(id) {
    v = scene.getObjectByName(id);
    v.material.dispose();
    v.geometry.dispose();
    scene.remove(v);
}

// ========
function updateMaterial()
{
    var value = parameters.cube.material;
    var newMaterial;
	if (value == "Basic")
		newMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	else if (value == "Lambert")
		newMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
	else if (value == "Phong")
		newMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
	else // (value == "Wireframe")
        newMaterial = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x00ff00  } );
    
    cube.material = newMaterial;
}

// 'Fake' SDF. For not calculating the 'y' axis
function sdfBox(point)
{
    // Do not care about y though
    var x= Math.max(point.x - cube.position.x - parameters.cube.width / 2 , 
        cube.position.x - point.x - parameters.cube.width / 2 );
    // var y= Math.max(point.y - cube.position.y - parameters.cube.height / 2 , 
    //     cube.position.y - point.y - parameters.cube.height / 2 );
    var z= Math.max(point.z - cube.position.z - parameters.cube.depth / 2 , 
        cube.position.z - point.z - parameters.cube.depth / 2 );
    // var d = Math.max(x, y, z);
    var d = Math.max(x, z);

    return d;
}

//======================= Cylinders =================

var cld_group = new THREE.Group();

var cld;
var cldFolder = [];

// cylinderGeometry(radius, height, heightSements)
function cylinderGeometry(radius, height, cylinder_segments, position_x, position_y, position_z)
{
    if(cylinder_segments < 8)
    {
        alert("Too few face segments will cause problems!");
    }
    var center = new THREE.Vector3( position_x, cube.position.y, position_z );

    // if cylinder outside Box, return with alert
    // Radius cannot larger than SDF
    var d = sdfBox(center);
    
    if((radius > Math.abs(d)) | d > 0)
    {
        alert("Cylinder outside box! Fail to create this cylinder");
        return;
    }

    // RadiusTop, radiusBottom, height, radialSegments, HeightSegments
    var geometry = new THREE.CylinderGeometry( radius, radius, height, cylinder_segments);
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cylinder = new THREE.Mesh( geometry, material );

    // Adjust position
    cylinder.position.x = position_x;
    // cylinder.position.y = position_y;
    cylinder.position.y = cube.position.y;  // Make sure cut through the BOX!
    cylinder.position.z = position_z;

    // Assign new ID
    cylinderID = cylinderID + 1;
    cylinder.name = cylinderID;

    scene.remove(cld_group);
    cld_group.add(cylinder);
    scene.add(cld_group);
    
    // scene.add( cylinder );
    console.log("Add cylinder with ID = ", cylinderID);

    if (cylinderID == 1) {
        cld = gui.addFolder('Cylinder Groups');
    }

    cld_group.children[cylinderID-1].material.wireframe = true;
    var tmp = cld.add(cld_group.children[cylinderID-1].material, 'wireframe').name('wireframe'+ (cylinderID)).listen();
    cldFolder.push(tmp);
    cld.open();

};

dat.GUI.prototype.removeFolder = function(name) {
    var folder = this.__folders[name];
    if (!folder) {
      return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
}

function removeCylinders()
{
    for (var i = cld_group.children.length - 1; i >= 0; i--) {
        var object = cld_group.children[i];
        cld_group.remove(object);

        object.material.dispose();
        object.geometry.dispose();
        scene.remove(object);
    }
    // Reset CylinderID
    cylinderID = 0;
    gui.removeFolder('Cylinder Groups');
};

//========================= RayCast ================================
// https://threejs.org/docs/#api/en/core/Raycaster

// var raycaster = new THREE.Raycaster();
// var mouse = new THREE.Vector2();

// function onDocumentMouseDown(event) {

//     event.preventDefault();

//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//     raycaster.setFromCamera( mouse, camera );

//     var intersects = raycaster.intersectObjects(scene.children);

//     console.log(intersects);

//     if (intersects.length > 0) {
//         intersects[ 0 ].object.material.color.set( 0xff0000 );
//         console.log(intersects[0]);
//     }
// }

// document.addEventListener('mousedown', onDocumentMouseDown, false);


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