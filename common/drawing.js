
SceneDrawer = function(canvas, sceneName) {
    var gl;

    //------------------------------------------------------
    // Setup
    //------------------------------------------------------    

    var err = function(text) {
        if (typeof alert != 'undefined') alert("ERROR: " + text);
        throw text;
    };

    try {
        gl = canvas.getContext("webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);        
    } catch (e) {
    }

    if (!gl) {
        err("Failed to initialize WebGL! Ruh roh.");
    }

    //------------------------------------------------------
    // GL Utils
    //------------------------------------------------------
    
    var createShader = function(src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            err(gl.getShaderInfoLog(shader));
        }
        return shader;
    };

    var createProgram = function(vertSrc, fragSrc) {
        var vertShader = createShader(vertSrc, gl.VERTEX_SHADER),
            fragShader = createShader(fragSrc, gl.FRAGMENT_SHADER);

        var program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            err(gl.getProgramInfoLog(program));
        }

        gl.detachShader(program, vertShader);
        gl.detachShader(program, fragShader);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        
        return program;
    };

    var scenes = {};

    scenes.triangle = function() {
        var vertSrc = "attribute vec3 position; \
                       uniform mat4 mvMatrix; \
                       uniform mat4 pMatrix; \
                       void main(void) { \
                         gl_Position = pMatrix * mvMatrix * vec4(position, 1.0); \
                       }";
        var sx = 2.0 / canvas.width, sy = 2.0 / canvas.height;
        var fragSrc = "precision mediump float; \
                       uniform float time; \
                       void main(void) { \
                         gl_FragColor = vec4( \
                           (sin(time)*cos(gl_FragCoord.x*.005) + 1.0) / 2.0, \
                           (cos(time)*sin(gl_FragCoord.y*.005) + 1.0) / 2.0, \
                           (sin(time)*cos(sqrt(time)) + 1.0) / 2.0, \
                           1.0); }";

        var verts = [
            0.0,  1.0,  0.0,
           -1.0, -1.0,  0.0,
            1.0, -1.0,  0.0
        ];

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);

        var program = createProgram(vertSrc, fragSrc);
        gl.useProgram(program);        
        var posAttrLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(posAttrLoc);

        var pMatUniform = gl.getUniformLocation(program, "pMatrix");
        var mvMatUniform = gl.getUniformLocation(program, "mvMatrix");
        var timeUniform = gl.getUniformLocation(program, "time");

        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        var itemSize = 3;
        var numItems = 3;

        var mvMatrix = mat4.create(),
            pMatrix = mat4.create();

        var start = new Date().getTime();

        return function() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
            mat4.identity(mvMatrix);
            mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -2.0]);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.vertexAttribPointer(posAttrLoc, itemSize, gl.FLOAT, false, 0, 0);
            gl.uniformMatrix4fv(pMatUniform, false, pMatrix);
            gl.uniformMatrix4fv(mvMatUniform, false, mvMatrix);
            gl.uniform1f(timeUniform, (new Date().getTime() - start) / 1000.0);
            gl.drawArrays(gl.TRIANGLES, 0, numItems);
        };
    };

    var scene = scenes[sceneName]();
    this.draw = scene;
};
