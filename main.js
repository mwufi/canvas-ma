console.log("loaded main.js");

var c;
var ctx;

// util functions!
function randInt(lo, hi) {
    return Math.round(Math.random() * (hi - lo) + lo);
}

// maxes out the rows/columns available
function getCols(width, border, padding=0) {
    return Math.ceil((c.width - padding) / (width + border));
}
function getRows(height, border, padding=0) {
    return Math.ceil((c.height - padding) / (height + border));
}

// draws a simple square
function drawSquare(ctx) {
    ctx.lineCap = 'round';
    for (let i = 0; i < 10; i++) {
        ctx.lineWidth = randInt(0, 10);
        ctx.strokeStyle = `hsla(12, 100%, 60%, 0.4)`;
        ctx.strokeRect(30 + randInt(0, 20), 30 + randInt(0, 10), 140, 140);
    }
}

// Grid class
class Grid {
    constructor(space){
        this.space = space;
    }

    nCols(){
        let {width, border} = this.space.cells;
        let {left, right} = this.space.padding;
        return getCols(width, border, left + right);
    }
    
    nRows(){
        let {height, border} = this.space.cells;
        let {top, bottom} = this.space.padding;
        return getRows(height, border, top + bottom);
    }

    put(col, row, color){
        let {top, left} = this.space.padding;
        let {width, height, border} = this.space.cells;

        ctx.fillStyle = color;
        ctx.fillRect(left + col * (width + border), top + row * (height + border), width, height)
    }

    fill(d){
        let hue;
        for (let i = 0; i < this.nCols(); i++) {
            for (let j = 0; j < this.nRows(); j++) {
                hue = d(i,j);
                this.put(i,j, `hsla(${hue}, 100%, 60%, 0.4)`);
            }
        }
    }
}

// draws a nice-looking pastel grid with gaps
const pastelGrid = new Grid({
    cells: {
        width: 20, height: 30, border: 2
    },
    padding: {
        top:10, bottom:10, left:10, right:10
    }
});

function drawGrid(ctx) {
    pastelGrid.fill((col,row) => randInt(0, 255));
    
}

// draws a moving animation of XOR
let k = 1;
const xorGrid = new Grid({
    cells: {
        width: 3, height: 3, border: 1
    },
    padding: {
        top:10, bottom:10, left:10, right:10
    }
});
function drawGridXOR(ctx) {
    xorGrid.fill((i,j) => (i - k) ^ (j + k % 100) + 3);

    window.requestAnimationFrame(function () {
        k += 1;
        drawGridXOR(ctx)
    });
}

// draws a moving animation of particles
let drawCellBackground = true;
let dots = null;
let nDots = 10;

// x is between lo (inclusive) and hi (exclusive)
function checkBounds(x, lo, hi) {
    hi = hi - 1;
    if (x > hi){
        x = lo;
    }else if (x < lo){
        x = hi;
    }
    return x;
}

function makeDots(width, height) {
    if (dots === null) {
        let dots = [];
        for (let i = 0; i < nDots; i++) {
            dots.push({
                x: randInt(0, width),
                y: randInt(0, height),
                dx: randInt(-3,3),
                dy: randInt(-3,3),
                hue: randInt(0, 255)
            })
        }
        return dots;
    }
    return dots;
}


let dotGrid = new Grid({
    cells: {
        width: 22,
        height: 22,
        border: 3
    },
    padding: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
    }
});

function drawGridWithAgents(ctx) {
    const gridCols = dotGrid.nCols(), gridRows = dotGrid.nRows();
    dots = makeDots(gridCols, gridRows);

    const cellColor = "hsla(0, 0%, 90%, 0.4)";
    const backgroundColor = "hsla(0, 0%, 100%, 0.1)";

    if (drawCellBackground) {
        dotGrid.fill((i,j) => cellColor);
    }

    let a;
    for (a of dots) {
        hue = a.hue;
        dotGrid.put(a.x, a.y, `hsla(${hue}, 80%, 60%, 1)`);

        // move dots
        a.x += a.dx; a.y += a.dy;
        a.dx += randInt(-1, 1);
        a.dy += randInt(-1, 1);

        // check bounds
        a.dx = checkBounds(a.dx, -3, 3);
        a.dy = checkBounds(a.dy, -3, 3);
        a.x = checkBounds(a.x, 0, gridCols);
        a.y = checkBounds(a.y, 0, gridRows);
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, c.width, c.height);

    setTimeout(function(){
        window.requestAnimationFrame(function () {
            drawGridWithAgents(ctx)
        });
    }, 40)
}

let isRunning = false;
function startAnimation(f){
    if(isRunning){
        // reset the animation in some way, recaalculate rows, columns, etc
    }else{
        isRunning = true;
        f(ctx);
    }
}
function testCtx() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.save();
    startAnimation(drawGridWithAgents);
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