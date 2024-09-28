await loadScript("https://unpkg.com/p5")

bpm = 120
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
              	  length:p.random(30,100),
                  speed:p.random(10,20),
                  width:p.random()
                })
            }
          
          for(let i=0;i<5;i++){
            	squares.push({
                  x:p.random(0,p.windowWidth),
                  y:p.random(0,p.windowHeight),
              	  length:p.random(80,300),
                  speed:p.random(-10, -20),
                  width:p.random(5,20)
                })
            }
    	}
        
        p.draw = () => {
        	callback(p)
        }
    })
    return src(source)
}

p(s0, (p) => {
  p.background(51)
  
  xys.forEach((val)=>{
    p.strokeWeight(val.width)
    p.stroke(100)
    p.line(val.x,val.y,val.x + val.length,val.y)
    val.x = (val.x + val.speed) % p.windowWidth
  })
  
  squares.forEach((val)=>{
    p.strokeWeight(val.width)
    p.stroke(255,255,255,120*(1 - time % (60 / bpm)))
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
  .out()
