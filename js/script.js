/* =========================================================
   GRID BACKGROUND
========================================================= */

const canvas = document.getElementById("grid-canvas");

const ctx = canvas.getContext("2d");

let w, h;

function resizeGridCanvas(){

    w = canvas.width = window.innerWidth;

    h = canvas.height = window.innerHeight;
}

resizeGridCanvas();

window.addEventListener(
    "resize",
    resizeGridCanvas
);

function drawGrid(){

    ctx.clearRect(0,0,w,h);

    const size = 40;

    ctx.strokeStyle =
        "rgba(255,255,255,0.05)";

    ctx.lineWidth = 1;

    for(let x = 0; x < w; x += size){

        ctx.beginPath();

        ctx.moveTo(x,0);

        ctx.lineTo(x,h);

        ctx.stroke();
    }

    for(let y = 0; y < h; y += size){

        ctx.beginPath();

        ctx.moveTo(0,y);

        ctx.lineTo(w,y);

        ctx.stroke();
    }

    requestAnimationFrame(drawGrid);
}

drawGrid();

/* =========================================================
   IMAGE TRAIL
========================================================= */

const images = [
    ...document.querySelectorAll(".content__img")
];

const collage =
    document.querySelector(".image-trail-area");

let current = 0;

let lastMove = 0;

function showImage(x,y){

    const now = Date.now();

    /* evita spam */

    if(now - lastMove < 160){

        return;
    }

    lastMove = now;

    const img = images[current];

    current =
        (current + 1) % images.length;

    gsap.killTweensOf(img);

    gsap.set(img,{

        opacity:1,

        x:x - 120,

        y:y - 160,

        scale:0.82,

        rotation:
        gsap.utils.random(-10,10)
    });

    /* ENTRADA */

    gsap.to(img,{

        scale:1,

        duration:0.45,

        ease:"power3.out"
    });

    /* FLOTACION */

    gsap.to(img,{

        y:`+=${gsap.utils.random(-20,20)}`,

        x:`+=${gsap.utils.random(-15,15)}`,

        duration:2.5,

        ease:"sine.inOut"
    });

    /* SALIDA */

    gsap.to(img,{

        opacity:0,

        duration:1.8,

        delay:0.8,

        ease:"power2.out"
    });
}

/* =========================================================
   MOUSE
========================================================= */

collage.addEventListener("mousemove",e=>{

    const rect =
        collage.getBoundingClientRect();

    showImage(

        e.clientX - rect.left,

        e.clientY - rect.top
    );
});

/* =========================================================
   TOUCH MOVIL
========================================================= */

collage.addEventListener("touchmove",e=>{

    const rect =
        collage.getBoundingClientRect();

    const touch =
        e.touches[0];

    showImage(

        touch.clientX - rect.left,

        touch.clientY - rect.top
    );
});

/* =========================================================
   PARTICULAS TEXTO
========================================================= */

let font;

let particles = [];

function preload() {

    font = loadFont(
        'https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf'
    );
}

/* =========================================================
   SETUP
========================================================= */

function setup() {

    const container =
        document.getElementById("texto-particles");

    let canvas = createCanvas(

        container.offsetWidth,

        container.offsetHeight
    );

    canvas.parent("texto-particles");

    clear();

    generarTexto();
}

/* =========================================================
   GENERAR TEXTO
========================================================= */

function generarTexto() {

    particles = [];

    let pg =
        createGraphics(width,height);

    pg.pixelDensity(1);

    pg.clear();

    pg.fill(255);

    pg.noStroke();

    pg.textFont(font);

    /* RESPONSIVE */

    let sizeText =
        windowWidth < 768
        ? 38
        : 82;

    pg.textSize(sizeText);

    pg.textAlign(CENTER,CENTER);

    pg.textLeading(sizeText * 1.4);

    /* TEXTO */

    const texto = `

DISEÑANDO
MI FUTURO
CON ESTILO
PROPIO

`;

    pg.text(

        texto,

        width / 2,

        height / 2
    );

    pg.loadPixels();

    /* DENSIDAD */

    let density =
        windowWidth < 768
        ? 3
        : 4;

    for(let x = 0; x < width; x += density){

        for(let y = 0; y < height; y += density){

            let index =
                (x + y * width) * 4;

            let brightness =
                pg.pixels[index];

            if(brightness > 180){

                particles.push(
                    new Particle(x,y)
                );
            }
        }
    }
}

/* =========================================================
   DRAW
========================================================= */

function draw() {

    clear();

    let activar =
        window.scrollY > 50;

    for(let p of particles){

        p.behaviors(activar);

        p.update();

        p.show();
    }
}

/* =========================================================
   PARTICULA
========================================================= */

class Particle {

    constructor(x,y){

        this.target =
            createVector(x,y);

        this.pos =
            createVector(

                random(width),

                random(height)
            );

        this.vel =
            createVector();

        this.acc =
            createVector();

        this.size =
            random(
                windowWidth < 768 ? 2.5 : 2,
                windowWidth < 768 ? 6 : 5
            );

        this.color = random([

            [192,132,252],

            [96,165,250],

            [255,255,255],

            [170,120,255]
        ]);
    }

    behaviors(activarTexto){

        /* FORMAR TEXTO */

        if(activarTexto){

            let arrive =
                p5.Vector.sub(
                    this.target,
                    this.pos
                );

            arrive.setMag(1);

            this.applyForce(arrive);
        }

        /* MOUSE / TOUCH */

        let mx = mouseX;

        let my = mouseY;

        if(touches.length > 0){

            mx = touches[0].x;

            my = touches[0].y;
        }

        let mouse =
            createVector(mx,my);

        let dir =
            p5.Vector.sub(
                this.pos,
                mouse
            );

        let d = dir.mag();

        let rango =
            windowWidth < 768
            ? 170
            : 100;

        if(d < rango){

            dir.setMag(12);

            this.applyForce(dir);
        }
    }

    applyForce(force){

        this.acc.add(force);
    }

    update(){

        this.vel.add(this.acc);

        this.vel.mult(0.90);

        this.pos.add(this.vel);

        this.acc.mult(0);
    }

    show(){

        noStroke();

        drawingContext.shadowBlur =
            windowWidth < 768
            ? 28
            : 20;

        drawingContext.shadowColor =
            `rgba(
                ${this.color[0]},
                ${this.color[1]},
                ${this.color[2]},
                0.95
            )`;

        fill(

            this.color[0],

            this.color[1],

            this.color[2]
        );

        circle(

            this.pos.x,

            this.pos.y,

            this.size
        );
    }
}

/* =========================================================
   RESPONSIVE
========================================================= */

function windowResized(){

    resizeGridCanvas();

    const container =
        document.getElementById("texto-particles");

    resizeCanvas(

        container.offsetWidth,

        container.offsetHeight
    );

    generarTexto();
}