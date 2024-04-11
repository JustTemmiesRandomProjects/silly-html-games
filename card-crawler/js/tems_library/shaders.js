import { WebGLTopCtx } from "../global.js";

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


export class Shader {
  constructor(gl, positions, shader_source) {
    this.gl = gl
    this.positions = positions

    this.vertex_shader = createShader(gl, gl.VERTEX_SHADER, shader_source.vertex);
    this.fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, shader_source.fragment);
    this.program = createProgram(gl, this.vertex_shader, this.fragment_shader);

    this.position_attribute_location = gl.getAttribLocation(this.program, 'a_position');
    this.position_buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
  

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
    
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(this.position_attribute_location);
    gl.vertexAttribPointer(this.position_attribute_location, 2, gl.FLOAT, false, 0, 0);
    
    gl.clearColor(0, 0, 0, 0);
  }

  render() {
      // Clear the canvas
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // Use the shader program
      this.gl.useProgram(this.program);

      // Set the time uniform
      this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'u_time'), window.performance.now() / 300);

      // Draw
      this.gl.bindVertexArray(this.vao);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      // Request the next frame
      // requestAnimationFrame(render);
  }

  tick() {
    this.render()
  }
}