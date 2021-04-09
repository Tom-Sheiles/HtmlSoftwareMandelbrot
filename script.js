let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let zoom = document.getElementById('zoom');
let it = document.getElementById('it');

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

function sampleGrad(x, r, g, b, r2, g2, b2)
{
    let red = r + x * (r2 - r);
    let green = g + x * (g2 - g);
    let blue = b + x * (b2 - b);
    return {r:Math.floor(red), g:Math.floor(green), b: Math.floor(blue)};
}

function normalize(x, minX, maxX, a, b)
{
    return (b-a)*((x-minX) / (maxX-minX)) + a;
}

let w = canvas.width;
let h = canvas.height;
let normMinX = -2.5;
let normMaxX = 1;
let normMinY = -1;
let normMaxY = 1;
let scale = 1;
let centerY = 0;
let centerX = 0;

let colors = [];
for(let i = 0; i < 1000; i++)
{
    let r = Math.floor(Math.random() *(255-0) + 0);
    let g = Math.floor(Math.random() *(255-0) + 0);
    let b = Math.floor(Math.random() *(255-0) + 0);
    colors.push(rgbToHex(r,g,b));
}

function calcMandlebrot(iterations){
    for(let x = 0; x < w; x++)
    {
        for(let y = 0; y < h; y++)
        {
            mandlebrot(x,y, w, h, iterations);
        }
    }
}

function mandlebrot(Px, Py, w, h, max)
{
    let x0 = normalize(Px, 0, w, normMinX, normMaxX) * scale - centerX;
    let y0 = normalize(Py, 0, h, normMinY, normMaxY) * scale - centerY;
    let x = 0;
    let y = 0;
    let i = 0;
    let maxIterations = max;

    while((x*x) + (y*y) <= (2*2) && i < maxIterations)
    {
        let temp = ((x*x) - (y * y)) + x0;
        y = 2 * x * y + y0;
        x = temp;
        i++;
    }
    
    if(i == maxIterations) ctx.fillStyle = "#000000";
    else if(i < 1) ctx.fillStyle = "#ff0000";
    else ctx.fillStyle = colors[i];

    ctx.fillRect(Px, Py, 1, 1);
    return i;
}

canvas.addEventListener('click', (e)=>{
    var rect = canvas.getBoundingClientRect()
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top

    scale *= 0.75;
    zoom.innerHTML = `Zoom Scale: ${scale}`;

    calcMandlebrot(currentIterations);
})

let currentIterations = 2;
calcMandlebrot(currentIterations);
it.innerHTML = `Iterations: ${currentIterations}`;

requestAnimationFrame(loop);

function loop()
{
    centerX = 1.7;
    scale *= 0.75;
    zoom.innerHTML = `Zoom Scale: ${scale}`;

    calcMandlebrot(currentIterations);
    requestAnimationFrame(loop);
}

/*function loop()
{
    calcMandlebrot(currentIterations);
    currentIterations *= 2;
    it.innerHTML = `Iterations: ${currentIterations}`;

    if(currentIterations <= 5000){
    requestAnimationFrame(loop);
    }
}*/