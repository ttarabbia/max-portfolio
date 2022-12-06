const fragmentShader2 = 
`
uniform float iTime;

void main() {
  vec2 point = gl_FragCoord.xy / 500.0;
  vec3 color = vec3(1.0 - 2.0 * 
    distance(point, vec2(0.5)));
  
  gl_FragColor = vec4(fract(color + iTime),1.0);
}

`

export default fragmentShader2