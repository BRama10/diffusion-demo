import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
    prompt: z.string().min(1),
    num_inference_steps: z.number().min(0).max(100).optional().default(27),
    guidance_scale: z.number().min(0).max(100).optional().default(27),
    aspect_ratio: z.string().min(1),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = requestSchema.parse(body);
        console.log('Validated request:', validatedData);

        const response = await fetch(
            `${process.env.RUNPOD_API_URL}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`,
                },
                body: JSON.stringify({
                    input: {
                        prompt: validatedData.prompt,
                        num_inference_steps: validatedData.num_inference_steps,
                        guidance_scale: validatedData.guidance_scale,
                        aspect_ratio: validatedData.aspect_ratio
                    }
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.log('RunPod API error:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to generate image' },
                { status: response.status }
            );
        }

        const result = await response.json();
        console.log('RunPod response time metrics:', {
            delayTime: result.delayTime,
            executionTime: result.executionTime,
            id: result.id
        });

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(result.output, 'base64');

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
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