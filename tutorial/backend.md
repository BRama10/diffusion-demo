# Building a Next.js Image Generation API Route - Detailed Tutorial

## Step 1: Setting Up the Basic Route Handler

First, we'll create the foundation of our API route:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // We'll add request handling here
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
- We're importing `NextResponse` from Next.js's server components, which helps us send properly formatted HTTP responses
- We export an async function named `POST` that specifically handles POST requests to this route
- The function takes a standard web Request object as its parameter
- We wrap everything in a try-catch block to handle any unexpected errors
- The catch block logs errors (crucial for debugging) and returns a 500 status code for server errors
- Currently, it just returns a success message (we'll replace this soon)

## Step 2: Adding Request Validation

Now we'll add validation to ensure our API receives the correct data:

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';  // Add this line

const requestSchema = z.object({
    prompt: z.string().min(1),
    num_inference_steps: z.number().min(0).max(100).optional().default(27),
    guidance_scale: z.number().min(0).max(100).optional().default(27),
    aspect_ratio: z.string().min(1),
    accept: z.enum(['image/jpeg', 'image/png']).default('image/jpeg'),
});
```

**What's happening here?**
- We import Zod, a TypeScript-first schema validation library
- We define a schema that specifies exactly what our request body should look like:
  - `prompt`: A non-empty string containing the image description
  - `num_inference_steps`: Optional number (27 by default) controlling the image generation steps
  - `guidance_scale`: Optional number (27 by default) controlling how closely to follow the prompt
  - `aspect_ratio`: A string specifying image dimensions (e.g., "16:9")
  - `accept`: The image format we want, defaulting to JPEG

Now let's modify the handler to use this schema:

```typescript
export async function POST(request: Request) {
    try {
        // Add these lines
        const body = await request.json();
        const validatedData = requestSchema.parse(body);
        
        // Remove this line
        // return NextResponse.json({ message: 'Success' });
        
        // Add this line
        return NextResponse.json({ data: validatedData });
    } catch (error) {
        console.error('Error processing request:', error);

        // Add this block
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
```

**What's happening here?**
- `request.json()` parses the incoming JSON body
- `requestSchema.parse(body)` validates the data and throws a ZodError if anything's wrong
- We add special handling for validation errors, returning a 400 status with detailed error information
- The validated data is automatically typed thanks to Zod's TypeScript integration

## Step 3: Adding API Integration

Now we'll add the call to the Fireworks.ai API:

```typescript
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = requestSchema.parse(body);

        // Add this section
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
    }
}
```

**What's happening here?**
- We're making a POST request to the Fireworks.ai API endpoint
- The headers include:
  - `Content-Type`: Telling the API we're sending JSON
  - `Authorization`: Using an API key stored in environment variables for security
  - `Accept`: Specifying whether we want JPEG or PNG
- The request body contains our validated parameters:
  - `prompt`: The image description
  - `num_inference_steps`: Controls generation quality vs. speed
  - `guidance_scale`: Controls how strictly to follow the prompt
  - `aspect_ratio`: Controls the image dimensions

## Step 4: Adding API Response Handling

Let's handle the API response properly:

```typescript
        const response = await fetch(
            // ... previous fetch configuration ...
        );

        // Add this section
        if (!response.ok) {
            const error = await response.json();
            console.log('error', error);
            return NextResponse.json(
                { error: error.message || 'Failed to generate image' },
                { status: response.status }
            );
        }
```

**What's happening here?**
- `response.ok` checks if the status code is in the successful range (200-299)
- If the response isn't successful:
  - We parse the error message from the API
  - Log it for debugging
  - Return an appropriate error response with the original status code
  - Provide a fallback message if the API doesn't give us one

## Step 5: Adding Image Response Handling

Finally, let's handle the successful image response:

```typescript
        if (!response.ok) {
            // ... error handling ...
        }

        // Add these lines
        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': validatedData.accept,
                'Cache-Control': 'public, max-age=31536000',
            },
        });
```

**What's happening here?**
- `response.arrayBuffer()` gets the raw binary image data
- We create a new response containing this binary data
- We set important headers:
  - `Content-Type`: Matches what we requested (JPEG/PNG)
  - `Cache-Control`: Tells browsers to cache the image for a year
- We use `NextResponse` instead of `NextResponse.json()` because we're sending binary data, not JSON


## Environment Setup

Add your API key to `.env.local` and `.env`:

```bash
FIREWORKS_API_KEY=your_api_key_here
```

**Why use .env.local?**
- Keeps sensitive data out of your code
- Prevents accidentally committing API keys to version control
- Allows different keys for different environments
- Next.js automatically loads these environment variables

## Error Handling Best Practices

Here's our complete error handling:

```typescript
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

---
← [Setup](./setup.md) | [Component →](./component.md)