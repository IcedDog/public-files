function a(n){
  return Math.cos(Math.sin(time*6237.842)+8493.234)*45648941%n
}

function p(source, callback) {
	new p5((p) => {
    	p.setup = () => {
        	let c = p.createCanvas(p.windowWidth, p.windowHeight).canvas
            c.style.display = "none"
      		source.init({ src:c })
          
			p.textSize(100)
  			p.textAlign(p.CENTER, p.CENTER);
          	p.textFont('Segoe UI Light');
  			p.fill(255);
  			p.noStroke();
    	}
        
        p.draw = () => {
        	callback(p)
        }
    })
    return src(source)
}

speed = 1
let n = a(6)+3
voronoi(5,1,()=>Math.sin(3))
  .kaleid()
  .mask(shape(()=>n,0.3,1))
  .modulateRotate(shape(()=>n,0.1,1))
  .modulateRotate(shape(()=>n,0.1,0.9))
  .modulateRotate(shape(()=>n,0.1,0.8))
  .blend(shape(()=>4,0.2,1))
  .rotate(()=>time*0.3+0.5)
  .blend(o1,0.5).blend(o1,0.5).blend(o1,0.5).blend(o1,0.5).blend(o1,0.5)
  .out(o1)

src(o1).layer(p(s0, (p) => {
  	p.clear()
	let d = new Date();
  	p.text(("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ ":" + ("0" + d.getSeconds()).slice(-2), width/2, height/2)
})).out(o0)
