// the position order goes as follows:
//     bottom left
//     bottom right
//     top left
//     top right

const vertex_shader = `
attribute vec4 a_position;

void main() {
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
}
`;

const fragment_shader = `
precision mediump float;
uniform float u_time;

void main() {
    float red = cos(u_time * 0.5);
    float green = cos(u_time * 0.3);
    float blue = cos(u_time * 0.1);
    gl_FragColor = vec4(red, green, blue, 0.3);
}
`;

export default {vertex: vertex_shader, fragment: fragment_shader}