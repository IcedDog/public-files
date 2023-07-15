float4 render(float2 uv)
{
    float4 color = image.Sample(builtin_texture_sampler, uv);
    float sum =color.r + color.g + color.b;
    if (sum == 0) {
        color = color + 0.01;
        sum=color.r + color.g + color.b;
    }
    color.rgb =color.rgb/sum;
    float3 convertedColor = float3(color.r, color.g, color.b);
    float4 outputColor = float4(convertedColor, color.a);
    return outputColor;
}