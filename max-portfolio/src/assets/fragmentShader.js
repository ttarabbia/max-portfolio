const fragmentShader = 
`
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
    fragCoord = fragCoord + vec2(iTime*50.0*iSpeed,0.0);
    float scale = iScale/100.0;
    
    //6 Octaves of noise
    vec3 color;
    //color = vec3(Noise(gl_FragCoord.xy ,20.0,scale),Noise(gl_FragCoord.xy ,10.0,scale),Noise(gl_FragCoord.xy ,3.0,scale));
    color = vec3(Noise(gl_FragCoord.xy,1.0,scale)*0.5 + Noise(gl_FragCoord.xy,2.0,scale*2.0)*0.25 + 
    Noise(gl_FragCoord.xy,3.0,scale*4.0)*0.125 + Noise(gl_FragCoord.xy,4.0,scale*8.0)*0.0625 
    + Noise(gl_FragCoord.xy,5.0,scale*16.0)*0.03125 + Noise(gl_FragCoord.xy,6.0,scale*32.0)*0.015625);
    
    
    fragColor = vec4(color.xyz,1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
 
`

export default fragmentShader