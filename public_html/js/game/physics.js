/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var CONSTANT_G = 981;
var CONSTANT_GRAV = 0.00000000006;
var CONSTANT_METER_PER_PIXEL = 1;

/**
 * Not pure function, it modifies the objects
 * positions to simule physical result of interactions.
 * 
 * Consider that world bound are perfectly elastic
 * 
 * @param array of arrays :
 *          [ {object: ob1, mass : m1}, {object: ob2, mass : m2} ]
 * @param boolean : enable gravitation between objects.
 * @param boolean : attraction to the bottom.
 * @return function to use at each tick
 */
function physic_motor (elements, universal_gravitation, earth_gravitation) {
    var bounds;
    // Defines objects variables
    for (var i = 0; i < elements.length; i++) {
        elements[i].is_free_to_move = true;
        elements[i].speed = {   x: 0, y: 0};
        elements[i].acc =   {x: 0, y: 0};
        elements[i].force = {x: 0, y: 0};
        elements[i].real_coord = {  x: elements[i].object.x, 
                                    y: elements[i].object.y};
        bounds = elements[i].object.getBounds();
        elements[i].center = {  x: bounds.width, 
                                y: bounds.height};
    }
    
    // Return the function to perform at each tick
    return function () {
        // Compute the force of the objects
        function compute_force_from_gravitation() {
            for (var i = 0; i < elements.length; i++) {
                elements[i].force = {x: 0, y: 0};
            }
            for (var i = 0; i < elements.length; i++) {
                for (var j = i + 1; j < elements.length; j++) {
                    // Compute all the importants constants
                    // rx
                    var x_side_diff = 
                            (   elements[i].object.x - 
                                elements[j].object.x)*
                            CONSTANT_METER_PER_PIXEL;
                    // ry
                    var y_side_diff = 
                            (   elements[i].object.y - 
                                elements[j].object.y)*
                            CONSTANT_METER_PER_PIXEL;
                    // r * r
                    var hypothenuse_square = 
                              ((    Math.abs(x_side_diff) * 
                                    Math.abs(x_side_diff))+
                               (    Math.abs(y_side_diff) * 
                                    Math.abs(y_side_diff)));
                    // r
                    var hypothenuse = 
                            Math.sqrt(hypothenuse_square);
                    // F = G * m1 * m2 / (r * r)
                    if (hypothenuse >= 2) {
                        var attraction_force =
                                   CONSTANT_GRAV *
                                   elements[i].mass * elements[j].mass / 
                                   hypothenuse_square;
                        // Sinus r
                        var sin_ij = 
                                y_side_diff / hypothenuse;
                        // Cosinus r
                        var cos_ij = 
                                x_side_diff / hypothenuse;

                        // Sum the forces
                        elements[i].force.x += 
                                attraction_force * -cos_ij;
                        elements[i].force.y += 
                                attraction_force * -sin_ij;
                        elements[j].force.x += 
                                attraction_force * cos_ij;
                        elements[j].force.y += 
                                attraction_force * sin_ij;
                    }
                }
            }
        };
        
        // Compute the collision between objects and wall
        function compute_collision() {
            for (var i = 0; i < elements.length; i++) {
                // Compute collision with wall
                if ((elements[i].object.x
                        - elements[i].center.x) <= 0) {
                    elements[i].speed.x = 
                            Math.abs(elements[i].speed.x);
                    elements[i].real_coord.x = 
                        elements[i].object.x = 
                            elements[i].center.x + 1;
                }
                else if ((elements[i].object.x + 
                        elements[i].center.x) >= world_width) {
                    elements[i].speed.x = 
                            - Math.abs(elements[i].speed.x);
                    elements[i].real_coord.x = 
                        elements[i].object.x = 
                            world_width - elements[i].center.x - 1;
                }
                if ((elements[i].object.y
                        - elements[i].center.y) <= 0) {
                    elements[i].speed.y = 
                            Math.abs(elements[i].speed.y);
                    elements[i].real_coord.y = 
                        elements[i].object.y = 
                            elements[i].center.y + 1;
                }
                else if((elements[i].object.y + 
                        elements[i].center.y) >= world_height) {
                    elements[i].speed.y = 
                            - Math.abs(elements[i].speed.y);
                    elements[i].real_coord.y = 
                        elements[i].object.y =
                                world_height - elements[i].center.y - 1;
                }
            }
        };
        
        // Define the time elpsed for last tick
        var elapsed_time = world_ticker.getInterval () / 1000;
        // Compute result for each object
        if (universal_gravitation) {
            compute_force_from_gravitation();
        } 
        if (earth_gravitation) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].force.y = CONSTANT_G * elements[i].mass;
            }
        }
        for (var i = 0; i < elements.length; i++) {
            // Compute the acceleration from the force
            elements[i].acc.x = 
                    elements[i].force.x / elements[i].mass;
            elements[i].acc.y = 
                    elements[i].force.y / elements[i].mass;
            // Compute the variation of the speed from acceration
            elements[i].speed.x += 
                    elements[i].acc.x * elapsed_time;
            elements[i].speed.y += 
                    elements[i].acc.y * elapsed_time;
            compute_collision();
            // Computer the real position of the objects
            elements[i].real_coord.x += 
                    (elements[i].speed.x * elapsed_time) 
                    / CONSTANT_METER_PER_PIXEL;
            elements[i].real_coord.y += 
                    (elements[i].speed.y * elapsed_time) 
                    / CONSTANT_METER_PER_PIXEL;
            
            if (elements[i].is_free_to_move) {
                // Compute word position of the objects
                elements[i].object.x = 
                        Math.floor(elements[i].real_coord.x);
                elements[i].object.y = 
                        Math.floor(elements[i].real_coord.y);
            }
        }
    };
    
}