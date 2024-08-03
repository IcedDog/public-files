let circSpd = 0.1
let sclSpd = 1.02

voronoi([8,8,9,9],0.1)
.pixelate(16,9)
.thresh(0.55)
.scrollX(()=>Math.sin(time*circSpd))
.scrollY(()=>Math.cos(time*circSpd))
.modulate(o1,0.5)
.add(o1,0.8)
.scale(sclSpd)
.luma(0.5)
.out(o1)

gradient(1).brightness(0.4).saturate(0.5).mask(src(o1))
.out()

speed = 1
bpm = 120
