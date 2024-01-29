varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // pattern 3
    // float strength = vUv.x;

    // pattern 4
    // float strength = vUv.y;

    // pattern 5
    // float strength =  1.0 - vUv.y;
    // gl_FragColor = vec4(abs(vec3(strength - 1.0)), 1.0);

    // pattern 6
    // float strength = vUv.y * 10.0;

    // patter 7
    // float strength = mod(vUv.y * 10.0, 1.0); //  vUv.y * 10.0 % 1.0

    // pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0); 
    // strength = step(0.5, strength); // if strength > 0.5 => 1.0 else => 0.0

    // // pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0); 
    // strength = step(0.8, strength); 

    // pattern 11
    // float strength = mod(vUv.x * 10.0, 1.0); 
    // strength = step(0.8, strength); 

    // pattern 12
    // float strength = step(0.8,  mod(vUv.x * 10.0, 1.0)); 
    // strength += step(0.8,  mod(vUv.y * 10.0, 1.0)); 

    // // pattern 13
    // float strength = step(0.8,  mod(vUv.x * 10.0, 1.0)); 
    // strength *= step(0.8,  mod(vUv.y * 10.0, 1.0)); 

    // pattern 14
    // float strength = step(0.5,  mod(vUv.x * 10.0, 1.0)); 
    // strength *= step(0.8,  mod(vUv.y * 10.0, 1.0)); 
    // gl_FrgColor = vec4(vec3(strength), 1.0);

    // // pattern 15
    // float lineX = step(0.5,  mod(vUv.x * 10.0, 1.0)); 
    // lineX *= step(0.8,  mod(vUv.y * 10.0, 1.0)); 
    
    // float lineY = step(0.8,  mod(vUv.x * 10.0, 1.0)); 
    // lineY *= step(0.5,  mod(vUv.y * 10.0, 1.0));

    // float strength = lineX + lineY;

    //   // pattern 16
    // float lineX = step(0.4,  mod(vUv.x * 10.0, 1.0)); 
    // lineX *= step(0.8,  mod(vUv.y * 10.0 + 0.2, 1.0)); 
    
    // float lineY = step(0.8,  mod(vUv.x * 10.0 + 0.2, 1.0)); 
    // lineY *= step(0.4,  mod(vUv.y * 10.0, 1.0));

    // float strength = lineX + lineY;

    // // pattern 17
    // float strength = abs(vUv.x - 0.5);

    // pattern 18
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // pattern 19
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // pattern 20
    // float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    
    // pattern 21
    // float squareX = floor(vUv.x * 10.0) / 10.0;
    // float squareY = floor(vUv.y * 10.0) / 10.0;
    
    // float strength = squareX * squareY;

    // pattern 22
    // float strength = random(vUv);

    // pattern 23
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);

    // pattern 24
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
    // float strength = random(gridUv);

    // pattern 25
    // float strength = length(vUv - 0.5);
    // float strength = distance(vUv, vec2(0.5, 0.5));
    
    // pattern 26 
    // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));

    // pattern 27 
    // float strength = 0.02 / distance(vUv, vec2(0.5, 0.5));

    // pattern 28
    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45, 
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength =  0.02 / distance(lightUv, vec2(0.5, 0.5));

    // pattern 29
    vec2 lightUvX = vec2(
        vUv.x * 0.1 + 0.45, 
        vUv.y * 0.5 + 0.25
    );
    float lightX =  0.02 / distance(lightUvX, vec2(0.5, 0.5));

    vec2 lightUvY = vec2(
        vUv.y * 0.1 + 0.45, 
        vUv.x * 0.5 + 0.25
    );
    float lightY =  0.02 / distance(lightUvY, vec2(0.5, 0.5));
    float strength = lightX * lightY;

    
    gl_FragColor = vec4(vec3(strength), 1.0);


}