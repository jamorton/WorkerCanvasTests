
importScripts('../common/gl-matrix.js', '../common/drawing.js');

var canvas;

onmessage = function(event) {
    if (event.data == "incsize") {
        canvas.width += 50;
        canvas.height += 50;
    } else if (event.data == "decsize") {
        canvas.width -= 50;
        canvas.height -= 50;
    } else {
        canvas = event.data;
        var scene = new SceneDrawer(canvas, 'triangle');
        setInterval(scene.draw, 33);
    }
};
