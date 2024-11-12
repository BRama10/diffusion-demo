// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
    prompt: z.string().min(1),
    num_inference_steps: z.number().min(0).max(100).optional().default(27),
    guidance_scale: z.number().min(0).max(100).optional().default(27),
    aspect_ratio: z.string().min(1),
    accept: z.enum(['image/jpeg', 'image/png']).default('image/jpeg'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = requestSchema.parse(body);

        console.log(validatedData)

        const response = await fetch(
            'https://api.fireworks.ai/inference/v1/workflows/accounts/fireworks/models/stable-diffusion-3p5-large-turbo/text_to_image',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FIREWORKS_API_KEY}`,
                    'Accept': validatedData.accept
                },
                body: JSON.stringify({
                    prompt: validatedData.prompt,
                    num_inference_steps: validatedData.num_inference_steps,
                    guidance_scale: validatedData.guidance_scale,
                    aspect_ratio: validatedData.aspect_ratio
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.log('error', error)
            return NextResponse.json(
                { error: error.message || 'Failed to generate image' },
                { status: response.status }
            );
        }

        const imageBuffer = await response.arrayBuffer();


        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': validatedData.accept,
                'Cache-Control': 'public, max-age=31536000',
            },
        });

    } catch (error) {
        console.error('Error processing request:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}