/* =========================================================
   GRID BACKGROUND
========================================================= */

const canvas = document.getElementById("grid-canvas");
const ctx = canvas.getContext("2d");

let w, h;

function resizeGridCanvas() {

    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

resizeGridCanvas();

window.addEventListener(
    "resize",
    resizeGridCanvas
);

function drawGrid() {

    ctx.clearRect(0, 0, w, h);

    const size = 40;

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;

    /* LINEAS VERTICALES */

    for(let x = 0; x < w; x += size){

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, h);

        ctx.stroke();
    }

    /* LINEAS HORIZONTALES */

    for(let y = 0; y < h; y += size){

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(w, y);

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

let lastX = 0;
let lastY = 0;

function showImage(x, y){

    const img = images[current];

    current =
        (current + 1) % images.length;

    gsap.killTweensOf(img);

    gsap.set(img, {

        opacity: 1,

        x: x - 120,

        y: y - 160,

        scale: 0.8,

        rotation:
        gsap.utils.random(-10, 10)
    });

    gsap.to(img, {

        scale: 1,

        duration: 0.45,

        ease: "power3.out"
    });

    gsap.to(img, {

        opacity: 0,

        duration: 1.2,

        delay: 0.35,

        ease: "power2.out"
    });
}

/* =========================================================
   DESKTOP
========================================================= */

collage.addEventListener("mousemove", (e)=>{

    const rect =
        collage.getBoundingClientRect();

    const x =
        e.clientX - rect.left;

    const y =
        e.clientY - rect.top;

    const distance =
        Math.hypot(
            x - lastX,
            y - lastY
        );

    if(distance > 60){

        showImage(x, y);

        lastX = x;
        lastY = y;
    }
});

/* =========================================================
   MOBILE
========================================================= */

collage.addEventListener("touchmove", (e)=>{

    const rect =
        collage.getBoundingClientRect();

    const touch =
        e.touches[0];

    const x =
        touch.clientX - rect.left;

    const y =
        touch.clientY - rect.top;

    const distance =
        Math.hypot(
            x - lastX,
            y - lastY
        );

    /* EN CELULAR MAS SENSIBLE */

    if(distance > 25){

        showImage(x, y);

        lastX = x;
        lastY = y;
    }
});

/* =========================================================
   P5 PARTICLES TEXT
========================================================= */

new p5((p)=>{

    let particles = [];

    let font;

    /* =====================================================
       PRELOAD
    ===================================================== */

    p.preload = ()=>{

        font = p.loadFont(
            "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf"
        );
    };

    /* =====================================================
       SETUP
    ===================================================== */

    p.setup = ()=>{

        const container =
            document.getElementById("texto-particles");

        const canvas =
            p.createCanvas(
                container.offsetWidth,
                container.offsetHeight
            );

        canvas.parent("texto-particles");

        generarTexto();
    };

    /* =====================================================
       GENERAR TEXTO
    ===================================================== */

    function generarTexto(){

        particles = [];

        let pg =
            p.createGraphics(
                p.width,
                p.height
            );

        pg.pixelDensity(1);

        pg.clear();

        pg.fill(255);

        pg.textFont(font);

        /* RESPONSIVE */

        let titleSize =
            window.innerWidth < 768
            ? 52
            : 120;

        let subSize =
            window.innerWidth < 768
            ? 18
            : 30;

        pg.textAlign(
            p.CENTER,
            p.CENTER
        );

        /* TITULO */

        pg.textSize(titleSize);

        pg.text(
            "VIBRAS",
            p.width / 2,
            p.height / 2 - 100
        );

        pg.text(
            "BONITAS",
            p.width / 2,
            p.height / 2
        );

        /* SUBTEXTO */

        pg.textSize(subSize);

        pg.text(
            "computación creativa ✦ arte ✦ fotografía",
            p.width / 2,
            p.height / 2 + 90
        );

        pg.loadPixels();

        for(let x = 0; x < p.width; x += 7){

            for(let y = 0; y < p.height; y += 7){

                let index =
                    (x + y * p.width) * 4;

                let brightness =
                    pg.pixels[index];

                if(brightness > 200){

                    particles.push(
                        new Particle(x, y)
                    );
                }
            }
        }
    }

    /* =====================================================
       PARTICULA
    ===================================================== */

    class Particle{

        constructor(x, y){

            this.target =
                p.createVector(x, y);

            /* empiezan dispersas */

            this.pos =
                p.createVector(
                    p.random(p.width),
                    p.random(p.height)
                );

            this.vel =
                p.createVector();

            this.acc =
                p.createVector();

            this.size =
                p.random(2, 5);
        }

        behaviors(activarTexto){

            /* =============================================
               SCROLL = FORMAR TEXTO
            ============================================= */

            if(activarTexto){

                let arrive =
                    p5.Vector.sub(
                        this.target,
                        this.pos
                    );

                arrive.setMag(0.6);

                this.applyForce(arrive);
            }

            /* =============================================
               MOUSE / TOUCH = SEPARAR
            ============================================= */

            let mx = p.mouseX;
            let my = p.mouseY;

            if(p.touches.length > 0){

                mx = p.touches[0].x;
                my = p.touches[0].y;
            }

            let mouse =
                p.createVector(mx, my);

            let dir =
                p5.Vector.sub(
                    this.pos,
                    mouse
                );

            let d = dir.mag();

            let rango =
                window.innerWidth < 768
                ? 140
                : 90;

            if(d < rango){

                dir.setMag(8);

                this.applyForce(dir);
            }
        }

        applyForce(force){

            this.acc.add(force);
        }

        update(){

            this.vel.add(this.acc);

            this.vel.mult(0.92);

            this.pos.add(this.vel);

            this.acc.mult(0);
        }

        show(){

            p.noStroke();

            /* GLOW */

            p.drawingContext.shadowBlur = 18;

            p.drawingContext.shadowColor =
                "rgba(192,132,252,0.9)";

            p.fill(170, 120, 255);

            p.circle(
                this.pos.x,
                this.pos.y,
                this.size
            );
        }
    }

    /* =====================================================
       DRAW
    ===================================================== */

    p.draw = ()=>{

        p.clear();

        /* CUANDO HACEN SCROLL */

        let activar =
            window.scrollY > 120;

        for(let particle of particles){

            particle.behaviors(activar);

            particle.update();

            particle.show();
        }
    };

    /* =====================================================
       RESPONSIVE
    ===================================================== */

    p.windowResized = ()=>{

        const container =
            document.getElementById("texto-particles");

        p.resizeCanvas(
            container.offsetWidth,
            container.offsetHeight
        );

        generarTexto();
    };

});