import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
    prompt: z.string().min(1),
    num_inference_steps: z.number().min(0).max(100).optional().default(27),
    guidance_scale: z.number().min(0).max(100).optional().default(27),
    aspect_ratio: z.string().min(1),
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function makeRunPodRequest(validatedData: z.infer<typeof requestSchema>, maxRetries = 3) {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
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
                console.log(`RunPod API error (attempt ${attempt + 1}/${maxRetries}):`, error);
                lastError = error;
                
                if (attempt < maxRetries - 1) {
                    console.log(`Retrying in 3 seconds...`);
                    await sleep(3000); // Wait 3 seconds before retrying
                    continue;
                }
                
                throw new Error(error.message || 'Failed to generate image');
            }

            const result = await response.json();
            console.log('RunPod response time metrics:', {
                delayTime: result.delayTime,
                executionTime: result.executionTime,
                id: result.id
            });

            return result;
        } catch (error) {
            lastError = error;
            
            if (attempt < maxRetries - 1) {
                console.log(`Request failed (attempt ${attempt + 1}/${maxRetries}). Retrying in 3 seconds...`);
                await sleep(3000); // Wait 3 seconds before retrying
                continue;
            }
            
            throw error;
        }
    }

    throw lastError;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = requestSchema.parse(body);
        console.log('Validated request:', validatedData);

        const result = await makeRunPodRequest(validatedData);

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