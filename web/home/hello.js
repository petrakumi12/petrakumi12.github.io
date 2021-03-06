let width = window.innerWidth; //window width and height
let height = window.innerHeight;

let noCols = Math.ceil(2 * width / 500); //divide by the height or width of shape in css
let noRows = Math.ceil(2 * height / 500); //divide by the height or width of shape in css
let noshapes = noRows * noCols; //total number of shapes that will be generated

window.onload = _ => {

    //generate the shapes that will move assigning different gradients to them
    generateShapes("shape", "yellow-gradient", "#container-1", "shapes-1");
    generateShapes("shape", "blue-gradient", "#container-2", "shapes-2");
    generateShapes("shape", "pink-gradient", "#container-3", "shapes-3");

    //move the containers from original position so we can transition them back to center
    // let moveBy = Math.ceil(width/7);
    let totalMove = 100;
    $("#container-1").css("transform", `translate(-${totalMove}px, 0)`);
    $("#container-2").css("transform", `translate(-${totalMove}px, 0)`);

    //add transitions to the containers
    moveHorizontal("#container-1", 1, totalMove);
    moveHorizontal("#container-2", -1, totalMove);

    setTimeout(function () {
        AOS.init()
    }, 200);

};

/**
 * Generates a grid of shapes of given class
 * @param shape class of shape (right now we only have class .shape)
 * @param color (the color gradient to be applied to each shape in the grid)
 * @param parent (node to append grid to)
 * @param className (name of class to apply to each object in the grid if wanted
 */
let generateShapes = function (shape, color, parent, className) {
    for (let i = 0; i < noshapes; i++) {
        $("<div />", {
            class: `${shape} ${color} ${className} mix-hue`
        }).appendTo(parent)
    }
};

/**
 * Uses anime.js to move the target element horizontally in positive or negative direction by moveBy pixels
 * @param target target element to move
 * @param direction 1 or -1 depending on whether we want to go left or right
 * @param moveBy amount in px by which the objects are being moved
 */
let moveHorizontal = function (target, direction, moveBy) {
    anime({
        targets: target,
        translateX: direction * moveBy,
        easing: 'easeInOutQuad',
        duration: 1500
    });
};

