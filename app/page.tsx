// app/page.tsx
'use client'

import type { GenerationSettings } from '@/components/ImageGenerator';
import ImageGenerator from '@/components/ImageGenerator';
import { useState } from 'react';

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