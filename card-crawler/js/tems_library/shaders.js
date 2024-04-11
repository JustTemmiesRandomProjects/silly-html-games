import { WebGLTopCtx } from "../global.js";

const vertex_shader_source = `#version 300 es
precision highp float;
in vec3 position; // input vertex position from mesh
in vec2 texcoord; // input vertex texture coordinate from mesh
in vec3 normal;   // input vertex normal from mesh

out vec2 tc; // output texture coordinate of vertex
out vec3 fn; // output fragment normal of vertex

void main() {
  tc = texcoord;
  fn = normal;
  gl_Position = vec4(0.5 * position, 1.0);
}

`;

const fragment_shader_source = `#version 300 es
precision highp float;
out vec4 outColor;
in vec2 tc; // texture coordinate of pixel (interpolated)
in vec3 fn; // fragment normal of pixel (interpolated)

void main() {
  outColor = vec4(tc.x, tc.y, 0.0, 1.0);
}
`;

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

function main(gl) {
  // the position order goes as follows:
  //     bottom left
  //     bottom right
  //     top left
  //     top right
  const positions = [
      -0.7, -0.9,
      0.9,  -0.7,
      -0.9, 0.7,
      0.7,  0.9,
  ];
  
    const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_source);
    const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);
    const program = createProgram(gl, vertex_shader, fragment_shader);

    const position_attribute_location = gl.getAttribLocation(program, 'a_position');
    const position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(position_attribute_location);
    gl.vertexAttribPointer(position_attribute_location, 2, gl.FLOAT, false, 0, 0);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export function testShader() {
    main(WebGLTopCtx)
}