await loadScript("https://unpkg.com/p5")

bpm = 128
const scale = 1.5
const bgFlicker = false
const blockFlicker = true
const blockTrail = false

let xys = []
let squares = []

function p(source, callback) {
	new p5((p) => {
    	p.setup = () => {
        	let c = p.createCanvas(p.windowWidth, p.windowHeight).canvas
            c.style.display = "none"
      		source.init({ src:c })
          
          	for(let i=0;i<100;i++){
            	xys.push({
                  x:p.random(0,p.windowWidth),
                  y:p.random(0,p.windowHeight),
              	  length:p.random(30,100) * scale,
                  speed:p.random(10,20) * scale,
                  width:p.random() * scale
                })
            }
          
            for(let i=0;i<8;i++){
            	squares.push({
                  x:p.random(0,p.windowWidth),
                  y:p.random(0,p.windowHeight),
              	  length:p.random(80,300) * scale,
                  speed:p.random(-10, -20) * scale,
                  width:p.random(5,20) * scale
                })
            }
    	}
        
        p.draw = () => {
        	callback(p)
        }
    })
    return src(source)
}

p(s1, (p) =>{
  if (bgFlicker) p.background(50*(1 - time % (60 / bpm)))
  else p.background(0)
  
  p.textAlign(p.CENTER, p.CENTER);
  p.textFont('Segoe UI Light');
  p.fill(255);
  p.noStroke();
  
  p.textSize(100 * scale)
  let d = new Date();
  p.text(("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ ":" + ("0" + d.getSeconds()).slice(-2), width/2, height/2)
  
  // p.textSize(20 * scale)
  // p.text("works", width/2, height/2 + 55 * scale)
})

p(s0, (p) => {
  if (blockTrail) p.background(51,51,51,10)
  else p.background(51,51,51,255)
  
  xys.forEach((val)=>{
    p.strokeWeight(val.width)
    p.stroke(100)
    p.line(val.x,val.y,val.x + val.length,val.y)
    val.x = (val.x + val.speed) % p.windowWidth
  })
  
  squares.forEach((val)=>{
    p.strokeWeight(val.width)
    if (blockFlicker) p.stroke(255,255,255,120*(1 - time % (60 / bpm)))
    else p.stroke(255, 255, 255, 120)
    p.noFill()
    p.rect(val.x,val.y,val.length,val.length)
    val.x = val.x + val.speed
    if (val.x < -val.length) {
      val.length = p.random(80,300)
      val.speed = p.random(-10,-20)
      val.y = p.random(0,p.windowHeight) - val.length
      val.width = p.random(val.length/10,val.length/4)
      val.x = p.windowWidth
    }
  })
})
  .scrollX(5,1)
  .add(noise(2,0.5))
  .blend(s0,0.5)
  .blend(s0,0.5)
  .blend(s0,0.5)
  .add(src(s1))
  .out()
