export const Shaders = [
  {"shader": `
  uniform float iTime;
  uniform float iScale;
  uniform float iSpeed;
  void main() {
    // 500.0 is an arbitrary value to "normalize"
    // my coordinate system
    // In these examples consider the value of x 
    // to go from 0 to 1.
    float x = (gl_FragCoord.x * iScale) / 500.0 - fract(iTime);
    vec3 color = vec3(x);
  
    gl_FragColor = vec4(color,1.0);
  }`, 
  "controls": {
    iSpeed: {value: 1.0, min: 0.1, max: 50.},
    iScale: {value: 0.5, min: 0.05, max: 20.},
    Other: {value: "10", min: 1, max: 32, step: 1},
    Other2: {value: "32", min: 0, max: 512, step: 16},
    color: {value: "#ff005b"}
  }},
  {"shader" :
  `
  uniform vec2 iMouse;
  uniform float iTime;
  uniform float iSpeed;
  uniform vec2 iResolution;

  //Z resolution and length

  #define STEPLENGTH 0.002
  #define VIEWDISTANCE 1.0

  #define BRIGHTNESS 15.0

  //Interpolation used when blending between cell corners
  float sineint (float x){

    float sineval = (0.5+cos(x*3.14159)*0.5);
    float floatval = 1.0-x;
    float mixfac = 1.0;
    
    //return sineval,*mixfac + floatval*(1.0-mixfac);
    return pow(1.0-x,1.3);

  }
  //Pseudo-RNG used to determine values at set points
  float PRNG2d(vec2 coord,float seed){

      seed = mod(seed+ 0.01,100.0);
      seed = seed/20.0;
      coord = mod(coord,1000.0);
      float x = mod(pow(coord.x,1.541523) * 0.1588235 + seed/20.65546689 + pow(coord.y * seed/8.51325,1.563) * 5.55464, 0.2)/0.2;
      x = clamp(x,0.0,1.0);
      x = mod(coord.x * 1.365448 * (seed/5.23648564) + coord.y * 2.21658+ x*2.05213,x)/x;
      x = clamp(x,0.0,1.0);
      x = mod(pow (coord.y + coord.x+2.5248,x)*20.0,1.0);
      
      return x;
  }

  float Noise(vec2 InputCoord, float seed, float scale)
  {

      InputCoord = InputCoord*scale;
      
      //Cell corner positions
      vec2 cor1 = vec2(floor(InputCoord.x),floor(InputCoord.y));
      vec2 cor2 = vec2(ceil(InputCoord.x),floor(InputCoord.y));
      vec2 cor3 = vec2(floor(InputCoord.x),ceil(InputCoord.y));
      vec2 cor4 = vec2(ceil(InputCoord.x),ceil(InputCoord.y));
      //Distances to Cell corners
      float dist1 = distance(InputCoord,cor1);
      float dist2 = distance(InputCoord,cor2);
      float dist3 = distance(InputCoord,cor3);
      float dist4 = distance(InputCoord,cor4);
      //Values of cell corners
      float val1 = PRNG2d(cor1,seed);
      float val2 = PRNG2d(cor2,seed);
      float val3 = PRNG2d(cor3,seed);
      float val4 = PRNG2d(cor4,seed);
      //Absolute weight of corners based on proximity 
      float weight1 = sineint(clamp(dist1,0.0,1.0));
      float weight2 = sineint(clamp(dist2,0.0,1.0));
      float weight3 = sineint(clamp(dist3,0.0,1.0));
      float weight4 = sineint(clamp(dist4,0.0,1.0));
      
      //Factor used to trim weights to add to 1.0
      float TrimFactor = 1.0/(weight1 + weight2 + weight3 + weight4);
      //TrimFactor = 1.0;
      float value = val1*weight1*TrimFactor + val2*weight2*TrimFactor + val3*weight3*TrimFactor + val4*weight4*TrimFactor;
      return value;   
  }

  vec3 SphereNormal (vec3 InputCoord, vec3 ObjectCoord, float Radius){
      
      float dist = distance(InputCoord,ObjectCoord);
      float iscollided = float(dist < Radius);
      vec3 norm = normalize(InputCoord-ObjectCoord);
      
      return vec3(norm*iscollided);

  }
  vec3 BevelCube (vec3 InputCoord, vec3 ObjectCoord, float size, float bevel){
      
      float beveledsize = size*0.5-bevel;
      vec3 localcoord = InputCoord - ObjectCoord;
      vec3 clampedcoord = clamp(localcoord,-1.0*beveledsize,beveledsize);
      float dist = distance(clampedcoord, localcoord);
      vec3 norm = normalize(localcoord-clampedcoord+ vec3(0.0,0.01,0.0));
      
      return (norm) * float(dist<=bevel);

  }
  vec3 lighting(vec3 normals, vec3 lightdir, vec3 color, float roughness)
  {
      vec3 Output = color;
      vec3 reflecVec = reflect(vec3(0.0,0.0,1.0),normals);
      lightdir = normalize(lightdir)*float(lightdir!=vec3(0.0,0.0,0.0));
      
      Output = color*dot(normals,lightdir)*roughness;
      Output += (1.0-roughness)* pow(clamp(dot(lightdir,reflecVec),0.0,1.0),1.0/roughness);
      
      return max(Output,0.0);
  }
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      // Normalized pixel coordinates (from 0 to 1)
      vec2 uv = fragCoord/iResolution.xy;
      vec2 evenUV = uv*2.0-1.0;
      
      evenUV = vec2(evenUV.x*(iResolution.x/iResolution.y),evenUV.y);
      
      float zdepth = 0.0;
      
      vec3 SphereCoord = vec3(0.0,0.0,0.6);
      
      vec3 norm = vec3(0.0,0.0,0.0);
      float i;
      for (i=0.0 ; i<(float(VIEWDISTANCE) / STEPLENGTH);i++){
          
          norm = norm + vec3(zdepth==0.0)*(BevelCube(vec3(evenUV,i*STEPLENGTH),SphereCoord,1.0,abs(sin(iTime*0.5)/4.0)));
              
          zdepth = zdepth + (float(norm!=vec3(0.0,0.0,0.0))*i*STEPLENGTH*float(zdepth==0.0));
          
          
      }
      //norm = normalize(vec3(0.0,0.0,-0.1));
      vec3 col;
      vec3 color = vec3(0.5,1.0,1.0);
      vec2 evenMouse = iMouse.xy*2.0/iResolution.xy-1.0;
      // vec2 evenMouse = vec2(3.0, 8.0)*2.0/iResolution.xy-1.0;     
      color = vec3(Noise(evenMouse,1.0,4.0),Noise(evenMouse,2.0,4.0),Noise(evenMouse,3.0,4.0));
      color = color*BRIGHTNESS;
      vec3 lightdir = normalize(vec3(evenMouse,distance(evenMouse,vec2(0.0))-0.4));
      col = (vec3(0.1)+lighting(norm,lightdir,color,0.1))*float(zdepth!=0.0) ;
      //+ float(zdepth==0.0)*(Noise(vec2(evenUV.y,evenUV.x*0.03),6.0,8.0)*0.8)*vec3(0.8,1.0,1.0);
      
      //col = SphereNormal(vec3(evenUV,iTime),SphereCoord,0.5);
      //fragColor = vec4(reflect(vec3(0.0,0.0,1.0),norm),1.0);
      fragColor = vec4(col,1.0);
  }


  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
 
  `,
  "controls" : {
    iSpeed: {value: 6.0, min: 0.1, max: 50.},
    iScale: {value: 9.2, min: 0.05, max: 20.},
    Other: {value: 30, min: 1, max: 32, step: 1},
    Other2: {value: 32, min: 0, max: 512, step: 16},
    color: {value: "#ff005b"}
  }},
  {"shader": `
  uniform float iTime;
  void main() {
    float y = gl_FragCoord.y / 500.0;
    vec3 color = vec3(sin(y * 3.0 + iTime));
      
    gl_FragColor = vec4(color,1.0);
  }
  `,
  "controls" : {
    iSpeed: {value: 1.0, min: 0.1, max: 50.},
    iScale: {value: 0.5, min: 0.05, max: 20.},
    Other: {value: "10", min: 1, max: 32, step: 1},
    Other2: {value: "32", min: 0, max: 512, step: 16},
    color: {value: "#ff005b"}
  }},
  {"shader": `
  uniform float iTime;
  uniform float iScale;
  uniform float iSpeed;
  //Sets the scale of the noise
  
  #define SCALE 1
  
  
  //Interpolation used when blending between cell corners
  float sineint (float x){
  
     float sineval = (0.5+cos(x*3.14159)*0.5);
     float floatval = 1.0-x;
     float mixfac = 1.0;
     
     //return pow(sineval,0.85)*mixfac + floatval*(1.0-mixfac);
     return pow(1.0-x,1.3);
  
  }
  //Pseudo-RNG used to determine values at set points
  float PRNG2d(vec2 coord,float seed){
  
      seed = mod(seed+ 0.01,100.0);
      seed = seed/20.0;
      coord = mod(coord,1000.0);
      float x = mod(pow(coord.x,1.541523) * 0.1588235 + seed/20.65546689 + pow(coord.y * seed/8.51325,1.563) * 5.55464, 0.2)/0.2;
      x = clamp(x,0.0,1.0);
      x = mod(coord.x * 1.365448 * (seed/5.23648564) + coord.y * 2.21658+ x*2.05213,x)/x;
      x = clamp(x,0.0,1.0);
      x = mod(pow (coord.y + coord.x,x)*20.0,1.0);
      
      return x;
  }
  
  float Noise(vec2 InputCoord, float seed, float scale)
  {
  
      InputCoord = InputCoord*scale;
      
      //Cell corner positions
      vec2 cor1 = vec2(floor(InputCoord.x),floor(InputCoord.y));
      vec2 cor2 = vec2(ceil(InputCoord.x),floor(InputCoord.y));
      vec2 cor3 = vec2(floor(InputCoord.x),ceil(InputCoord.y));
      vec2 cor4 = vec2(ceil(InputCoord.x),ceil(InputCoord.y));
      //Distances to Cell corners
      float dist1 = distance(InputCoord,cor1);
      float dist2 = distance(InputCoord,cor2);
      float dist3 = distance(InputCoord,cor3);
      float dist4 = distance(InputCoord,cor4);
      //Values of cell corners
      float val1 = PRNG2d(cor1,seed);
      float val2 = PRNG2d(cor2,seed);
      float val3 = PRNG2d(cor3,seed);
      float val4 = PRNG2d(cor4,seed);
      //Absolute weight of corners based on proximity 
      float weight1 = sineint(clamp(dist1,0.0,1.0));
      float weight2 = sineint(clamp(dist2,0.0,1.0));
      float weight3 = sineint(clamp(dist3,0.0,1.0));
      float weight4 = sineint(clamp(dist4,0.0,1.0));
      
      //Factor used to trim weights to add to 1.0
      float TrimFactor = 1.0/(weight1 + weight2 + weight3 + weight4);
      //TrimFactor = 1.0;
      float value = val1*weight1*TrimFactor + val2*weight2*TrimFactor + val3*weight3*TrimFactor + val4*weight4*TrimFactor;
      return value;   
  }
  
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
  
      //Coord offset animation
      fragCoord = fragCoord + vec2(iTime*100.0*iSpeed,0.0);
      float scale = iScale/100.0;
      
      //6 Octaves of noise
      vec3 color;
      //color = vec3(Noise(fragCoord.xy ,20.0,scale),Noise(fragCoord.xy ,10.0,scale),Noise(fragCoord.xy ,3.0,scale));
      color = vec3(Noise(fragCoord.xy,1.0,scale)*0.5 + Noise(fragCoord.xy,2.0,scale*2.0)*0.25 + 
      Noise(fragCoord.xy,3.0,scale*4.0)*0.125 + Noise(fragCoord.xy,4.0,scale*8.0)*0.0625 
      + Noise(fragCoord.xy,5.0,scale*16.0)*0.03125 + Noise(fragCoord.xy,6.0,scale*32.0)*0.015625);
      
      
      fragColor = vec4(color.xyz,1.0);
  }
  
  void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
  }
   
  `,  
  "controls" : {
    iSpeed: {value: 1.0, min: 0.1, max: 50.},
    iScale: {value: 0.5, min: 0.05, max: 20.},
    Other: {value: "10", min: 1, max: 32, step: 1},
    Other2: {value: "32", min: 0, max: 512, step: 16},
    color: {value: "#ff005b"}
  }},
  {"shader" :
  `
  uniform float iScale;
  uniform float iTime;
  uniform float iSpeed;
  varying vec2 vUv;

  vec3 colorA = vec3(0.912,0.191,0.652);
  vec3 colorB = vec3(1.000,0.777,0.052);

  void main() {
    vec3 color = mix(colorA, colorB, vUv.x);

    gl_FragColor = vec4(fract(color+iTime*iSpeed),1.0);
  }

  `,
  "controls" : {
    iSpeed: {value: 1.0, min: 0.1, max: 50.},
    iScale: {value: 0.5, min: 0.05, max: 20.},
    Other: {value: "10", min: 1, max: 32, step: 1},
    Other2: {value: "32", min: 0, max: 512, step: 16},
    color: {value: "#ff005b"}
  }},
  {"shader" : `

  uniform vec2 iResolution;
  uniform vec2 iMouse;

  #define DELTA 0.0001
#define COLLISIONLENGTH 0.005
#define VIEWDISTANCE 10.0

#define BRIGHTNESS 5.0
#define FOV 10.0
#define PI 3.1415926


//Interpolation used when blending between cell corners
float sineint (float x){

   float sineval = (0.5+cos(x*3.14159)*0.5);
   float floatval = 1.0-x;
   float mixfac = 1.0;
   
   //return pow(sineval,0.85)*mixfac + floatval*(1.0-mixfac);
   return pow(1.0-x,1.7);

}
//Pseudo-RNG used to determine values at set points
float PRNG2d(vec2 coord,float seed){

    seed = mod(seed+ 0.01,100.0);
    seed = seed/20.0;
    coord = mod(coord,1000.0);
    float x = mod(pow(coord.x,1.541523) * 0.1588235 + seed/20.65546689 + pow(coord.y * seed/8.51325,1.563) * 5.55464, 0.2)/0.2;
    x = clamp(x,0.0,1.0);
    x = mod(coord.x * 1.365448 * (seed/5.23648564) + coord.y * 2.21658+ x*2.05213,x)/x;
    x = clamp(x,0.0,1.0);
    x = mod(pow (coord.y + coord.x,x)*20.0,1.0);
    
    return x;
}

float Noise(vec2 InputCoord, float seed, float scale)
{

    
    
    InputCoord = InputCoord*scale;
    
    //Cell corner positions
    vec2 cor1 = vec2(floor(InputCoord.x),floor(InputCoord.y));
    vec2 cor2 = vec2(ceil(InputCoord.x),floor(InputCoord.y));
    vec2 cor3 = vec2(floor(InputCoord.x),ceil(InputCoord.y));
    vec2 cor4 = vec2(ceil(InputCoord.x),ceil(InputCoord.y));
    //Distances to Cell corners
    float dist1 = distance(InputCoord,cor1);
    float dist2 = distance(InputCoord,cor2);
    float dist3 = distance(InputCoord,cor3);
    float dist4 = distance(InputCoord,cor4);
    //Values of cell corners
    float val1 = PRNG2d(cor1,seed);
    float val2 = PRNG2d(cor2,seed);
    float val3 = PRNG2d(cor3,seed);
    float val4 = PRNG2d(cor4,seed);
    //Absolute weight of corners based on proximity 
    float weight1 = sineint(clamp(dist1,0.0,1.0));
    float weight2 = sineint(clamp(dist2,0.0,1.0));
    float weight3 = sineint(clamp(dist3,0.0,1.0));
    float weight4 = sineint(clamp(dist4,0.0,1.0));
    
    //Factor used to trim weights to add to 1.0
    float TrimFactor = 1.0/(weight1 + weight2 + weight3 + weight4);
    //TrimFactor = 1.0;
    float value = val1*weight1*TrimFactor + val2*weight2*TrimFactor + val3*weight3*TrimFactor + val4*weight4*TrimFactor;
    return value;   
}


//Sphere SDF
float spheredist(vec3 ICoord)
{
    float scale = 5.0;
    vec3 SCoord = vec3(2.0,4.0,20.0);
    float radius = 3.0;
    
    float distToCenter = distance(ICoord,SCoord); 
    
    float noiseval = Noise(vec2(ICoord.x,ICoord.z),20.0,0.5)*0.5
    +Noise(vec2(ICoord.x,ICoord.z),10.0,1.0)*0.25+
    Noise(vec2(ICoord.x,ICoord.z),50.0,2.0)*0.125+
    Noise(vec2(ICoord.x,ICoord.z),2.0,4.0)*0.0625+
    Noise(vec2(ICoord.x,ICoord.z),1.0,8.0)*0.03125+
    Noise(vec2(ICoord.x,ICoord.z),8.0,16.0)*0.015625+
    Noise(vec2(ICoord.x,ICoord.z),16.0,32.0)*0.0078125+
    Noise(vec2(ICoord.x,ICoord.z),32.0,64.0)*0.00390625/*+
    Noise(vec2(ICoord.x,ICoord.z),64.0,128.0)*0.00195312+
    Noise(vec2(ICoord.x,ICoord.z),52.0,256.0)*0.00097656*/;    
    
    noiseval = (noiseval-0.5)*scale;
    
    noiseval = ICoord.y-noiseval+1.0;
    return noiseval/scale;
    
    
    
    
    
    //return distToCenter - radius;
    

}
//Noise SDF
float Noisedist(vec3 ICoord)
{
    float noiseval = Noise(vec2(ICoord.x,ICoord.z),20.0,1.0);
    noiseval = ICoord.y-noiseval;
 
 
    return noiseval;
}
vec3 fieldDelta(vec3 ICoord)
{

    vec3 Delta = vec3(
    spheredist(ICoord)-spheredist(ICoord+vec3(DELTA,0.0,0.0)),
    spheredist(ICoord)-spheredist(ICoord+vec3(0.0,DELTA,0.0)),
    spheredist(ICoord)-spheredist(ICoord+vec3(0.0,0.0,DELTA)));
    
    Delta = Delta*vec3(-1.0/DELTA);
    
    return Delta;

}
vec3 lighting(vec3 normals, vec3 lightdir, vec3 color, float roughness)
{
    vec3 Output = color;
    vec3 reflecVec = reflect(vec3(0.0,0.0,1.0),normals);
    lightdir = normalize(lightdir)*float(lightdir!=vec3(0.0,0.0,0.0));
    
    Output = color*dot(normals,lightdir)*roughness;
    Output += (1.0-roughness)* pow(clamp(dot(lightdir,reflecVec),0.0,1.0),1.0/roughness);
    
    return max(Output,0.0);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    vec2 fixeduv = vec2(uv.x*(iResolution.x/iResolution.y),uv.y);
    fixeduv = fixeduv-vec2((iResolution.x/iResolution.y)/2.0,0.5);
    fixeduv*=2.0;
    
    float radfov = FOV * (PI/180.0);
    
    vec3 norm = vec3(0.0);
    float zdepth = 0.0;
    vec3 RayCoord = vec3(fixeduv,0.0);
    float RayDist = 0.01;
    vec2 offsetfactor = tan(radfov) * fixeduv;
    vec3 vecoffset = vec3(0.0);
    int i = 0;
    do {
        
        RayDist = spheredist(RayCoord);
        vecoffset = vec3(RayDist*offsetfactor, RayDist);

        vecoffset = vecoffset*(RayDist/length(vecoffset));
        
        RayCoord = RayCoord+vecoffset;
        zdepth += RayDist;
        
        
        
        
        
        if (RayDist < COLLISIONLENGTH) {
            
            norm = fieldDelta(RayCoord);
            RayDist = VIEWDISTANCE+20.0;
       
       }
        i+=1;
       } 
    while (RayDist < VIEWDISTANCE);
    //Surface Shader code

    vec3 CamRay = normalize(vec3(offsetfactor,1.0));    
    float fresnel = dot(-CamRay,norm);
    
    vec3 col;
    vec3 color = vec3(0.5,1.0,1.0);
    vec2 evenMouse = iMouse.xy*2.0/iResolution.xy-1.0;
    color = vec3(Noise(evenMouse,1.0,4.0),Noise(evenMouse,2.0,4.0),Noise(evenMouse,3.0,4.0));
    color = color*BRIGHTNESS;
    vec3 lightdir = normalize(vec3(evenMouse,distance(evenMouse,vec2(0.0))-0.4));
    col = (vec3(0.1)+lighting(norm,lightdir,color,0.5))*float(zdepth<100.0) ;
    
    // Output to screen
    //fragColor = float(zdepth < 50.0) * vec4(1.0-fresnel);
    fragColor = vec4(col,1.0);    
  }
  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  `, 
  "controls" : {
    iSpeed: {value: 1.0, min: 0.1, max: 50.},
    iScale: {value: 0.5, min: 0.05, max: 20.},
    Other: {value: "10", min: 1, max: 32, step: 1},
    Other2: {value: "32", min: 0, max: 512, step: 16},
    color: {value: "#ff005b"}
  }}

]
  