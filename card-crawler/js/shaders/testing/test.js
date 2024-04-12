// the position order goes as follows:
//     bottom left
//     bottom right
//     top left
//     top right

const vertex_shader = `#version 300 es
in vec4 a_position;

out vec4 forFragColor;

void main() {
    forFragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

const fragment_shader = `#version 300 es
precision mediump float;
uniform float u_time;

out vec4 outColor;
in vec4 forFragColor;

void main() {
    outColor = forFragColor;
}
`;

export default {vertex: vertex_shader, fragment: fragment_shader}