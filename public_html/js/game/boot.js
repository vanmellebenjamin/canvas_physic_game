/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var PATH_TO_ROOT = "http://localhost/HTML5Application/public_html/";

var world_width = 900;
var world_height = 640;
var world_ticker = createjs.Ticker;
var world;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;

var objects;

// Refresh fun
function handleTick(event) {
        compute_next_world_state();
        world.update();
}

function drag_and_drop(object) {
    object.addEventListener("mousedown", function(evt) {
        // bump the target in front of its siblings:
        var o = evt.target;
        o.parent.addChild(o);
        objects[1].is_free_to_move = false;
        evt.addEventListener("mouseup", function(evt) {
            objects[1].is_free_to_move = true;
            objects[1].object.x = evt.stageX + o.offset.x;
            objects[1].object.y = evt.stageY + o.offset.y;
            objects[1].real_coord.x = evt.stageX + o.offset.x;
            objects[1].object.y = evt.stageY + o.offset.y;
            objects[1].real_coord.y = evt.stageY + o.offset.y;
        });
        o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};
    });

    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    object.addEventListener("pressmove", function(evt) {
        var o = evt.target;
        o.x = evt.stageX+ o.offset.x;
        o.y = evt.stageY+ o.offset.y;
        // indicate that the stage should be updated on the next tick:
    });
    
    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    
}

$( document ).ready(function() {
    // Init engine
    world = new createjs.Stage("myCanvas");
    var image = event.target;
    var container = new createjs.Container();
    world.addChild(container);

    var background = new createjs.Bitmap(PATH_TO_ROOT + "img/space.jpg");
    
    world.addChild(background);
    // create a shape that represents the center of the daisy image:
    var hitArea = new createjs.Shape();
    hitArea.graphics.beginFill("#FFF").drawEllipse(-11,-14,24,18);
    // position hitArea relative to the internal coordinate system of the target bitmap instances:
    hitArea.x = image.width / 2;
    hitArea.y = image.height / 2;
     
    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(world);
    
    // enabled mouse over / out events
    world.enableMouseOver(10);
    // keep tracking the mouse even when it leaves the canvas
    world.mouseMoveOutside = true;
       
    // Defines three world objects
    var circle_A = new createjs.Shape();
    circle_A.graphics.beginFill("red").drawCircle(0, 0, 8);
    circle_A.x = 300;
    circle_A.y = 150;
    circle_A.setBounds(250, 250, 10, 10);
    world.addChild(circle_A);
    var circle_B = new createjs.Shape();
    //var circle_B = new createjs.Bitmap(PATH_TO_ROOT + "img/earth.jpg");
    //circle_B.setTransform(100, 100, 0.1, 0.1);
    circle_B.graphics.beginFill("blue").drawCircle(0, 0, 12);
    circle_B.x = 450;
    circle_B.y = 320;
    circle_B.setBounds(500, 250, 10, 10);
    circle_B.cursor = "pointer";
    circle_B.hitArea = hitArea;
    world.addChild(circle_B);
    var circle_C = new createjs.Shape();
    circle_C.graphics.beginFill("green").drawCircle(0, 0, 6);
    circle_C.x = 600;
    circle_C.y = 300;
    circle_C.setBounds(300, 250, 10, 10);
    world.addChild(circle_C);
    var circle_D = new createjs.Shape();
    circle_D.graphics.beginFill("white").drawCircle(0, 0, 3);
    circle_D.x = 250;
    circle_D.y = 400;
    circle_D.setBounds(300, 250, 10, 10);
    world.addChild(circle_D);
    
    drag_and_drop(circle_B);
    world.update();
    
    // Get physic function which compute the
    // state ofthe world at each tick
    objects = [ {object: circle_A, mass : 500000000000}, 
                {object: circle_B, mass : 400000000000000},
                {object: circle_C, mass : 3500000000000},
                {object: circle_D, mass : 1500000000000}];
    compute_next_world_state = 
            physic_motor(objects, true, false);
    
    world_ticker.setFPS(30);
    // Update world will render next frame
    world_ticker.addEventListener("tick", handleTick);
    // compute_next_world_state();
});
