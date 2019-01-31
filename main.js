console.log("loaded main.js");

var c;
var ctx;

// util functions!
function randInt(lo, hi) {
    return Math.random() * (hi - lo) + lo;
}

// maxes out the rows/columns available
function getCols(width, border){
    return Math.ceil(c.width / (width + border));
}
function getRows(height, border){
    return Math.ceil(c.height / (height + border));
}

// draws a simple square
function drawSquare(ctx){
    ctx.lineCap = 'round';
    for (let i = 0; i < 10; i++) {
        ctx.lineWidth = randInt(0, 10);
        ctx.strokeStyle = `hsla(12, 100%, 60%, 0.4)`;
        ctx.strokeRect(30 + randInt(0, 20), 30 + randInt(0, 10), 140, 140);
    }
}

// draws a nice-looking pastel grid with gaps
function drawGrid(ctx){
    const width = 20, height = 30, border = 2;
    const gridCols = getCols(width, border), gridRows = getRows(height, border);
    const padTop = 0, padLeft = 0;
    let hue; 
    for (let i = 0; i < gridCols; i++){
        for (let j = 0; j < gridRows; j++){
            hue = randInt(0, 255);
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.4)`;
            ctx.fillRect(padTop + i * (width + border), padLeft + j * (height + border), width, height)
        }
    }
}

// draws a moving animation of XOR
let k = 1;
function drawGridXOR(ctx){
    const width = 3, height = 3, border = 1;
    const gridCols = getCols(width, border), gridRows = getRows(height, border);
    const padTop = 0, padLeft = 0;
    let hue; 
    for (let i = 0; i < gridCols; i++){
        for (let j = 0; j < gridRows; j++){
            hue = (i-k)^(j+k % 100) + 3;
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.4)`;
            ctx.fillRect(padTop + i * (width + border), padLeft + j * (height + border), width, height)
        }
    }

    window.requestAnimationFrame(function (){
        k += 1;
        drawGridXOR(ctx)
    });
}

function testCtx() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.save();
    drawGridXOR(ctx);
    ctx.restore();
}

// make the canvas grow/shrink with the window
function resize() {
    const { innerWidth, innerHeight } = window;
    c.width = innerWidth; c.height = innerHeight;

    testCtx();
}
window.addEventListener('resize', resize);

// gets references to the context/canvas
function load() {
    c = document.getElementById('canvas');
    c.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    `
    ctx = c.getContext('2d');
    resize();
}
window.addEventListener('load', load);