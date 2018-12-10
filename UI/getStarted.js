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
        cube: {
            width:3,
            height:1,
            depth:5,
            wireframe: true
        },
        cylinder: {
            position_x: 0,
            posision_y: 0,
            radius: 1,
            mesh_segments:32,
        },
        renderBox: function() {
            
            cubeGeometry(this.cube.width, this.cube.height, this.cube.depth);
        },
        addCylinder: function() {
            cylinderGeometry(this.cylinder.radius, this.cube.height, this.cylinder.mesh_segments);
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
    boxxx.add(options.cube, 'width').name('width');
    boxxx.add(options.cube, 'height').name('height');
    boxxx.add(options.cube, 'depth').name('depth');
    // boxxx.add(options.cube, 'wireframe').name('wireframe');
    boxxx.add(options, 'renderBox').name('Render Box');
    boxxx.open();

    // Cylinder
    var cylinder = gui.addFolder('Cylinder');
    cylinder.add(options, 'addCylinder').name('Add New Cylinder');
    cylinder.add(options, 'removeAllCylinder').name('Remove Cylinders');

    // Camera
    var cam = gui.addFolder('Camera');
    // cam.add(options.camera, 'speed', 0, 0.0010).listen();
    cam.add(camera.position, 'y', 0, 100).listen();
    cam.add(options, 'reset');
    cam.close();
    
    gui.add(options, 'export2OBJ');
};

initGUI();

//=================== Obejct List ===============================

// var group = new THREE.Group();

// ============================= Cube ========================

var cubeID = 0, cylinderID = 0;

var box;

function cubeGeometry(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w, h, d, Math.floor(w), Math.floor(h), Math.floor(d) );
    // var geometry = new THREE.BoxGeometry( 3, 1, 5, 3, 1, 5 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );

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
    cube.material.wireframe = true;
    scene.add(cube);
};

// Remove with GC
function remove(id) {
    v = scene.getObjectByName(id);
    v.material.dispose();
    v.geometry.dispose();
    scene.remove(v);
}

//======================= Cylinders =================

var cld_group = new THREE.Group();

var cld;
var cldFolder = [];

// cylinderGeometry(radius, height, heightSements)
function cylinderGeometry(radius, height, cylinder_segments)
{
    // RadiusTop, radiusBottom, height, radialSegments, HeightSegments
    var geometry = new THREE.CylinderGeometry( radius, radius, height, cylinder_segments);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var cylinder = new THREE.Mesh( geometry, material );

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
// // https://threejs.org/docs/#api/en/core/Raycaster
// var raycaster = new THREE.Raycaster();
// var mouse = new THREE.Vector2();

// function cursorPositionInCanvas(canvas, event) {
//     var x, y;

//     canoffset = $(canvas).offset();
//     x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
//     y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

//     return [x,y];
// }

// function onDocumentMouseDown(event) {

//     event.preventDefault();

//     // mouse.x = (cursorPositionInCanvas( renderer.domElement, event )[0]) / $(canvas).width() * 2 - 1;
//     // mouse.y = - (cursorPositionInCanvas( renderer.domElement, event )[1])/ $(canvas).height() * 2 + 1;
//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//     raycaster.setFromCamera( mouse, camera );

//     var intersects = raycaster.intersectObjects(scene.children);

//     console.log(intersects);

//     if (intersects.length > 0) {
//         intersects[ i ].object.material.color.set( 0xff0000 );
//     }
// }

// document.addEventListener('mousedown', onDocumentMouseDown, false);


//========================== Render ================================

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