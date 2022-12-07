const fragmentShader = 
`
uniform float iTime;
uniform float iScale;
uniform float iSpeed;

void main() {
    vec2 point = (gl_FragCoord.xy + iTime) / 500.0;
    vec3 color = vec3(1.0 - 2.0 * 
      distance(point, vec2(0.5) + iTime * iScale));
    
    gl_FragColor = vec4(color,1.0);
  }
 
`

export default fragmentShader