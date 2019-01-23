const parent = document.getElementById("canvas-parent")
const canvas = document.getElementById("canvas")

function resizeCanvas(){
    
}

window.onload = () =>{
    canvas.width  = parent.offsetWidth
    canvas.height = parent.offsetHeight
    mainCanvas = new Toothpicks(canvas,10,1)
    mainCanvas.calcLines()
    mainCanvas.drawLines()
}

window.onresize = () =>{
    resizeCanvas()
}

class Toothpicks{
    constructor(canvas,g,r){
        this.canvas = canvas
        this.generation = g
        this.ratio = r
        this.length = 20
        this.cwidth = canvas.width/2
        this.cheight = canvas.height/2
        this.lines = new Float32Array(8*(2**this.generation)-4)
    }

    calcLines(){
        let x = 0
        let y = 0
        this.lines[0] = this.cwidth - this.length
        this.lines[1] = this.cheight
        this.lines[2] = this.cwidth + this.length
        this.lines[3] = this.cheight
        
        let total = 2
        let index = 0
        let currIndex = 4
        let orientation = true
        for (let i = 0; i < this.generation; i++) {
            this.length *= this.ratio
            for (let j = 0; j < total; j++) {
                x = this.lines[index]
                y = this.lines[index+1]
                index += 2
                if(orientation){
                    this.lines.set([x,y - this.length ,x ,y + this.length], currIndex)
                } else{
                    this.lines.set([x - this.length,y,x + this.length,y],currIndex)
                }
                currIndex += 4
            }
            orientation = orientation ? false : true
            total *= 2
        }
    }

    drawLines(){
        const gl = canvas.getContext("webgl")
        if(!gl){
            return
        }
        let program = webglUtils.createProgramFromScripts(gl,["2d-vertex-shader","2d-fragment-shader"])
        gl.useProgram(program);
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position")

        let colorLocation = gl.getUniformLocation(program, "u_color")
        let matrixLocation = gl.getUniformLocation(program, "u_matrix")

        let positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)
        
        gl.bufferData( gl.ARRAY_BUFFER,this.lines,gl.STATIC_DRAW)

        var primitiveType = gl.LINES;
        var offset = 0;
        var count = 2;
        gl.drawArrays(primitiveType, offset, count);
    }

    print(){
        console.log(this.lines)
        
    }
}

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  function resize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {

      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }