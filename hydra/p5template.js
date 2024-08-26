await loadScript("https://unpkg.com/p5")

function p(source, callback) {
	new p5((p) => {
    	p.setup = () => {
        	let c = p.createCanvas(p.windowWidth, p.windowHeight).canvas
            c.style.display = "none"
      		source.init({ src:c })
    	}
        
        p.draw = () => {
        	callback(p)
        }
    })
    return src(source)
}

p(s0, (p) => {
	p.background(0)
}).out()
