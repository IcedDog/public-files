// Generated by ChatGPT

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
const vec2 gridDimensions = vec2(16.0, 9.0);
const vec2 tileSize = vec2(1.0) / gridDimensions;

void main() {
  // Calculate the original tile coordinates
  vec2 originalTileCoords = floor(vTexCoord / tileSize);

  // Calculate the tile index
  float tileIndex = originalTileCoords.y * gridDimensions.x + originalTileCoords.x;

  // Calculate the new tile coordinates
  vec2 newTileCoords;
  newTileCoords.x = floor(tileIndex / gridDimensions.y);
  newTileCoords.y = tileIndex - newTileCoords.x * gridDimensions.y;

  // Calculate the new UV coordinates within the reordered tile
  vec2 newTileUV = fract(vTexCoord / tileSize);
  vec2 reorderedUV = (newTileCoords + newTileUV) * tileSize;

  // Sample the source texture with the reordered UV coordinates
  gl_FragColor = texture2D(uSampler, reorderedUV);
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

let video = document.querySelectorAll("video[id^='video-']")[0];
const canvas = document.createElement("canvas");
const reloadBtn = document.getElementsByClassName('icon')[8];
canvas.style.position = "absolute";
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.style.zIndex = "5";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.overflow = "hidden";
video.parentNode.insertBefore(canvas, video.nextSibling);
const gl = canvas.getContext("webgl");
video.addEventListener('play', () => {
  const shaderProgram = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  );

  function render() {
    if(document.getElementById(video.id) == null)video = document.querySelectorAll("video[id^='video-']")[0];
    const texture = loadTexture(gl, video);
    renderTexture(gl, shaderProgram, texture);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});