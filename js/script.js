const canvas = document.getElementById("grid-canvas");
const ctx = canvas.getContext("2d");
let squareSize = 45;
let offset = 0;

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e)=>{
    mouseX = e.x;
    mouseY = e.y;
});

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

function drawGrid(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let x = -squareSize; x < canvas.width + squareSize; x += squareSize){

        for(let y = -squareSize; y < canvas.height + squareSize; y += squareSize){

            let dx = mouseX - x;
            let dy = mouseY - y;

            let distance = Math.sqrt(dx*dx + dy*dy);

            let opacity = Math.max(0.1, 1 - distance / 300);

            let color = Math.random() > 0.5
                ? `rgba(200,170,255,${opacity * 0.4})`
                : `rgba(25,25,90,${opacity * 0.5})`;

            ctx.strokeStyle = color;

            ctx.shadowColor = color;
            ctx.shadowBlur = 10;

            ctx.strokeRect(
                x + offset,
                y + offset,
                squareSize,
                squareSize
            );
        }
    }

    offset += 0.15;

    if(offset >= squareSize){
        offset = 0;
    }

    requestAnimationFrame(drawGrid);
}

drawGrid();
const images = document.querySelectorAll(".content__img");

const container = document.querySelector(".image-trail-area");

let current = 0;

let lastX = 0;
let lastY = 0;

container.addEventListener("mousemove", (e)=>{

    const rect = container.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const distance = Math.hypot(x - lastX, y - lastY);

    if(distance > 80){

        const img = images[current];

        img.style.left = `${x - 100}px`;
        img.style.top = `${y - 120}px`;

        img.style.opacity = "1";

        img.style.transform = `
        scale(1)
        rotate(${Math.random()*20 - 10}deg)
        `;

        setTimeout(()=>{

            img.style.opacity = "0";

            img.style.transform = `
            scale(.2)
            rotate(${Math.random()*20 - 10}deg)
            `;

        },700);

        current++;

        if(current >= images.length){
            current = 0;
        }

        lastX = x;
        lastY = y;
    }

});
