// app/page.tsx
'use client'

import type { GenerationSettings } from '@/components/ImageGenerator';
import ImageGenerator from '@/components/ImageGenerator';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateImage = async (settings: GenerationSettings) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second in milliseconds
    let attempts = 0;

    try {
      setLoading(true);
      setError(null);

      let response: any;

      while (attempts < MAX_RETRIES) {
        try {
          response = await fetch('/api/generate', {
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

          if (response.status === 504) {
            attempts++;
            if (attempts < MAX_RETRIES) {
              await sleep(RETRY_DELAY);
              continue;
            }
            throw new Error('Gateway Timeout: Server took too long to respond after multiple retries');
          }

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate image');
          }

          const imageBlob = await response.blob();
          return URL.createObjectURL(imageBlob);

        } catch (error) {
          if (error instanceof Error && response?.status !== 504) {
            throw error;
          }
          // If it's a 504 error, the while loop will continue if there are remaining attempts

          console.log('Retrying....')
        }
      }

      // This line will only be reached if all retries failed with 504
      throw new Error('Gateway Timeout: Server took too long to respond after multiple retries');

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