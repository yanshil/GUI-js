// =========================Axis Helper =============
// The X axis is red. The Y axis is green. The Z axis is blue.
var axisHelper = new THREE.AxesHelper( 5 );
scene.add( axisHelper );
axisHelper.visible = false;

// ================== Grid ================
//grid xz
var gridXZ = new THREE.GridHelper(10, 10);
scene.add(gridXZ);
gridXZ.visible = false;

//======================= GUI Folder ====================
// Custom Global Variables
var parameters, gui;
var cube;

// ================ Global ID variable ==================
var objectID = 0, cylinderID = 0;

var cld_group = new THREE.Group();

var gui_cld;
var gui_cld_list = [];

var cubeCSG, resultCSG, resultMesh;
//=======================================================
// Emscripten

var canvas = document.getElementById("canvas");
//make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//show Emscripten environment where the canvas is
var Module = {};
Module.canvas = canvas;

//bindings to C++ functions
var getNewX = Module.cwrap('setXposition', 'number', ['number']);


//===================================

function initGUI()
{
    parameters = {
        material: "Phong",
        cube: {
            width:3,
            height:1,
            depth:5,
        },
        cylinder: {
            position_x: 0.0,
            position_y: 0.0,
            position_z: 0.0,
            radius: 1.0,
            mesh_segments:32,
        },

        renderBox: function() {
            removeAllCylinders();
            cubeGeometry(this.cube.width, this.cube.height, this.cube.depth);
        },
        addCylinder: function() {
            cylinderGeometry(this.cylinder.radius, this.cube.height, this.cylinder.mesh_segments, 
                this.cylinder.position_x, this.cylinder.position_y, this.cylinder.position_z);
        },
        removeAllCylinder: function() {
            removeAllCylinders();
            cubeGeometry(this.cube.width, this.cube.height, this.cube.depth);
        },
        camera: {
            speed: 0.0001
        },
        reset: function() {
            camera.position.z = 5;
            camera.position.x = 3;
            camera.position.y = 3;
            this.camera.speed = 0.0001;
            axisHelper.visible = false;
            gridXZ.visible = false;
        },
        export2OBJ: function(){
            export2OBJ();
        },
        testCpp: function() {
            var newX = getNewX(this.cube.width, cube.position.x);
            console.log(newX);
        } 
    };

    gui = new dat.GUI();

    gui.add(parameters, 'testCpp')

    // Box
    var boxxx = gui.addFolder('Box');
    boxxx.add(parameters.cube, 'width').name('width');
    boxxx.add(parameters.cube, 'height').name('height');
    boxxx.add(parameters.cube, 'depth').name('depth');
    var globalMaterial = boxxx.add( parameters, 'material', [ "Basic", "Lambert", "Phong", "Wireframe" ] ).name('Material Type').listen();
	globalMaterial.onChange(function(value) 
	{
        if(resultMesh === undefined)
        {
            return;
        }
        else
        {
            resultMesh.material = getGlobalMaterial();
        }
    });
    boxxx.add(parameters, 'renderBox').name('(Re)Render Box');
    boxxx.open();

    // Cylinder
    var cylinder = gui.addFolder('Cylinder');
    cylinder.add(parameters.cylinder, 'position_x').name('x');
    cylinder.add(parameters.cylinder, 'position_y').name('y (no use)');
    cylinder.add(parameters.cylinder, 'position_z').name('z');
    cylinder.add(parameters.cylinder, 'radius').name('radius');
    cylinder.add(parameters.cylinder, 'mesh_segments').name('face segments');
    cylinder.add(parameters, 'addCylinder').name('Add New Cylinder');
    cylinder.add(parameters, 'removeAllCylinder').name('Remove All Cylinders');

    // Camera
    var cam = gui.addFolder('Camera');
    // cam.add(parameters.camera, 'speed', 0, 0.0010).listen();
    cam.add(camera.position, 'y', 0, 100).listen();
    cam.add(parameters, 'reset');
    cam.close();

    // Scene
    var sce = gui.addFolder('Scene');
    sce.add(axisHelper, 'visible').name('Axis').listen();
    sce.add(gridXZ, 'visible').name('XZ grid').listen();
    
    // gui.add(parameters, 'export2OBJ').name('Export OBJ File');
};

// ============================= Cube ========================

function cubeGeometry(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w, h, d, Math.floor(w), Math.floor(h), Math.floor(d) );
    var material = getGlobalMaterial();
    cube = new THREE.Mesh( geometry, material );

    // Remove last cube if not the very first one
    // Only one cube exist for current scene
    if (objectID > 0) {
        // If not the very first round to create new Cube.
        console.log("Remove object with ID = ", objectID);
        remove(objectID);
    }
    // Assign new ID
    objectID = objectID + 1;
    console.log("Add Object with ID = ", objectID);

    // CSG Object
    cubeCSG = THREE.CSG.fromMesh(cube);
    resultCSG = cubeCSG;
    resultMesh = THREE.CSG.toMesh(resultCSG, material);

    resultMesh.name = objectID;

    scene.add(resultMesh);
};

// Remove Object with GC
function remove(id) {
    v = scene.getObjectByName(id);
    v.material.dispose();
    v.geometry.dispose();
    scene.remove(v);
}

// ===========================
function getGlobalMaterial()
{
    var value = parameters.material;
    var newMaterial;
	if (value == "Basic")
		newMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	else if (value == "Lambert")
		newMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
	else if (value == "Phong")
		newMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
	else // (value == "Wireframe")
        newMaterial = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x00ff00  } );
    
    return newMaterial;
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

// cylinderGeometry(radius, height, heightSements)
function cylinderGeometry(radius, height, cylinder_segments, position_x, position_y, position_z)
{
    if(cylinder_segments < 8)
    {
        alert("Too few face segments may cause problems!");
    }
    var center = new THREE.Vector3( position_x, cube.position.y, position_z );

    // if cylinder outside Box, return with alert
    // Radius cannot larger than SDF
    var d = sdfBox(center);
    
    if((radius > Math.abs(d)) | d > 0)
    {
        alert("Cylinder outside box! Fail to create this cylinder.");
        return;
    }

    // RadiusTop, radiusBottom, height, radialSegments, HeightSegments
    var geometry = new THREE.CylinderGeometry( radius, radius, height, cylinder_segments);
    // var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    var material = getGlobalMaterial();
    var cylinder = new THREE.Mesh( geometry, material );

    // Adjust position
    cylinder.position.x = position_x;
    // cylinder.position.y = position_y;
    cylinder.position.y = cube.position.y;  // Make sure cut through the BOX!
    cylinder.position.z = position_z;

    // Assign new ID
    cylinderID = cylinderID + 1;
    cylinder.name = cylinderID;

    // scene.remove(cld_group);
    cylinder.select = true;
    cld_group.add(cylinder);
    // scene.add(cld_group);
    
    // scene.add( cylinder );
    console.log("Add cylinder with ID = ", cylinderID);

    if (cylinderID == 1) {
        gui_cld = gui.addFolder('Cylinder Groups');
    }

    var tmp = gui_cld.add(cld_group.children[cylinderID-1], 'select').name('ID: '+ (cylinderID)).onChange(function(value){
        updateResultMesh();
    });
    gui_cld_list.push(tmp);
    gui_cld.open();

    // CSG
    updateResultMesh();
};

function updateResultMesh()
{
    resultCSG = cubeCSG;
    for (let i = 0; i < cld_group.children.length; i++) {
        if (cld_group.children[i].select) {
            
            var cylinderCSG = THREE.CSG.fromMesh(cld_group.children[i]);
            resultCSG = resultCSG.subtract(cylinderCSG);
        }
    }

    scene.remove(resultMesh);
    resultMesh = THREE.CSG.toMesh(resultCSG, getGlobalMaterial());
    resultMesh.name = objectID;
    scene.add(resultMesh);
}


//===========================================

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

/**
 * Remove All cylinders from the scene
 */
function removeAllCylinders()
{
    for (var i = cld_group.children.length - 1; i >= 0; i--) {
        var object = cld_group.children[i];
        cld_group.remove(object);

        object.material.dispose();
        object.geometry.dispose();
        // scene.remove(object);
    }
    // Reset CylinderID
    cylinderID = 0;
    gui.removeFolder('Cylinder Groups');
};

// ================= Exporter =========================

function export2OBJ()
{
    // Instantiate an exporter
    var exporter = new THREE.OBJExporter();

    data = exporter.parse(resultMesh);
    console.log(data);
    return data;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

// Start file download.
document.getElementById("info").addEventListener("click", function(){
    // Generate download of hello.txt file with some content
    var text = export2OBJ();
    var filename = "object.obj";
    
    download(filename, text);
}, false);

// ======================= Main Logic ==================================

initGUI();

// Initialize a cube in the page
cubeGeometry(3, 1, 5);