let myCircles = []; // Array to store circle
let numOfCircles = 33; // Number of circles
let bgImage; // Background image
let bottomX = 111; // X position of the semicircles at bottom most(1-5)
let bottomY = 494; // Y position of semicircles at the bottom most(1-5)
let diameter1 = 34; // Diameter of the semicircles at bottom most(1-5)+bottom big(2&3)
let diameter2 = 25; // Diameter of the semicircles at bottom (2&3)
let spacing1 = 37; // Spacing between the bottom most semicircles (1-5)
let spacing2 = 105; // Spacing for bottom big semicircles(1&4)
let spacing3 = 43; // Spacing for bottom small semicircles(2&3)
let topX1 = 148; // X position for bottom big semicircles(1&4)
let topX2 = 180; // X position for bottom small semicircles(2&3) 
let topY = 445; // Y position for bottom big+small semicircles(1-4)

let music;
let fft;
function preload() {
    // Preload background image
    bgImage = loadImage('assets/background.jpg');
    music = loadSound('assets/757346__simmys_recycle_bin__druggy-slow-beat.wav');
}

// Positions and sizes for circles
let circlePositions = [
    [85,40],[85,85],[90,120],[114,130],[122,153],[120,183],[125,224],[150,248],[175,252],[198,247],
    [222,253],[247,250],[272,248],[280,218],[285,190],[289,158],[285,125],[300,120],[325,125],[350,134],
    [358,115],[180,165],[170,185],[190,183],[210,204],[230,185],[241,170],[210,230],
    [210,289],[200,340],[202,385],[208,410],[200,432]
];
let circleDiameters = [50, 43, 29, 27, 23, 40, 53, 28, 26, 20, 31, 22, 33, 35, 25, 44, 20, 15, 33, 22, 20, 16, 16, 26, 35, 22, 16, 20, 47, 61, 30, 23, 23];

function setup() {
    createCanvas(400, 600); // Create a 400*600 canvas
    fft = new p5.FFT();  // Initialize Spectrum Analyzer
    // Initialize circles with positions and sizes
    for(let i = 0; i < numOfCircles; i++){
        myCircles.push(new MyCircleClass(circlePositions[i][0], circlePositions[i][1], circleDiameters[i]));
    }

}
// Mouse click to control music dynamics
function  mousePressed(){


        if(!music.isPlaying()){
            music.loop();
        }else{
            music.pause();
        }



}
class MyCircleClass {
    constructor(x, y, size) {
        this.x = x; // X position of circle
        this.y = y; // Y position of circle
        this.size = size; // Size of circle
        this.offset = random(TWO_PI); // Random offsets for each circle for different twisting rhythms
        this.baseX=x;
        this.stroke = 0; // Stroke weight for circle outline
        this.color1 = color(228, 102, 103); // First color for half of circle (green)
        this.color2 = color(142, 171, 126); // Second color for half of circle (red)
    }



    draw(bassEnergy) {

        // Adjust the twisting amplitude according to the audio energy, the higher the energy, the higher the amplitude
        let amplitude = map(bassEnergy, 0, 255, 0, 5);
        let dynamicX = this.baseX + sin(frameCount * 0.1 + this.offset) * amplitude;


        fill(this.color1);
        stroke(this.stroke);
        // Use of low-frequency energy to influence the radius and increase the sense of dynamics
        // let dynamicSize = this.size + bassEnergy * 0.3;
        let dynamicSize = map(bassEnergy, 20, 250, this.size * 0.8, this.size * 1.2);
        arc(dynamicX, this.y, dynamicSize, dynamicSize, HALF_PI, -HALF_PI, PIE);

        fill(this.color2);
        arc(dynamicX, this.y, dynamicSize, dynamicSize, -HALF_PI, HALF_PI, PIE);
    }
}

function draw() {
    background(bgImage); // Preload background image

    let spectrum = fft.analyze();
    let bassEnergy = fft.getEnergy(20, 250); // Extraction of low-frequency energy in the 20-250 Hz band

    for (let i = 0; i < numOfCircles; i++) {
        myCircles[i].draw(bassEnergy); // Draw each circle
    }
    drawStaticElements();

}
// Drawing of other static elements, unchanged

let rectY = 450; // Initial position of the rectangle
let rectSpeed = 2; // Movement speed of the rectangle
function drawStaticElements() {

    let spectrum = fft.analyze();  // Access to spectrum data
    let bassEnergy = fft.getEnergy(20, 250); // Access to low frequency energy (20 to 250 Hz)


    // Drawing Rectangle
    stroke(0);
    strokeWeight(2);
    fill(142, 171, 126);
    rect(27, rectY, 345, 55);  // Drawing rectangles with dynamic rectY values
    line(65, rectY, 65, rectY + 55);
    line(340, rectY, 340, rectY + 55);

    fill(217, 194, 125);
    rect(92, rectY - 6, 204, 52);

    stroke(217, 194, 125);
    fill(228, 102, 103);
    rect(130, rectY - 4, 35, 48);
    fill(142, 171, 126);
    rect(165, rectY - 4, 37, 48);
    rect(237, rectY - 4, 35, 48);
    arc(285, rectY + 44, 19, 28, PI, 0);

    let spacing1 = 37;
    let diameter1 = 34;

    // Adding music-based dynamics to each circle
    for (let i = 0; i < 3; i++) {
        let sizeAdjustment = map(bassEnergy, 0, 255, 0.5, 1.5); // Adjustment of circle size based on low-frequency energy
        let colorAdjustment = map(bassEnergy, 0, 255, 100, 255); // Adjusts color brightness based on low frequency energy
        fill(i % 3 === 0 ? color(142, 171, 126, colorAdjustment) : (i % 3 === 1 ? color(217, 194, 125, colorAdjustment) : color(228, 102, 103, colorAdjustment)));
        arc(111 + i * spacing1, rectY + 44, diameter1 * sizeAdjustment, diameter1 * sizeAdjustment, PI, 0);
    }


    // Rightmost small green semicircle 6
    arc(285, 494, 19, 28, PI, 0, fill(142, 171, 126));

    // Semicircles bottom big 1&4
    for (let i = 0; i < 2; i++) {
        fill(i % 2 === 0 ? color(142, 171, 126) : color(228, 102, 103));
        arc(topX1 + i * spacing2, topY, diameter1, diameter1, 0, PI);
    }

    // Semicircles bottom small 2&3
    for (let i = 0; i < 2; i++) {
        fill(i % 2 === 0 ? color(228, 102, 103) : color(142, 171, 126));
        arc(topX2 + i * spacing3, topY, diameter2, diameter2, 0, PI);
    }



    // Semicircles bottom most 4&5
    for (let i = 0; i < 2; i++) {
        fill(i % 2 === 0 ? color(228, 102, 103) : color(217, 194, 125));
        arc(bottomX + i * spacing1 + 110, bottomY, diameter1, diameter1, PI, 0);
    }

    // Add black strokes and draw semicircles bottom 1&4
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < 2; i++) {
        fill(i % 2 === 0 ? color(228, 102, 103) : color(142, 171, 126));
        arc(topX1 + i * spacing2, topY, diameter1, diameter1, PI, 0);
    }
    // Add black strokes and draw semicircles bottom 2&3
    for (let i = 0; i < 2; i++) {
        fill(i % 2 === 0 ? color(142, 171, 126) : color(228, 102, 103));
        arc(topX2 + i * spacing3, topY, diameter2, diameter2, PI, 0);
    }

    // Yellow stroke for the bottom rectangle line
    stroke(217, 194, 125);
    line(130, 446, 270, 446);
}