const fragmentShader2 = 
`
uniform float iTime;
uniform float iScale;
uniform float iSpeed;

void main() {
    vec2 point = (gl_FragCoord.xy + iTime) / 500.0;
    vec3 color = vec3(1.0 - 2.0 * 
      distance(point, vec2(0.5) + iTime * iScale));
    vec3 time = vec3(iScale-fract(iTime));
    gl_FragColor = vec4(time.xyz,1.0);
  }
`

export default fragmentShader2