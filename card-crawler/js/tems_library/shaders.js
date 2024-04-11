import { WebGLTopCtx } from "../global.js";

const vertex_shader_source = `
attribute vec4 a_position;

void main() {
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
}
`;

const fragment_shader_source = `
precision mediump float;
uniform float u_time;

void main() {
    float red = sin(u_time * 0.5) * 0.5 + 0.5; // Example animation using sine function
    float green = cos(u_time * 0.3) * 0.5 + 0.5; // Another example animation
    float blue = mod(u_time * 0.1, 1.0); // Yet another example animation
    gl_FragColor = vec4(red, green, blue, 1.0);
}
`;
  
let time_counter = 0

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}


const gl = WebGLTopCtx
const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_source);
const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);
const program = createProgram(gl, vertex_shader, fragment_shader);

const position_attribute_location = gl.getAttribLocation(program, 'a_position');
const position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);

// the position order goes as follows:
//     bottom left
//     bottom right
//     top left
//     top right
const positions = [
    -0.7, -0.9,
    0.9, -0.7,
    -0.9, 0.7,
    0.7, 0.9,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(position_attribute_location);
gl.vertexAttribPointer(position_attribute_location, 2, gl.FLOAT, false, 0, 0);

gl.clearColor(0, 0, 0, 0);

function render() {
    // Update time
    time_counter += 0.05; // Adjust the increment as needed
    console.log(time_counter)
    // if (time_counter > 4) {
    //     time_counter = 0;
    // }

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use the shader program
    gl.useProgram(program);

    // Set the time uniform
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time_counter);

    // Draw
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Request the next frame
    // requestAnimationFrame(render);
}


export function testShader() {
    render()
}