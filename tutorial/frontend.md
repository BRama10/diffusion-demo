# Building the Main Page Component - Step by Step Guide

## Step 1: Initial Setup and Imports

Create a new file `app/page.tsx`:

```typescript
'use client'

import type { GenerationSettings } from '@/components/ImageGenerator';
import ImageGenerator from '@/components/ImageGenerator';
import { useState } from 'react';

export default function Home() {
    return (
        <div>Main Page</div>
    );
}
```

**What's happening here?**
- Setting up client-side component with 'use client'
- Importing GenerationSettings type and ImageGenerator component
- Importing useState hook for state management

## Step 2: Adding Component State

Add state management for loading and errors:

```typescript
export default function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div>Main Page</div>
    );
}
```

**What's happening here?**
- Adding loading state for generation process
- Adding error state for error handling
- Using TypeScript for proper type definitions

## Step 3: Implementing Generate Function

Add the image generation handler:

```typescript
    const generateImage = async (settings: GenerationSettings) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: settings.prompt,
                    num_inference_steps: settings.numInferenceSteps,
                    guidance_scale: settings.guidanceScale,
                    aspect_ratio: settings.aspectRatio,
                    accept: settings.accept
                }),
            });
```

**What's happening here?**
- Creating async function to handle image generation
- Setting loading state and clearing previous errors
- Making POST request to generate API endpoint
- Formatting request body with generation settings

## Step 4: Adding Response Handling

Add error handling and response processing:

```typescript
    const generateImage = async (settings: GenerationSettings) => {
        try {
            // Previous fetch code...

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate image');
            }

            const imageBlob = await response.blob();
            return URL.createObjectURL(imageBlob);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to generate image';
            setError(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };
```

**What's happening here?**
- Checking response status and handling errors
- Converting successful response to blob
- Creating object URL for the image
- Setting error message on failure
- Ensuring loading state is reset

## Step 5: Adding Component Layout

Add the component's JSX structure:

```typescript
    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Image Generator</h1>
                <ImageGenerator 
                    onGenerate={generateImage} 
                    isLoading={loading}
                    error={error}
                />
            </main>
        </div>
    );
```

**What's happening here?**
- Creating full-height page layout
- Adding centered container for content
- Including page title
- Rendering ImageGenerator component with props

---
← [Component](./component.md)