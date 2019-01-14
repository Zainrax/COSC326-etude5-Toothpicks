let canvas = document.querySelector('#canvas')
let generationCount = document.querySelector('#generationCount')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const centerX = canvas.width / 2
const centerY = canvas.height / 2
const length = 30


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
    if (canvas.getContext) {
        let context = canvas.getContext('2d');
        for(let x = 0; x <= generation; x++){
            context.moveTo(centerX,centerY)
            context.lineTo(centerX + length/2, centerY)
            context.lineTo(centerX - length/2, centerY)
            context.stroke();
        }
    }
}