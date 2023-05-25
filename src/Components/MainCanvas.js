import Triangle from "../WebGL/Triangle";

const vertex = `
attribute vec4 a_position;
 
// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("#main-canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, Triangle);

  var program = createProgram(gl, vertexShader, fragmentShader);
}
function MainCanvas() {
  return <canvas id='main-canvas' className='main-canvas -z-10 absolute w-full h-full'></canvas>;
}

export default MainCanvas;
