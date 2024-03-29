// Generated by ChatGPT
// Usage: https://www.bilibili.com/read/cv23511634

const vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 vTexCoord;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0, 1);
  vTexCoord = a_texCoord;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D uSampler;

vec3 hsv2rgb(vec3 c) {
    const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
    const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);
}

void main() {
  vec4 color = texture2D(uSampler, vTexCoord);
  float sum = color.r + color.g + color.b;
  float convertedGray = sum / 3.0;
  vec3 transformed = rgb2hsv(vec3(convertedGray,convertedGray,convertedGray));
  transformed.r = 1.0;
  vec3 re = hsv2rgb(transformed);
  gl_FragColor = vec4(re.r - 0.2,re.g - 0.2,re.b - 0.2, color.a);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function loadTexture(gl, video) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

  return texture;
}

function renderTexture(gl, program, texture) {
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  const samplerLocation = gl.getUniformLocation(program, "uSampler");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangle(gl, -1, -1, 2, 2);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     0.0,  0.0,
     1.0,  0.0,
     0.0,  1.0,
     0.0,  1.0,
     1.0,  0.0,
     1.0,  1.0,
  ]), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(texCoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(matrixLocation, false, [
  1, 0, 0, 0,
  0, -1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]);

  gl.uniform1i(samplerLocation, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

function runProgram(){
  const shaderProgram = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  );

  function render() {
    if(document.getElementById(video.id) == null) video = document.querySelectorAll("video[id^='video-']")[0];
    const texture = loadTexture(gl, video);
    if (enabled) {
      canvas.style.display = "unset";
      renderTexture(gl, shaderProgram, texture);
    }
    else{
      canvas.style.display = "none";
    }
    enabled = checkBox.checked;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

let enabled = false;
let video = document.querySelectorAll("video[id^='video-']")[0];
const canvas = document.createElement("canvas");
const reloadBtn = document.getElementsByClassName('icon')[8];
canvas.width = 1920;
canvas.height = 1080;
canvas.style.position = "absolute";
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.style.zIndex = "5";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.overflow = "hidden";
video.parentNode.insertBefore(canvas, video.nextSibling);
const gl = canvas.getContext("webgl");
window.onload = runProgram();

const btnAfter = document.getElementsByClassName('popular-and-hot-rank')[0];
const checkBox = document.createElement("input");
checkBox.type="checkbox";
checkBox.value="启用 Shader";
checkBox.style.margin="5px";
checkBox.innerHTML="启用 Shader";
btnAfter.parentNode.insertBefore(checkBox, btnAfter.nextSibling);
