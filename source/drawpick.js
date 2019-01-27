const parent = document.getElementById("canvas-parent")
const canvas = document.getElementById("canvas")
const generation = document.getElementById("generation")
const ratio = document.getElementById("ratio")

class Toothpicks {
    constructor(canvas, g, r) {
        this.canvas = canvas
        this.generation = g
        this.ratio = r
        this.length = 0.5
        this.lines = new Float32Array(8 * (2 ** this.generation) - 4)
    }

    calcLines() {
        let x = 0
        let y = 0
        this.calcLength()
        this.lines[0] = 0 - this.length
        this.lines[1] = 0
        this.lines[2] = 0 + this.length
        this.lines[3] = 0

        let total = 2
        let index = 0
        let currIndex = 4
        let orientation = true
        for (let i = 0; i < this.generation; i++) {
            this.length *= this.ratio
            for (let j = 0; j < total; j++) {
                x = this.lines[index]
                y = this.lines[index + 1]
                index += 2
                if (orientation) {
                    this.lines.set([x, y - this.length, x, y + this.length], currIndex)
                } else {
                    this.lines.set([x - this.length, y, x + this.length, y], currIndex)
                }
                currIndex += 4
            }
            orientation = orientation ? false : true
            total *= 2
        }
    }

    calcLength() {
        if (this.ratio == 1 && this.generation > 2) {
            this.length = 1.3 / (this.generation)
        } else if (this.ratio > 1 && this.generation > 0) {
            this.length = 0.73 / (this.ratio ** this.generation)
        } else if (this.ratio < 1 && this.generation > 2) {
            this.length = 0.5 - ((1 * this.ratio) / 2 / (this.generation / 2))
        }

    }

    drawLines() {
        this.gl = canvas.getContext("webgl")
        if (!this.gl) {
            alert('Does not support webgl')
            return
        }

        const vsSource = `
            attribute vec2 aVertexPosition;


            void main() {
                gl_Position = vec4(aVertexPosition.xy,0,1);
            }
        `
        const fsSource = `

            precision highp float;

            void main() {
            gl_FragColor = vec4(0, 0, 0, 1.0);
            }
        `

        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vsSource)
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fsSource)

        const shaderProgram = createProgram(this.gl, vertexShader, fragmentShader)

        // Collect all the info needed to use the shader program.
        // Look up which attribute our shader program is using
        // for aVertexPosition and look up uniform locations.
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            }
        }

        // Here's where we call the routine that builds all the
        // objects we'll be drawing.
        this.buffers = initBuffers(this.gl, this.lines)


        // Here's where we call the routine that builds all the
        // objects we'll be drawing.


        // Draw the scene
        this.drawScene()
    }

    drawScene() {
        resize(canvas)
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

        const components = 2
        const type = this.gl.FLOAT
        const normalize = false
        const stride = 0
        const offset = 0
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position)
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            components,
            type,
            normalize,
            stride,
            offset)
        this.gl.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexPosition)

        this.gl.useProgram(this.programInfo.program)

        this.gl.drawArrays(this.gl.LINES, 0, this.lines.length / 2)
    }

    print() {
        console.log(this.lines)
    }
}

let mainCanvas = new Toothpicks(canvas, 0, 1)
let currGen = 0
let currRatio = 1

window.onload = () => {
    resize(canvas)
    mainCanvas.calcLines()
    mainCanvas.drawLines()
}

window.onresize = () => {
    resize(canvas)
}


const confirmGen = () => {
    if (generation.value != currGen | ratio.value != currRatio) {
        mainCanvas = new Toothpicks(canvas, generation.value, ratio.value)
        mainCanvas.calcLines()
        mainCanvas.drawLines()
    }
    currGen = generation.value
    currRatio = ratio.value
}

const resetGeneration = () => {
    generation.value = 0
    ratio.value = 1
    mainCanvas = new Toothpicks(canvas, 0, 1)
    confirmGen()
}

function initBuffers(gl, arr) {
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW)

    return { position: positionBuffer }
}


function createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!success) {
        console.log(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return
    }
    return shader
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
        console.log(gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }
    return program
}

function resize(canvas) {
    const displayWidth = parent.offsetWidth
    const displayHeight = parent.offsetHeight
    let display = displayHeight

    if (displayWidth < displayHeight) {
        display = displayWidth
    }

    if (canvas.width != display || canvas.height != display) {
        canvas.width = display
        canvas.height = display
    }
}

