let canvaX = 1520
let canvaY = 700
let vitesse = 4
mesBalles = []
let nbX = 5
let nbY = 5
let nbTot = nbX*nbY
let radius = 20
let k = 8900000000;

function setup() {
    createCanvas(canvaX,canvaY)
    
    for(let i = 0 ; i < nbX ; i++){
        for(let j = 0 ; j < nbY ; j++){
            mesBalles.push(new Balle(createVector((i+1)*(canvaX/nbX)-(canvaX/nbX)/2,(j+1)*(canvaY/nbY)-(canvaY/nbY)/2), createVector(random(-vitesse,vitesse),random(-vitesse,vitesse)), radius, random(0,255)))
        }
    }
}



function draw() {
    background(255)
    maCuve = new Cuve()
    for(let i = 0 ; i < nbTot ; i++){
        this.mesBalles[i].show()
        this.mesBalles[i].update()
        this.mesBalles[i].bounce()
        this.mesBalles[i].decrease(0.01)
    }
    for(let i = 0 ; i < nbTot ; i++){
        this.maCuve.magnetic(this.mesBalles[i], 4000)
        for(let j = 0 ; j < nbTot ; j++){
            if(i != j){
                this.mesBalles[i].collision(this.mesBalles[j])
                this.mesBalles[i].magnetic(this.mesBalles[j])
                
            }
        }
    }
    
}

function tourner(vel, angle) {
    const tournerdVelocities = {
        x: vel.x * Math.cos(angle) - vel.y * Math.sin(angle),
        y: vel.x * Math.sin(angle) + vel.y * Math.cos(angle)
    }
    return tournerdVelocities
}

function Balle(pos,vel,r,color) {
    this.pos = pos
    this.vel = vel
    this.r = r
    this.color = color
    this.mass = 1
    this.charge = 0.0001
    
    this.show = function() {
		stroke(10);
		fill(255);
		ellipse(this.pos.x,this.pos.y,this.r,this.r);
    }

    this.update = function() {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        
    }

    this.decrease = function(coef) {
        let a = 0.05
        if(this.vel.x > a){
            this.vel.x -= coef
        }
        if(this.vel.y > a){
            this.vel.y -= coef
        }
        if(this.vel.x < -a){
            this.vel.x += coef
        }
        if(this.vel.y < -a){
            this.vel.y += coef
        }
    }

    this.bounce = function() {
        if(this.pos.x > 1520-this.r/2 || this.pos.x < this.r/2){
            this.vel.x = -this.vel.x
            if(this.pos.x > 1520-this.r/2){
                this.pos.x = 1520-this.r/2
            } else if(this.pos.x < this.r/2){
                this.pos.x = this.r/2
            } 

        }
        if(this.pos.y > 700-this.r/2 || this.pos.y < this.r/2){
            this.vel.y = -this.vel.y 
            if(this.pos.y > 700-this.r/2){
                this.pos.y = 700-this.r/2
            } else if(this.pos.y < this.r/2){
                this.pos.y = this.r/2
            } 
        }
    }

    this.collision = function(friends){ 
        
        if(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) < this.r){  
            
            let xvelDiff = this.vel.x - friends.vel.x;
            let yvelDiff = this.vel.y - friends.vel.y;
        
            let xDist = friends.pos.x - this.pos.x;
            let yDist = friends.pos.y - this.pos.y;
        
            // Prevent accidental overlap of this
            if (xvelDiff * xDist + yvelDiff * yDist >= 0) {
        
                // Grab angle between the two colliding ball
                const angle = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);
        
                // Store mass in var for better readability in collision equation
                const m1 = this.mass;
                const m2 = friends.mass;
        
                // vel before equation
                const u1 = tourner(this.vel, angle);
                const u2 = tourner(friends.vel, angle);
        
                // vel after 1d collision equation
                const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
                const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
        
                // Final vel after rotating axis back to original location
                const vFinal1 = tourner(v1, -angle);
                const vFinal2 = tourner(v2, -angle);
        
                // Swap this velocities for realistic bounce effect
                this.vel.x = vFinal1.x;
                this.vel.y = vFinal1.y;
        
                friends.vel.x = vFinal2.x;
                friends.vel.y = vFinal2.y;
            }
        }
    }

    this.adaptspeed = function(friends, coef) {
        if(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) < 200 && dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) > 195){
            let angle2 = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);

            let vel1 = tourner(this.vel, angle2);

            vel1 = { x: vel1.x+coef, y: vel1.y}

            let finalS = tourner(vel1, -angle2)

            this.vel = finalS 
        }
        if(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) < 160){
            let angle2 = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);

            let vel1 = tourner(this.vel, angle2);

            vel1 = { x: this.charge*friends.charge, y: vel1.y}

            let finalS = tourner(vel1, -angle2)

            this.vel = finalS
        }
    }

    this.magnetic = function(friends) {
        let angle = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);

        let vel1 = tourner(this.vel, angle);

        vel1 = { x: vel1.x-((this.charge*friends.charge*k)/(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y)*dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y))), y: vel1.y}

        let finalS = tourner(vel1, -angle)

        this.vel = finalS
    }
}

this.Cuve = function() {
    stroke(30)
    line(0,0,0,canvaY)
    line(0,canvaY,canvaX,canvaY)
    line(canvaX,canvaY,canvaX,0)
    line(0,0,canvaX,0)

    this.magnetic = function(friends, charge) {
        friends.vel.x = friends.vel.x + (charge/(friends.pos.x*friends.pos.x)) - (charge/((canvaX-friends.pos.x)*(canvaX-friends.pos.x)))
        friends.vel.y = friends.vel.y + (charge/(friends.pos.y*friends.pos.y)) - (charge/((canvaY-friends.pos.y)*(canvaY-friends.pos.y)))
    }
}