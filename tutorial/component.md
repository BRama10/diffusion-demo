# Building a React Image Generator Component - Detailed Guide

## Step 1: Setting Up the Basic Structure

Create a new file `components/ImageGenerator.tsx`:

```typescript
'use client'

import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const ImageGenerator = () => {
    return (
        <div>Image Generator Component</div>
    );
};

export default ImageGenerator;
```

**What's happening here?**
- Using 'use client' for client-side rendering
- Importing necessary React hooks
- Creating a basic component structure

## Step 2: Defining TypeScript Interfaces

Add the type definitions:

```typescript
export interface GenerationSettings {
    prompt: string;
    aspectRatio: string;
    guidanceScale: number;
    numInferenceSteps: number;
    seed: number;
    accept: 'image/jpeg' | 'image/png';
}

interface ImageGeneratorProps {
    onGenerate: (settings: GenerationSettings) => Promise<string>;
    isLoading?: boolean;
    error?: string | null;
}
```

**What's happening here?**
- Defining the shape of our generation settings
- Creating prop types for the component
- Setting up TypeScript type safety

## Step 3: Adding Component State

Set up the component's state management:

```typescript
const ImageGenerator: React.FC<ImageGeneratorProps> = ({
    onGenerate,
    isLoading = false,
    error = null
}) => {
    const [settings, setSettings] = useState<GenerationSettings>({
        prompt: '',
        aspectRatio: '16:9',
        guidanceScale: 0,
        numInferenceSteps: 4,
        seed: 0,
        accept: 'image/jpeg'
    });
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    return (
        <div>Component Content Coming Soon</div>
    );
};
```

**What's happening here?**
- Initializing settings state with defaults
- Adding state for the generated image URL
- Setting up prop destructuring with defaults

## Step 4: Implementing URL Cleanup

Add the cleanup effect:

```typescript
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Clean up object URLs when component unmounts or URL changes
    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    return (
        <div>Content coming soon</div>
    );
```

**What's happening here?**
- Adding cleanup effect for memory management
- Properly handling object URL lifecycle
- Preventing memory leaks

## Step 5: Adding Generate Handler

Implement the generation function:

```typescript
    const handleGenerate = async () => {
        try {
            // Clean up previous URL if it exists
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            
            // Generate new image
            const newImageUrl = await onGenerate(settings);
            setImageUrl(newImageUrl);
        } catch (err) {
            console.error('Error generating image:', err);
        }
    };
```

**What's happening here?**
- Creating an async handler for generation
- Managing URL cleanup before new generation
- Handling errors appropriately

## Step 6: Creating the InfoTooltip Component

```typescript
    const InfoTooltip = ({ text }: { text: string }) => (
        <div className="group relative inline-block">
            <Info className="w-4 h-4 text-gray-400 inline-block ml-2" />
            <div className="invisible group-hover:visible absolute z-10 w-48 px-2 py-1 
                          text-sm text-white bg-gray-700 rounded-md -right-1 top-full mt-1">
                {text}
            </div>
        </div>
    );
```

**What's happening here?**
- Creating a reusable tooltip component
- Implementing hover functionality

**UI/Design Notes:**
- `group` and `group-hover`: Tailwind's group functionality for hover effects
- `relative/absolute` positioning for tooltip placement
- `z-10` ensures tooltip appears above other content
- `invisible/visible` for smooth hover transitions
- Color scheme using gray tones for subtle UI elements
- `text-sm` for readable but compact tooltip text

## Step 7: Building the Main Container

```typescript
    return (
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* Left column coming next */}
                </div>
                <div className="space-y-6">
                    {/* Right column coming soon */}
                </div>
            </div>
        </div>
    );
```

**UI/Design Notes:**
- `max-w-4xl`: Limits width for readability
- `mx-auto`: Centers content horizontally
- `grid-cols-1 md:grid-cols-2`: Responsive layout that stacks on mobile
- `space-y-6`: Consistent vertical spacing between elements
- `gap-6`: Uniform grid spacing
- `p-6`: Comfortable padding around content

## Step 8: Adding the Prompt Input

```typescript
    <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Prompt*
            </label>
            <textarea
                value={settings.prompt}
                onChange={(e) => setSettings({ ...settings, prompt: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]
                         focus:ring-2 focus:ring-orange-200 focus:border-orange-400
                         transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your prompt here..."
                disabled={isLoading}
            />
        </div>
    </div>
```

**UI/Design Notes:**
- `text-sm font-medium`: Consistent label styling
- `min-h-[100px]`: Fixed minimum height for textarea
- `focus:ring-2`: Visual feedback on focus
- `transition-colors`: Smooth color transitions
- `disabled:` modifiers for loading state
- Consistent border radius with `rounded-md`
- Orange accent colors for focus states

## Step 9: Adding Image Display

```typescript
    {imageUrl && (
        <div className="border border-gray-200 rounded-md p-4 
                      shadow-sm hover:shadow-md transition-shadow">
            <img
                src={imageUrl}
                alt="Generated"
                className="w-full rounded-md"
            />
        </div>
    )}

    {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
        </div>
    )}
```

**UI/Design Notes:**
- `shadow-sm` with `hover:shadow-md`: Subtle depth effect
- `transition-shadow`: Smooth hover transitions
- Error message uses red color scheme for warnings
- Consistent rounded corners
- Padding for comfortable spacing
- Background tint for error messages

## Step 10: Adding the Generate Button

```typescript
    <button
        onClick={handleGenerate}
        disabled={isLoading || !settings.prompt}
        className="w-full bg-orange-400 text-white py-2 px-4 rounded-md 
                   hover:bg-orange-500 active:bg-orange-600
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-orange-200"
    >
        {isLoading ? 'Generating...' : 'Generate'}
    </button>
```

**UI/Design Notes:**
- Orange color scheme for primary actions
- `hover/active` states for interaction feedback
- `disabled` styling for inactive state
- `transition-colors` for smooth state changes
- Focus ring for accessibility
- Consistent padding and border radius

## Step 11: Adding Control Options

```typescript
    <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                    Aspect Ratio
                    <InfoTooltip text="The width-to-height ratio of the generated image" />
                </label>
                <select
                    value={settings.aspectRatio}
                    onChange={(e) => setSettings({ ...settings, aspectRatio: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md
                             bg-white shadow-sm focus:ring-2 focus:ring-orange-200
                             focus:border-orange-400 transition-colors"
                >
                    <option value="16:9">16:9</option>
                    <option value="1:1">1:1</option>
                </select>
            </div>
        </div>
    </div>
```

**UI/Design Notes:**
- Options grouped in a light gray container
- Consistent spacing with `space-y-4`
- Subtle shadow on select inputs
- Focus states matching other inputs
- Orange accent colors for focus
- Background color change for visual hierarchy

## Step 12: Adding Slider Controls

```typescript
    <div>
        <label className="flex items-center text-sm font-medium text-gray-700
                         group-hover:text-gray-900 transition-colors">
            Guidance Scale
            <InfoTooltip text="Controls how closely the image follows the prompt" />
        </label>
        <div className="flex items-center space-x-4 mt-2">
            <input
                type="range"
                min="0"
                max="100"
                value={settings.guidanceScale}
                onChange={(e) => setSettings({ 
                    ...settings, 
                    guidanceScale: Number(e.target.value) 
                })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none
                         cursor-pointer accent-orange-400"
            />
            <span className="w-12 text-sm text-gray-600 tabular-nums">
                {settings.guidanceScale}
            </span>
        </div>
    </div>
```

**UI/Design Notes:**
- Custom styled range input
- `accent-orange-400` for slider thumb
- `tabular-nums` for aligned numbers
- Hover effect on labels
- Consistent spacing
- Proper height for easy interaction

## Step 13: Additional UI Components

```typescript
    <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mt-6">
        <div className="flex items-start">
            <Info className="w-5 h-5 text-orange-400 mt-0.5" />
            <div className="ml-3">
                <h4 className="text-sm font-medium text-orange-800">
                    Generation Tips
                </h4>
                <p className="mt-1 text-sm text-orange-700">
                    For best results, try to be specific in your prompts and
                    experiment with different guidance scales.
                </p>
            </div>
        </div>
    </div>
```

**UI/Design Notes:**
- Info box using orange color scheme
- Subtle background tint
- Icon alignment with text
- Proper text hierarchy
- Comfortable padding
- Rounded corners matching other elements

## Design System Overview

**Color Palette:**
- Primary: Orange (`orange-400` to `orange-600`)
- Neutrals: Grays (`gray-50` to `gray-900`)
- Accents: 
  - Success: Green (`green-400`)
  - Error: Red (`red-500`)
  - Info: Blue (`blue-400`)

**Typography:**
- Headers: `text-lg` with `font-medium`
- Body: `text-sm` with `text-gray-700`
- Labels: `text-sm` with `font-medium`

**Spacing:**
- Component spacing: `space-y-6`
- Internal spacing: `space-y-4`
- Padding: `p-4` or `p-6`
- Margins: `mb-4`, `mt-2`, etc.

**Borders & Shadows:**
- Rounded corners: `rounded-md`
- Border colors: `border-gray-200`
- Shadows: `shadow-sm` to `shadow-md`

**Interactive States:**
- Hover: Slightly darker shades
- Focus: Orange ring with lighter background
- Disabled: Gray colors with `not-allowed` cursor
- Active: Darker shades of primary color

## Using the Component

Example usage:

```typescript
import ImageGenerator from './components/ImageGenerator';

const App = () => {
    const handleGenerate = async (settings: GenerationSettings) => {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    return (
        <ImageGenerator
            onGenerate={handleGenerate}
            isLoading={false}
            error={null}
        />
    );
};
```

---
← [Backend](./backend.md) | [Frontend →](./frontend.md)