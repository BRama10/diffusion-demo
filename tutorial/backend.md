# Building a Next.js Image Generation API Route with RunPod - Step-by-Step Tutorial

## Step 1: Setting Up Basic Imports and Types

First, let's set up our imports and base structure:

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';  // For request validation

export async function POST(request: Request) {
    try {
        // We'll add the handler logic next
        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
```

**What's happening here?**
- Setting up the basic Next.js API route structure
- Importing necessary dependencies
- Creating a basic error handling structure

## Step 2: Adding Request Validation Schema

Let's define the validation schema for our request:

```typescript
const requestSchema = z.object({
    // Text description for image generation
    prompt: z.string().min(1),
    
    // Number of steps for generation process (default: 27)
    num_inference_steps: z.number()
        .min(0).max(100).optional().default(27),
    
    // How closely to follow the prompt (default: 27)
    guidance_scale: z.number()
        .min(0).max(100).optional().default(27),
    
    // Image dimensions (e.g., "16:9")
    aspect_ratio: z.string().min(1),
});
```

**What's happening here?**
- Defining validation rules for each field
- Setting appropriate constraints and defaults
- Adding type safety to our inputs

## Step 3: Implementing Request Parsing

Now let's add the request parsing logic:

```typescript
    try {
        // Parse and validate the incoming request body
        const body = await request.json();
        const validatedData = requestSchema.parse(body);
        
        // Log for debugging
        console.log('Validated request:', validatedData);

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
```

**What's happening here?**
- Parsing the incoming JSON request
- Validating against our schema
- Adding specific error handling for validation failures

## Step 4: Adding RunPod API Integration

Let's add the API call to RunPod:

```typescript
        // After validation...
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
```

**What's happening here?**
- Making the request to RunPod's API
- Structuring the request body correctly
- Adding authentication header

## Step 5: Handling API Errors

Add error handling for the API response:

```typescript
        if (!response.ok) {
            const error = await response.json();
            console.log('RunPod API error:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to generate image' },
                { status: response.status }
            );
        }

        // Parse the successful response
        const result = await response.json();
```

**What's happening here?**
- Checking for API errors
- Parsing error messages
- Maintaining proper error status codes

## Step 6: Processing the Image Response

Add image processing and metrics logging:

```typescript
        // Log performance metrics
        console.log('RunPod response time metrics:', {
            delayTime: result.delayTime,
            executionTime: result.executionTime,
            id: result.id
        });

        // Convert the base64 image data to a buffer
        const imageBuffer = Buffer.from(result.output, 'base64');
```

**What's happening here?**
- Logging performance metrics
- Converting base64 image data to a buffer

## Step 7: Finalizing the Response

Add the final response handling:

```typescript
        // Return the image with appropriate headers
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            },
        });
```

**What's happening here?**
- Returning the image data
- Setting appropriate cache headers
- Ensuring proper content delivery

## Environment Setup

Create a `.env.local` file:

```bash
RUNPOD_API_KEY=your_api_key_here
```

## Testing

Test with curl:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene landscape with mountains",
    "num_inference_steps": 30,
    "guidance_scale": 7.5,
    "aspect_ratio": "16:9"
  }'
```

Or with JavaScript:

```javascript
const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: 'A serene landscape with mountains',
        num_inference_steps: 30,
        guidance_scale: 7.5,
        aspect_ratio: '16:9'
    })
});

if (response.ok) {
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    // Use imageUrl in an img tag
}
```

---
← [Deploy](./deploy.md) | [Component →](./component.md)