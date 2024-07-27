await loadScript("https://hyper-hydra.glitch.me/hydra-text.js")

noise(2,0.1).thresh(0.6).out(o1)
noise(100,0.1).thresh(0.5).pixelate(10,10).out(o2)

shape(4,1,0.1).out(o3)

voronoi(8,1)
.mult(osc(10,0.1,()=>Math.sin(time)*3).saturate(0))
.modulate(o0,0.5)
.add(o0,0.8)
.scale(1.01)
//.scale([1.06,1])
//.scrollY([0,1])
//.modulateRotate(voronoi(8,1),0.008)
//.modulate(noise(8,1),0.008)
.modulate(voronoi(8,1),0.008)
.luma(0.5)
.add(o1,0.2)
//.add(o2,[0,0.5])
//.luma(0.5).blend(o3,[0,0.3])
//.add(text( "!", "consolas" ),[1,0])
.out()


speed = 1
bpm = 120
