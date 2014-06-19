
importScripts('../common/gl-matrix.js', '../common/drawing.js');

onmessage = function(event) {
    var canvas = event.data;
    var scene = new SceneDrawer(canvas, 'triangle');
    setInterval(scene.draw, 33);
};
