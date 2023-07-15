float4 render(float2 uv)
{
    float4 color = image.Sample(builtin_texture_sampler, uv);
    float sum = color.r + color.g + color.b;
    float gray = sum / 3;
    return float4(gray, gray, gray, color.a);
}