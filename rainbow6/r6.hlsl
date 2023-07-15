float4 render(float2 uv){
    float4 color = image.Sample(builtin_texture_sampler, uv);
    float ditherPattern[8][8] = {
        { 0,32,8,40,2,34,10,42}, 
        {48,16,56,24,50,18,58,26}, 
        {12,44,4,36,14,46,6,38}, 
        {60,28,52,20,62,30,54,22}, 
        { 3,35,11,43, 1,33,9,41}, 
        { 51, 19, 59, 27, 49, 17,57,25}, 
        {15,47, 7,39,13,45,5,37}, 
        {63,31,55,23,61,29,53,21} 
    };
    float gray = dot(color.rgb, float3(0.299, 0.587, 0.114));
    float2 ditherPos = uv % 8;
    float threshold = ditherPattern[ditherPos.x][ditherPos.y] / 64;
    if (gray> threshold){ 
        return float4(1,1,1,1); 
    }
    else{
        return float4(0,0,0,1); 
    }
}