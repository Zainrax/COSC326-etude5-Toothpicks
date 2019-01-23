let parent = document.getElementById("canvas-parent")
let canvas = document.getElementById("canvas")

function resizeCanvas(){
    canvas.width  = parent.offsetWidth
    canvas.height = parent.offsetHeight
    mainCanvas = new Toothpicks(canvas,22,1)
    mainCanvas.calcLines()
    mainCanvas.print()
    mainCanvas.drawLines()
}

window.onload = () =>{
    resizeCanvas()
}

window.onresize = () =>{
    resizeCanvas()
}

class Toothpicks{
    constructor(canvas,g,r){
        this.canvas = canvas
        this.generation = g
        this.ratio = r
        this.length = 10
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
        // let gl = canvas.getContext('webgl')
        // let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
        // let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
        
        // let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        // let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        // let program = createProgram(gl, vertexShader, fragmentShader);

        // let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        // let positionBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // gl.bufferData(gl.ARRAY_BUFFER, this.lines, gl.STATIC_DRAW);
        // gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        // gl.clearColor(0, 0, 0, 0);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.useProgram(program);
        // gl.enableVertexAttribArray(positionAttributeLocation);
        // // Bind the position buffer.
        // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        // // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        // var size = 2;          // 2 components per iteration
        // var type = gl.FLOAT;   // the data is 32bit floats
        // var normalize = false; // don't normalize the data
        // var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        // var offset = 0;        // start at the beginning of the buffer
        // gl.vertexAttribPointer(
        //     positionAttributeLocation, size, type, normalize, stride, offset)

        // var primitiveType = gl.LINES;
        // var offset = 0;
        // var count = 2;
        // gl.drawArrays(primitiveType, offset, count);
        let c = canvas.getContext('2d')
        for (let index = 0; index < this.lines.length; index += 4) {
            c.moveTo(this.lines[index],this.lines[index+1])
            c.lineTo(this.lines[index+2],this.lines[index+3])
        }
        c.stroke()
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