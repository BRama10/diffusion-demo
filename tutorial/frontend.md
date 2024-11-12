# Building the Main Page Component - Step by Step Guide

## Step 1: Initial Setup and Imports

Create a new file `app/page.tsx`:

```typescript
'use client'

import type { GenerationSettings } from '@/components/ImageGenerator';
import ImageGenerator from '@/components/ImageGenerator';
import { useState } from 'react';
```

**What's happening here?**
- Marking as client component
- Importing our ImageGenerator and its types
- Importing useState for managing local state

## Step 2: Component Shell and State Setup

Add the component structure and state:

```typescript
// Previous imports...

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

}
```

**What's happening here?**
- Creating the main page component
- Setting up loading state for image generation
- Setting up error state for handling failures

## Step 3: Image Generation Handler

Add the function that handles image generation:

```typescript
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    }
  }

}
```

**What's happening here?**
- Creating async function to handle image generation
- Setting loading state and clearing previous errors
- Making POST request to our API endpoint
- Sending all generation settings in the request body

## Step 4: Error Handling

Add error handling for the API response:

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
- Checking if response was successful
- Converting error response to proper Error object
- Converting successful response to blob and creating URL
- Handling any errors that occur during the process
- Ensuring loading state is always reset

## Step 5: Component Layout

Finally, add the component's JSX:

```typescript
export default function Home() {
  // Previous state and function...

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
}
```

## Step 6

Run

```bash
npm run dev
```

and navigate to https://localhost:3000 to view and interact with your app

---
← [Component](./component.md) | [Deploy →](./deploy.md)