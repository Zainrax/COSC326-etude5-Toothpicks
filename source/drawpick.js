let canvas = document.querySelector('#canvas')
let generationCount = document.querySelector('#generationCount')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const length = 30

const resizeCanvas = () =>{
    console.log('test')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const addGeneration = () => {
    generationCount.innerHTML++
    confirm()  
}

const removeGeneration = () => {
    if(generationCount.innerHTML > 0){
        generationCount.innerHTML--
        confirm()
    }
}

const resetGeneration = () => {
    generationCount.innerHTML = 0
    confirm()
}

const confirm = () => {
    generation = Number(generationCount.innerHTML);
    drawLine(generation)
}

function line(x,y){
    this.x = x
    this.y = y
}

const drawLine = (genCount, ratio) =>{
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    let length = 50
    let totalLines = 2
    let lines = [new line(centerX - length/2,centerY), new line(centerX + length/2 ,centerY)]
    let context = canvas.getContext('2d');

    context.moveTo(lines[0].x,lines[0].y)
    context.lineTo(lines[1].x, lines[1].y)
    context.stroke();

    for (let x = 0; x < genCount; x++) {
        length *= ratio
        for(let y = 0; y < totalLines; y++){
            let l = lines.pop()
            if(x % 2 === 0){
                
            } else {
                context.moveTo(l.x, l.y - length/2)
                context.lineTo(l.x. l.y + length/2)
                context.stroke()
            }
        }      
    }
}